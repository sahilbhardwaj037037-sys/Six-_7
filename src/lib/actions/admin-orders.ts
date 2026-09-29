"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin-auth";

export type AllowedOrderStatus =
  | "PENDING"
  | "PAID"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED";

const ALLOWED_ADMIN_TRANSITIONS: Record<AllowedOrderStatus, AllowedOrderStatus[]> = {
  PENDING: ["CANCELLED"],
  PAID: ["PROCESSING", "CANCELLED"],
  PROCESSING: ["SHIPPED", "CANCELLED"],
  SHIPPED: ["DELIVERED"],
  DELIVERED: [],
  CANCELLED: [],
};

export interface UpdateOrderStatusResult {
  success: boolean;
  error?: string;
  newStatus?: AllowedOrderStatus;
}

interface ItemToReconcile {
  variantId: string;
  quantity: number;
  sku: string;
  productName: string;
}

export async function updateOrderStatusAction(
  orderId: string,
  targetStatus: AllowedOrderStatus
): Promise<UpdateOrderStatusResult> {
  // 1. Enforce Server-Side Admin Authorization
  try {
    const session = await requireAdmin();
    if (session && typeof session === "object" && "user" in session) {
      const role = (session as any).user?.role;
      if (role && role !== "ADMIN") {
        return { success: false, error: "Forbidden: Admin privileges required." };
      }
    }
  } catch (err: any) {
    if (err?.digest?.startsWith("NEXT_REDIRECT")) {
      throw err;
    }
    return { success: false, error: "Unauthorized: Admin privileges required." };
  }

  if (!orderId || !targetStatus) {
    return { success: false, error: "Invalid order ID or target status." };
  }

  try {
    const updatedStatus = await prisma.$transaction(async (tx) => {
      // 2. Lock Order row for update to serialize concurrent transitions
      await tx.$queryRaw`SELECT id FROM "Order" WHERE id = ${orderId} FOR UPDATE`;

      // 3. Verify Order Existence and fetch snapshot with items and shipment
      const order = await tx.order.findUnique({
        where: { id: orderId },
        select: {
          id: true,
          status: true,
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
          shipment: {
            select: {
              id: true,
              shippedAt: true,
              deliveredAt: true,
            },
          },
        },
      });

      if (!order) {
        throw new Error("Order not found.");
      }

      const currentStatus = order.status as AllowedOrderStatus;

      // 4. Enforce Allowed Lifecycle Transitions
      const allowedNext = ALLOWED_ADMIN_TRANSITIONS[currentStatus] || [];
      if (!allowedNext.includes(targetStatus)) {
        throw new Error(`Transition from ${currentStatus} to ${targetStatus} is not permitted.`);
      }

      // Aggregate line item quantities by variantId
      const itemsByVariant = new Map<string, ItemToReconcile>();
      for (const item of order.items) {
        if (!item.variantId) {
          // Line item has no variant reference (e.g. deleted variant). Skip inventory reconciliation.
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

      const sortedVariantIds = Array.from(itemsByVariant.keys()).sort();

      // 5. Execute Inventory Reconciliation
      if (targetStatus === "CANCELLED") {
        // PENDING / PAID / PROCESSING -> CANCELLED:
        // Decrement reserved stock, physical quantity remains unchanged
        for (const variantId of sortedVariantIds) {
          const item = itemsByVariant.get(variantId)!;

          // Lock inventory row
          await tx.$queryRaw`SELECT id FROM "Inventory" WHERE "variantId" = ${variantId} FOR UPDATE`;

          const inv = await tx.inventory.findUnique({
            where: { variantId },
            select: { id: true, reserved: true, quantity: true },
          });

          if (!inv) {
            throw new Error(
              `Inventory record not found for SKU ${item.sku}. Stock reconciliation cannot continue.`
            );
          }

          if (inv.reserved < item.quantity) {
            throw new Error(
              `Cannot reconcile order: reserved stock for SKU ${item.sku} is inconsistent. Required reservation: ${item.quantity}, Current reservation: ${inv.reserved}.`
            );
          }

          await tx.inventory.update({
            where: { variantId },
            data: {
              reserved: { decrement: item.quantity },
            },
          });
        }
      } else if (targetStatus === "SHIPPED") {
        // PROCESSING -> SHIPPED:
        // Decrement physical stock (quantity) and clear reservation (reserved)
        for (const variantId of sortedVariantIds) {
          const item = itemsByVariant.get(variantId)!;

          // Lock inventory row
          await tx.$queryRaw`SELECT id FROM "Inventory" WHERE "variantId" = ${variantId} FOR UPDATE`;

          const inv = await tx.inventory.findUnique({
            where: { variantId },
            select: { id: true, quantity: true, reserved: true },
          });

          if (!inv) {
            throw new Error(
              `Inventory record not found for SKU ${item.sku}. Stock reconciliation cannot continue.`
            );
          }

          if (inv.quantity < item.quantity) {
            throw new Error(
              `Cannot ship order: physical stock for ${item.productName} (${item.sku}) is insufficient. Required: ${item.quantity}, Available in warehouse: ${inv.quantity}.`
            );
          }

          if (inv.reserved < item.quantity) {
            throw new Error(
              `Cannot reconcile order: reserved stock for SKU ${item.sku} is inconsistent. Required reservation: ${item.quantity}, Current reservation: ${inv.reserved}.`
            );
          }

          await tx.inventory.update({
            where: { variantId },
            data: {
              quantity: { decrement: item.quantity },
              reserved: { decrement: item.quantity },
            },
          });
        }

        // Set Shipment.shippedAt if not already set
        if (order.shipment) {
          if (!order.shipment.shippedAt) {
            await tx.shipment.update({
              where: { orderId },
              data: { shippedAt: new Date() },
            });
          }
        } else {
          await tx.shipment.create({
            data: {
              orderId,
              shippedAt: new Date(),
            },
          });
        }
      } else if (targetStatus === "DELIVERED") {
        // SHIPPED -> DELIVERED: No inventory changes
        if (order.shipment && !order.shipment.deliveredAt) {
          await tx.shipment.update({
            where: { orderId },
            data: { deliveredAt: new Date() },
          });
        }
      }

      // 6. Update Order Status
      const updatedOrder = await tx.order.update({
        where: { id: orderId },
        data: { status: targetStatus },
        select: { status: true },
      });

      return updatedOrder.status as AllowedOrderStatus;
    });

    // 7. Revalidate Relevant Paths
    revalidatePath("/admin/orders");
    revalidatePath(`/admin/orders/${orderId}`);
    revalidatePath("/admin/inventory");
    revalidatePath("/admin/fulfillment");
    revalidatePath("/account");
    revalidatePath("/account/orders");
    revalidatePath(`/account/orders/${orderId}`);

    return {
      success: true,
      newStatus: updatedStatus,
    };
  } catch (error: any) {
    console.error("[Admin Order Status Update Error]:", error);
    return {
      success: false,
      error: error?.message || "Database update failed. Please try again.",
    };
  }
}
