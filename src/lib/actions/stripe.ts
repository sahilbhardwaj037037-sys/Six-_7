"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { getStripeServer } from "@/lib/stripe";
import type Stripe from "stripe";

function toPaise(decimalVal: unknown): number {
  const str = String(decimalVal);
  const [whole, fraction = ""] = str.split(".");
  const paddedFraction = (fraction + "00").slice(0, 2);
  const wholePart = parseInt(whole || "0", 10);
  const fractionPart = parseInt(paddedFraction, 10);
  return wholePart * 100 + fractionPart;
}

export async function createStripeCheckoutSession(orderId: string) {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return { error: "Unauthorized. Please log in to proceed." };
    }

    if (!orderId) {
      return { error: "Order ID is required." };
    }

    // 1. Authoritative order lookup & customer verification
    const order = await prisma.order.findFirst({
      where: { id: orderId, userId },
      include: {
        items: true,
        payment: true,
      },
    });

    if (!order) {
      return { error: "Order not found or unauthorized." };
    }

    if (order.status !== "PENDING" || order.paymentStatus !== "PENDING") {
      return { error: "This order is no longer eligible for checkout." };
    }

    if (order.items.length === 0) {
      return { error: "Cannot create checkout session for an order with no items." };
    }

    const stripe = getStripeServer();

    // 2. Idempotency: Reuse existing open Stripe Checkout Session if available
    if (order.payment?.providerSessionId) {
      try {
        const existingSession = await stripe.checkout.sessions.retrieve(
          order.payment.providerSessionId
        );
        if (existingSession.status === "open" && existingSession.url) {
          return {
            success: true,
            sessionUrl: existingSession.url,
            sessionId: existingSession.id,
          };
        }
      } catch (retrieveError) {
        console.warn("[Stripe Session Reuse Check]", retrieveError);
      }
    }

    // 3. Construct authoritative line items in smallest currency unit (paise for INR)
    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = order.items.map((item) => ({
      price_data: {
        currency: order.currency.toLowerCase(),
        unit_amount: toPaise(item.price),
        product_data: {
          name: item.productName,
          description: `Size: ${item.size}${item.color ? ` · Color: ${item.color}` : ""} (SKU: ${item.sku})`,
        },
      },
      quantity: item.quantity,
    }));

    const shippingPaise = toPaise(order.shippingFee);
    if (shippingPaise > 0) {
      lineItems.push({
        price_data: {
          currency: order.currency.toLowerCase(),
          unit_amount: shippingPaise,
          product_data: {
            name: "Shipping Fee",
          },
        },
        quantity: 1,
      });
    }

    const baseUrl =
      process.env.NEXT_PUBLIC_APP_URL ||
      process.env.NEXTAUTH_URL ||
      "http://localhost:3000";

    // 4. Create Stripe Checkout Session in Test Mode
    const expiresAt = Math.floor(Date.now() / 1000) + 31 * 60;

    const checkoutSession = await stripe.checkout.sessions.create({
      expires_at: expiresAt,
      mode: "payment",
      line_items: lineItems,
      customer_email: session.user?.email ?? undefined,
      client_reference_id: order.id,
      metadata: {
        orderId: order.id,
        orderNumber: order.orderNumber,
        userId: order.userId,
      },
      success_url: `${baseUrl}/checkout?session_id={CHECKOUT_SESSION_ID}&order_id=${order.id}&status=submitted`,
      cancel_url: `${baseUrl}/checkout?cancelled=true&order_id=${order.id}`,
    });

    if (!checkoutSession.url) {
      return { error: "Failed to generate Stripe checkout URL." };
    }

    // 5. Upsert Payment record keeping status PENDING
    await prisma.payment.upsert({
      where: { orderId: order.id },
      create: {
        orderId: order.id,
        provider: "STRIPE",
        providerSessionId: checkoutSession.id,
        amount: order.total,
        currency: order.currency,
        status: "PENDING",
      },
      update: {
        provider: "STRIPE",
        providerSessionId: checkoutSession.id,
        amount: order.total,
        currency: order.currency,
        status: "PENDING",
      },
    });

    return {
      success: true,
      sessionUrl: checkoutSession.url,
      sessionId: checkoutSession.id,
    };
  } catch (error) {
    if (error instanceof Error && error.message.includes("STRIPE_SECRET_KEY")) {
      return {
        error: "Stripe configuration missing. Please ensure STRIPE_SECRET_KEY is set in your .env file.",
      };
    }
    console.error("[Create Stripe Session Error]:", error);
    return { error: "Unable to initialize Stripe checkout. Please try again." };
  }
}
