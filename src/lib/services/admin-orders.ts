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
