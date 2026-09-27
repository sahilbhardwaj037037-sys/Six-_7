import { prisma } from "@/lib/prisma";

export async function getAllAdminOrders() {
  return await prisma.order.findMany({
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      orderNumber: true,
      status: true,
      paymentStatus: true,
      currency: true,
      total: true,
      createdAt: true,
      shippingName: true,
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      _count: {
        select: {
          items: true,
        },
      },
    },
  });
}

export async function getAdminOrderById(id: string) {
  return await prisma.order.findUnique({
    where: { id },
    select: {
      id: true,
      orderNumber: true,
      status: true,
      paymentStatus: true,
      currency: true,
      subtotal: true,
      shippingFee: true,
      tax: true,
      discountTotal: true,
      total: true,
      shippingName: true,
      shippingPhone: true,
      shippingAddress1: true,
      shippingAddress2: true,
      shippingCity: true,
      shippingState: true,
      shippingPostalCode: true,
      shippingCountry: true,
      createdAt: true,
      updatedAt: true,
      user: {
        select: {
          id: true,
          name: true,
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
          price: true,
          quantity: true,
          lineTotal: true,
          variantId: true,
        },
      },
      payment: {
        select: {
          id: true,
          provider: true,
          providerPaymentId: true,
          providerSessionId: true,
          amount: true,
          currency: true,
          status: true,
          createdAt: true,
          updatedAt: true,
        },
      },
    },
  });
}
