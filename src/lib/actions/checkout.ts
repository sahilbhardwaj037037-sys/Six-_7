"use server";

import { prisma } from "@/lib/prisma";
import { Prisma } from "@/generated/prisma/client";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { randomBytes } from "node:crypto";

function generateOrderNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const randomSuffix = randomBytes(3).toString("hex").toUpperCase();
  return `S67-${timestamp}-${randomSuffix}`;
}

export async function createPendingOrder(addressId: string) {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return { error: "Unauthorized. Please log in to complete checkout." };
    }

    if (!addressId) {
      return { error: "Please select a valid shipping address." };
    }

    const orderResult = await prisma.$transaction(
      async (tx) => {
        // 1. Verify shipping address ownership
        const address = await tx.address.findFirst({
          where: { id: addressId, userId },
        });

        if (!address) {
          throw new Error("INVALID_ADDRESS");
        }

        // 2. Fetch authoritative user cart
        const cart = await tx.cart.findUnique({
          where: { userId },
          include: {
            items: {
              include: {
                variant: {
                  include: {
                    product: true,
                  },
                },
              },
            },
          },
        });

        if (!cart || cart.items.length === 0) {
          throw new Error("EMPTY_CART");
        }

        // 3. Sort items by variantId to prevent PostgreSQL deadlocks across concurrent checkouts
        const sortedItems = [...cart.items].sort((a, b) =>
          a.variantId.localeCompare(b.variantId)
        );

        let subtotalDecimal = new Prisma.Decimal(0);
        const zeroDecimal = new Prisma.Decimal("0.00");
        const orderItemsData = [];

        // 4. PostgreSQL row-level lock & authoritative decimal price calculation
        for (const item of sortedItems) {
          const v = item.variant;
          const p = v?.product;

          if (!v || !p || v.isArchived || p.isArchived) {
            throw new Error(`UNAVAILABLE_ITEM:${p?.name || "Product"}`);
          }

          if (item.quantity <= 0) {
            throw new Error(`INVALID_QUANTITY:${p.name}`);
          }

          // Row-level lock on inventory record
          const lockedInventories = await tx.$queryRaw<
            Array<{ id: string; quantity: number; reserved: number }>
          >`
            SELECT id, quantity, reserved 
            FROM "Inventory" 
            WHERE "variantId" = ${v.id} 
            FOR UPDATE
          `;

          if (!lockedInventories || lockedInventories.length === 0) {
            throw new Error(`MISSING_INVENTORY:${v.sku}`);
          }

          const inv = lockedInventories[0];
          const availableStock = inv.quantity - inv.reserved;

          if (availableStock < item.quantity) {
            throw new Error(
              `INSUFFICIENT_STOCK:${p.name} (${v.size}): Only ${Math.max(
                0,
                availableStock
              )} available`
            );
          }

          // Atomically increment reserved stock
          await tx.inventory.update({
            where: { id: inv.id },
            data: {
              reserved: { increment: item.quantity },
            },
          });

          // Authoritative catalog price using Decimal arithmetic
          const rawPrice = v.price ?? p.basePrice;
          const unitPriceDecimal = new Prisma.Decimal(rawPrice);
          const lineTotalDecimal = unitPriceDecimal.mul(item.quantity);
          subtotalDecimal = subtotalDecimal.add(lineTotalDecimal);

          orderItemsData.push({
            variantId: v.id,
            productName: p.name,
            sku: v.sku,
            size: v.size,
            color: v.color,
            price: unitPriceDecimal.toFixed(2),
            quantity: item.quantity,
            lineTotal: lineTotalDecimal.toFixed(2),
          });
        }

        const subtotalStr = subtotalDecimal.toFixed(2);
        const shippingFeeStr = zeroDecimal.toFixed(2);
        const taxStr = zeroDecimal.toFixed(2);
        const discountTotalStr = zeroDecimal.toFixed(2);
        const totalStr = subtotalStr;
        const orderNumber = generateOrderNumber();

        // 5. Create Order with immutable snapshots
        const order = await tx.order.create({
          data: {
            orderNumber,
            userId,
            status: "PENDING",
            paymentStatus: "PENDING",
            currency: "INR",
            subtotal: subtotalStr,
            shippingFee: shippingFeeStr,
            tax: taxStr,
            discountTotal: discountTotalStr,
            total: totalStr,
            shippingName: address.fullName,
            shippingPhone: address.phone,
            shippingAddress1: address.addressLine1,
            shippingAddress2: address.addressLine2 || null,
            shippingCity: address.city,
            shippingState: address.state,
            shippingPostalCode: address.postalCode,
            shippingCountry: address.country,
            items: {
              create: orderItemsData,
            },
          },
          select: {
            id: true,
            orderNumber: true,
            total: true,
          },
        });

        // 6. Clear user cart items in the same transaction
        await tx.cartItem.deleteMany({
          where: { cartId: cart.id },
        });

        return order;
      },
      {
        maxWait: 5000,
        timeout: 10000,
      }
    );

    revalidatePath("/cart");
    revalidatePath("/checkout");
    revalidatePath("/admin/orders");

    return {
      success: true,
      orderId: orderResult.id,
      orderNumber: orderResult.orderNumber,
      total: Number(orderResult.total),
    };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return { error: "An order identifier collision occurred. Please try submitting again." };
    }

    if (error instanceof Error) {
      if (error.message === "INVALID_ADDRESS") {
        return { error: "The selected shipping address is invalid." };
      }
      if (error.message === "EMPTY_CART") {
        return { error: "Your bag is empty or has already been checked out." };
      }
      if (error.message.startsWith("UNAVAILABLE_ITEM:")) {
        const name = error.message.split(":")[1];
        return { error: `"${name}" is no longer available. Please update your bag.` };
      }
      if (error.message.startsWith("INSUFFICIENT_STOCK:")) {
        const details = error.message.replace("INSUFFICIENT_STOCK:", "");
        return { error: `Insufficient stock for ${details}.` };
      }
      if (error.message.startsWith("MISSING_INVENTORY:")) {
        const sku = error.message.split(":")[1];
        return { error: `Inventory not configured for SKU ${sku}.` };
      }
    }

    console.error("[Checkout Order Creation Error]:", error);
    return { error: "Unable to process order. Please try again." };
  }
}
