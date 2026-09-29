"use server";

import { prisma } from "@/lib/prisma";

export interface PublicOrderItemDTO {
  id: string;
  productName: string;
  sku: string;
  size: string;
  color: string;
  quantity: number;
  price: string;
}

export interface PublicTimelineEventDTO {
  title: string;
  time: string;
  completed: boolean;
  active: boolean;
  description?: string;
}

export interface PublicShipmentDTO {
  carrier: string | null;
  trackingNumber: string | null;
  trackingUrl: string | null;
  shippedAt: string | null;
  deliveredAt: string | null;
}

export interface PublicTrackOrderDTO {
  orderNumber: string;
  status: string;
  placedDate: string;
  destination: {
    recipient: string;
    city: string;
    country: string;
  };
  shipment: PublicShipmentDTO | null;
  items: PublicOrderItemDTO[];
  timeline: PublicTimelineEventDTO[];
}

export interface TrackOrderActionResult {
  success: boolean;
  error?: string;
  data?: PublicTrackOrderDTO;
}

const GENERIC_NOT_FOUND_MESSAGE =
  "We could not locate an active consignment matching the supplied reference number and email combination.";

export async function trackOrderAction(
  orderNumber: string,
  email: string
): Promise<TrackOrderActionResult> {
  const cleanOrderNumber = orderNumber?.trim().toUpperCase();
  const cleanEmail = email?.trim().toLowerCase();

  // Basic presence & format validation
  if (
    !cleanOrderNumber ||
    !cleanEmail ||
    !cleanEmail.includes("@") ||
    !cleanEmail.includes(".")
  ) {
    return {
      success: false,
      error: GENERIC_NOT_FOUND_MESSAGE,
    };
  }

  try {
    // Two-field database verification using strict, minimal select
    const order = await prisma.order.findUnique({
      where: {
        orderNumber: cleanOrderNumber,
      },
      select: {
        id: true,
        orderNumber: true,
        status: true,
        createdAt: true,
        shippingName: true,
        shippingCity: true,
        shippingCountry: true,
        user: {
          select: {
            email: true,
          },
        },
        items: {
          select: {
            id: true,
            productName: true,
            sku: true,
            size: true,
            color: true,
            quantity: true,
            price: true,
          },
        },
        shipment: {
          select: {
            carrier: true,
            trackingNumber: true,
            trackingUrl: true,
            shippedAt: true,
            deliveredAt: true,
          },
        },
      },
    });

    // Verification check: Order must exist AND associated user email must match
    if (
      !order ||
      !order.user?.email ||
      order.user.email.trim().toLowerCase() !== cleanEmail
    ) {
      return {
        success: false,
        error: GENERIC_NOT_FOUND_MESSAGE,
      };
    }

    const placedDate = new Date(order.createdAt).toLocaleDateString("en-IN", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    });

    const formatDateTime = (date: Date) =>
      new Intl.DateTimeFormat("en-IN", {
        month: "short",
        day: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(new Date(date));

    // Dynamic timeline generated strictly from database facts (reverse-chronological)
    const timeline: PublicTimelineEventDTO[] = [];

    if (order.status === "CANCELLED") {
      timeline.push({
        title: "Order Cancelled",
        time: "Completed",
        completed: true,
        active: true,
        description: "This order has been cancelled and reservations released.",
      });
      timeline.push({
        title: "Order Placed & Confirmed",
        time: formatDateTime(order.createdAt),
        completed: true,
        active: false,
        description: "Order received in the digital atelier.",
      });
    } else {
      const isDelivered = order.status === "DELIVERED";
      const isShippedOrBeyond = ["SHIPPED", "DELIVERED"].includes(order.status);
      const isProcessingOrBeyond = ["PROCESSING", "SHIPPED", "DELIVERED"].includes(order.status);

      // Milestone 4: Delivered
      timeline.push({
        title: "Delivered",
        time: order.shipment?.deliveredAt
          ? formatDateTime(order.shipment.deliveredAt)
          : isDelivered
          ? "Delivered"
          : "Pending Delivery",
        completed: isDelivered,
        active: isDelivered,
        description: isDelivered
          ? "Consignment successfully delivered to destination."
          : "Awaiting final delivery.",
      });

      // Milestone 3: Dispatched with Courier
      timeline.push({
        title: "Dispatched with Courier",
        time: order.shipment?.shippedAt
          ? formatDateTime(order.shipment.shippedAt)
          : isShippedOrBeyond
          ? "Dispatched"
          : "Pending Dispatch",
        completed: isShippedOrBeyond,
        active: order.status === "SHIPPED",
        description: order.shipment?.carrier
          ? `Consignment handed over to ${order.shipment.carrier}.`
          : "Handed over to carrier for transit.",
      });

      // Milestone 2: Processing
      timeline.push({
        title: "Atelier Packaging & Inspection",
        time: isProcessingOrBeyond ? "Completed" : "In Progress",
        completed: isProcessingOrBeyond,
        active: order.status === "PROCESSING",
        description: "Garments and footwear prepared for courier collection.",
      });

      // Milestone 1: Placed
      timeline.push({
        title: "Order Placed & Confirmed",
        time: formatDateTime(order.createdAt),
        completed: true,
        active: order.status === "PENDING" || order.status === "PAID",
        description: "Order authenticated and confirmed.",
      });
    }

    const sanitizedItems: PublicOrderItemDTO[] = order.items.map((item) => ({
      id: item.id,
      productName: item.productName,
      sku: item.sku,
      size: item.size,
      color: item.color,
      quantity: item.quantity,
      price: `₹${Number(item.price).toLocaleString("en-IN")}`,
    }));

    const sanitizedShipment: PublicShipmentDTO | null = order.shipment
      ? {
          carrier: order.shipment.carrier || null,
          trackingNumber: order.shipment.trackingNumber || null,
          trackingUrl: order.shipment.trackingUrl || null,
          shippedAt: order.shipment.shippedAt
            ? formatDateTime(order.shipment.shippedAt)
            : null,
          deliveredAt: order.shipment.deliveredAt
            ? formatDateTime(order.shipment.deliveredAt)
            : null,
        }
      : null;

    return {
      success: true,
      data: {
        orderNumber: order.orderNumber,
        status: order.status,
        placedDate,
        destination: {
          recipient: order.shippingName,
          city: order.shippingCity,
          country: order.shippingCountry,
        },
        shipment: sanitizedShipment,
        items: sanitizedItems,
        timeline,
      },
    };
  } catch (error) {
    console.error("Public track order error:", error);
    return {
      success: false,
      error: GENERIC_NOT_FOUND_MESSAGE,
    };
  }
}
