"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin-auth";

export interface UpsertShipmentInput {
  orderId: string;
  carrier?: string;
  trackingNumber?: string;
  trackingUrl?: string;
}

export interface UpsertShipmentResult {
  success: boolean;
  error?: string;
  shipment?: {
    id: string;
    carrier: string | null;
    trackingNumber: string | null;
    trackingUrl: string | null;
    shippedAt: Date | null;
    deliveredAt: Date | null;
  };
}

export async function upsertShipmentAction(
  input: UpsertShipmentInput
): Promise<UpsertShipmentResult> {
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

  const { orderId, carrier, trackingNumber, trackingUrl } = input;

  if (!orderId) {
    return { success: false, error: "Order ID is required." };
  }

  // 2. Verify Order Existence
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    select: { id: true, status: true },
  });

  if (!order) {
    return { success: false, error: "Order not found." };
  }

  // 3. Validate Inputs
  const trimmedCarrier = carrier?.trim() || null;
  const trimmedTrackingNumber = trackingNumber?.trim() || null;
  let trimmedTrackingUrl = trackingUrl?.trim() || null;

  if (trimmedTrackingUrl) {
    if (!trimmedTrackingUrl.startsWith("http://") && !trimmedTrackingUrl.startsWith("https://")) {
      return {
        success: false,
        error: "Tracking URL must start with http:// or https://",
      };
    }
  }

  // 4. Upsert Shipment Record (Never automatically change Order status or inventory)
  try {
    const existingShipment = await prisma.shipment.findUnique({
      where: { orderId },
    });

    const isShipped = order.status === "SHIPPED" || order.status === "DELIVERED";
    const initialShippedAt = isShipped ? (existingShipment?.shippedAt || new Date()) : null;

    const shipment = await prisma.shipment.upsert({
      where: { orderId },
      create: {
        orderId,
        carrier: trimmedCarrier,
        trackingNumber: trimmedTrackingNumber,
        trackingUrl: trimmedTrackingUrl,
        shippedAt: initialShippedAt,
        deliveredAt: order.status === "DELIVERED" ? (existingShipment?.deliveredAt || new Date()) : null,
      },
      update: {
        carrier: trimmedCarrier,
        trackingNumber: trimmedTrackingNumber,
        trackingUrl: trimmedTrackingUrl,
        ...(isShipped && !existingShipment?.shippedAt ? { shippedAt: new Date() } : {}),
      },
    });

    // 5. Revalidate Paths
    revalidatePath("/admin/fulfillment");
    revalidatePath("/admin/orders");
    revalidatePath(`/admin/orders/${orderId}`);
    revalidatePath("/account/orders");
    revalidatePath(`/account/orders/${orderId}`);

    return {
      success: true,
      shipment: {
        id: shipment.id,
        carrier: shipment.carrier,
        trackingNumber: shipment.trackingNumber,
        trackingUrl: shipment.trackingUrl,
        shippedAt: shipment.shippedAt,
        deliveredAt: shipment.deliveredAt,
      },
    };
  } catch (error) {
    console.error("[Admin Upsert Shipment Error]:", error);
    return { success: false, error: "Failed to save shipment details." };
  }
}
