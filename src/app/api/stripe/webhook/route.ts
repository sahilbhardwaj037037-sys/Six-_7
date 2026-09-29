import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import type Stripe from "stripe";
import { getStripeServer } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { expireOrderAndReleaseInventory } from "@/lib/services/order-expiry";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const stripe = getStripeServer();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.error("[Stripe Webhook Error] STRIPE_WEBHOOK_SECRET is not configured.");
    return NextResponse.json(
      { error: "Webhook secret is not configured." },
      { status: 500 }
    );
  }

  const rawBody = await req.text();
  const headersList = await headers();
  const signature = headersList.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "Missing stripe-signature header." },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Unknown signature error";
    console.error(`[Stripe Webhook Signature Verification Failed]: ${errorMessage}`);
    return NextResponse.json(
      { error: `Webhook signature verification failed: ${errorMessage}` },
      { status: 400 }
    );
  }

  try {
    switch (event.type) {
      case "checkout.session.completed":
      case "checkout.session.async_payment_succeeded": {
        const session = event.data.object as Stripe.Checkout.Session;

        // Only reconcile if Stripe reports the session as paid
        if (session.payment_status === "paid") {
          await handleSuccessfulCheckoutSession(session);
        }
        break;
      }

      case "checkout.session.expired": {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleExpiredCheckoutSession(session);
        break;
      }

      default:
        // Acknowledge unhandled event types cleanly to prevent Stripe retry storms
        break;
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error("[Stripe Webhook Processing Error]:", error);
    return NextResponse.json(
      { error: "Webhook event processing failed." },
      { status: 500 }
    );
  }
}

async function handleSuccessfulCheckoutSession(session: Stripe.Checkout.Session) {
  const orderId = session.metadata?.orderId || session.client_reference_id;

  if (!orderId) {
    console.warn(`[Stripe Webhook] No order ID associated with session: ${session.id}`);
    return;
  }

  const providerPaymentId =
    typeof session.payment_intent === "string"
      ? session.payment_intent
      : session.payment_intent?.id || null;

  await prisma.$transaction(async (tx) => {
    // Acquire row lock to prevent race condition with expiry
    await tx.$queryRaw`SELECT id FROM "Order" WHERE id = ${orderId} FOR UPDATE`;

    const order = await tx.order.findUnique({
      where: { id: orderId },
      include: { payment: true },
    });

    if (!order) {
      console.warn(`[Stripe Webhook] Order record not found for ID: ${orderId}`);
      return;
    }

    // Concurrency guard: A cancelled order must never be resurrected to PAID
    if (order.status === "CANCELLED") {
      console.warn(
        `[Stripe Webhook] Late payment received for CANCELLED order: ${orderId}. Session: ${session.id}, PaymentIntent: ${providerPaymentId}`
      );
      return;
    }

    // Idempotency: If the order and payment are already marked PAID, return safely
    if (order.paymentStatus === "PAID" && order.status === "PAID") {
      if (providerPaymentId && order.payment && !order.payment.providerPaymentId) {
        await tx.payment.update({
          where: { id: order.payment.id },
          data: { providerPaymentId },
        });
      }
      return;
    }

    // 1. Authoritatively update Order to PAID
    await tx.order.update({
      where: { id: order.id },
      data: {
        status: "PAID",
        paymentStatus: "PAID",
      },
    });

    // 2. Authoritatively update or create 1-to-1 Payment record
    if (order.payment) {
      await tx.payment.update({
        where: { id: order.payment.id },
        data: {
          status: "PAID",
          ...(providerPaymentId ? { providerPaymentId } : {}),
        },
      });
    } else {
      await tx.payment.create({
        data: {
          orderId: order.id,
          provider: "STRIPE",
          providerSessionId: session.id,
          providerPaymentId,
          amount: order.total,
          currency: order.currency,
          status: "PAID",
        },
      });
    }

    // Note: Inventory.reserved is retained; physical stock deduction occurs at fulfillment.
  });

  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${orderId}`);
  revalidatePath("/checkout");
}

async function handleExpiredCheckoutSession(session: Stripe.Checkout.Session) {
  let orderId = session.metadata?.orderId || session.client_reference_id;

  // Fallback: Resolve via Payment record if metadata was lost
  if (!orderId && session.id) {
    const payment = await prisma.payment.findUnique({
      where: { providerSessionId: session.id },
      select: { orderId: true },
    });
    orderId = payment?.orderId ?? null;
  }

  if (!orderId) {
    console.warn(`[Stripe Webhook] Could not resolve order for expired session: ${session.id}`);
    return;
  }

  const result = await expireOrderAndReleaseInventory(
    orderId,
    `Stripe checkout session expired: ${session.id}`
  );

  if (!result.success) {
    console.error(`[Stripe Webhook Expiry Error]: ${result.error}`);
  }
}
