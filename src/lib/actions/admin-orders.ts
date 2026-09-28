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

  // 2. Verify Order Existence
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    select: { id: true, status: true, orderNumber: true },
  });

  if (!order) {
    return { success: false, error: "Order not found." };
  }

  const currentStatus = order.status as AllowedOrderStatus;

  // 3. Enforce Allowed Lifecycle Transitions
  const allowedNext = ALLOWED_ADMIN_TRANSITIONS[currentStatus] || [];
  if (!allowedNext.includes(targetStatus)) {
    return {
      success: false,
      error: `Transition from ${currentStatus} to ${targetStatus} is not permitted.`,
    };
  }

  // 4. Update Order Status Only (Never touch Payment or Inventory in this milestone)
  try {
    const updated = await prisma.order.update({
      where: { id: orderId },
      data: {
        status: targetStatus,
      },
      select: { status: true },
    });

    // 5. Revalidate Paths
    revalidatePath("/admin/orders");
    revalidatePath(`/admin/orders/${orderId}`);
    revalidatePath("/account");
    revalidatePath("/account/orders");
    revalidatePath(`/account/orders/${orderId}`);

    return {
      success: true,
      newStatus: updated.status as AllowedOrderStatus,
    };
  } catch (error) {
    console.error("[Admin Order Status Update Error]:", error);
    return { success: false, error: "Database update failed. Please try again." };
  }
}
