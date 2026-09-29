import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export interface OrderExpiryResult {
  success: boolean;
  cancelled: boolean;
  reason?: string;
  error?: string;
}

interface ItemToReconcile {
  variantId: string;
  quantity: number;
  sku: string;
  productName: string;
}

/**
 * Transactionally expires a PENDING order and safely releases reserved inventory.
 * 
 * Invariants enforced:
 * - Exclusive row lock on Order prevents concurrent mutation race with payment completion.
 * - If order is already PAID/PROCESSING/SHIPPED/DELIVERED: safe no-op (no inventory release).
 * - If order is already CANCELLED: safe no-op.
 * - Reserved stock decrement occurs only if inv.reserved >= item.quantity.
 * - Physical warehouse quantity is strictly untouched.
 * - Order.status becomes CANCELLED.
 * - Order.paymentStatus remains unchanged (PENDING).
 * - Payment.status becomes FAILED if currently PENDING.
 */
export async function expireOrderAndReleaseInventory(
  orderId: string,
  reason: string = "Checkout session expired"
): Promise<OrderExpiryResult> {
  if (!orderId) {
    return { success: false, cancelled: false, error: "Order ID is required." };
  }

  try {
    const result = await prisma.$transaction(async (tx) => {
      // 1. Acquire exclusive row lock on Order to serialize concurrent transitions
      await tx.$queryRaw`SELECT id FROM "Order" WHERE id = ${orderId} FOR UPDATE`;

      // 2. Fetch authoritative snapshot with items and payment under lock
      const order = await tx.order.findUnique({
        where: { id: orderId },
        select: {
          id: true,
          status: true,
          paymentStatus: true,
          orderNumber: true,
          items: {
            select: {
              id: true,
              variantId: true,
              productName: true,
              sku: true,
              quantity: true,
            },
          },
          payment: {
            select: {
              id: true,
              status: true,
            },
          },
        },
      });

      if (!order) {
        return {
          success: false,
          cancelled: false,
          error: `Order ${orderId} not found.`,
        };
      }

      // Concurrency check: If already paid or fulfilled, abort without touching inventory
      if (
        order.paymentStatus === "PAID" ||
        ["PAID", "PROCESSING", "SHIPPED", "DELIVERED"].includes(order.status)
      ) {
        return {
          success: true,
          cancelled: false,
          reason: `Order ${order.orderNumber} is already paid or fulfilled (Status: ${order.status}, Payment: ${order.paymentStatus}). No inventory was modified.`,
        };
      }

      // Idempotency: If already cancelled, safe no-op
      if (order.status === "CANCELLED") {
        return {
          success: true,
          cancelled: false,
          reason: `Order ${order.orderNumber} was already cancelled. Safe no-op.`,
        };
      }

      // Order must be genuinely PENDING to expire
      if (order.status !== "PENDING") {
        return {
          success: true,
          cancelled: false,
          reason: `Order ${order.orderNumber} is in status ${order.status}; not eligible for expiry.`,
        };
      }

      // Aggregate line items by variantId
      const itemsByVariant = new Map<string, ItemToReconcile>();
      for (const item of order.items) {
        if (!item.variantId) {
          continue;
        }
        const existing = itemsByVariant.get(item.variantId);
        if (existing) {
          existing.quantity += item.quantity;
        } else {
          itemsByVariant.set(item.variantId, {
            variantId: item.variantId,
            quantity: item.quantity,
            sku: item.sku,
            productName: item.productName,
          });
        }
      }

      // Deadlock prevention: sort variant IDs alphabetically before locking
      const sortedVariantIds = Array.from(itemsByVariant.keys()).sort();

      // 3. Atomically release reserved inventory
      for (const variantId of sortedVariantIds) {
        const item = itemsByVariant.get(variantId)!;

        // Acquire exclusive row lock on Inventory row
        await tx.$queryRaw`SELECT id FROM "Inventory" WHERE "variantId" = ${variantId} FOR UPDATE`;

        const inv = await tx.inventory.findUnique({
          where: { variantId },
          select: { id: true, reserved: true, quantity: true },
        });

        if (!inv) {
          throw new Error(
            `Inventory record missing for SKU ${item.sku}. Expiry reconciliation aborted.`
          );
        }

        // Strict invariant check: never clamp silently
        if (inv.reserved < item.quantity) {
          throw new Error(
            `Inconsistent reserved stock for SKU ${item.sku}. Required reservation: ${item.quantity}, Current reserved: ${inv.reserved}. Transaction aborted.`
          );
        }

        // Decrement reserved count only (physical warehouse quantity remains untouched)
        await tx.inventory.update({
          where: { variantId },
          data: {
            reserved: { decrement: item.quantity },
          },
        });
      }

      // 4. Update Order status to CANCELLED (Order.paymentStatus remains PENDING)
      await tx.order.update({
        where: { id: order.id },
        data: {
          status: "CANCELLED",
        },
      });

      // 5. Update Payment attempt to FAILED if currently PENDING
      if (order.payment && order.payment.status === "PENDING") {
        await tx.payment.update({
          where: { id: order.payment.id },
          data: {
            status: "FAILED",
          },
        });
      }

      return {
        success: true,
        cancelled: true,
        reason: `Order ${order.orderNumber} successfully cancelled and stock reservations released (${reason}).`,
      };
    });

    if (result.cancelled) {
      revalidatePath("/admin/orders");
      revalidatePath(`/admin/orders/${orderId}`);
      revalidatePath("/admin/inventory");
      revalidatePath("/account/orders");
      revalidatePath(`/account/orders/${orderId}`);
      revalidatePath("/checkout");
    }

    return result;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error during order expiry";
    console.error(`[Order Expiry Error for ${orderId}]:`, message);
    return {
      success: false,
      cancelled: false,
      error: message,
    };
  }
}

/**
 * Reusable routine to find genuinely stale PENDING orders and expire them.
 * Does not require external cron infrastructure.
 */
export async function cleanupStalePendingOrders(olderThanMinutes: number = 60) {
  const cutoffDate = new Date(Date.now() - olderThanMinutes * 60 * 1000);

  const staleOrders = await prisma.order.findMany({
    where: {
      status: "PENDING",
      createdAt: {
        lte: cutoffDate,
      },
    },
    select: {
      id: true,
      orderNumber: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  const results = {
    processed: staleOrders.length,
    succeeded: 0,
    failed: 0,
    errors: [] as string[],
  };

  for (const order of staleOrders) {
    const outcome = await expireOrderAndReleaseInventory(
      order.id,
      `Stale order sweep (> ${olderThanMinutes}m old)`
    );

    if (outcome.success) {
      results.succeeded++;
    } else {
      results.failed++;
      if (outcome.error) {
        results.errors.push(`${order.orderNumber}: ${outcome.error}`);
      }
    }
  }

  return results;
}
