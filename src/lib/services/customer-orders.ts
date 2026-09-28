import { prisma } from "@/lib/prisma";

export async function getCustomerOrders(userId: string) {
  if (!userId) return [];

  return prisma.order.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      items: true,
      payment: true,
      shipment: true,
    },
  });
}

export async function getCustomerOrderById(
  orderIdentifier: string,
  userId: string
) {
  if (!orderIdentifier || !userId) return null;

  return prisma.order.findFirst({
    where: {
      userId,
      OR: [
        { id: orderIdentifier },
        { orderNumber: orderIdentifier },
      ],
    },
    include: {
      items: true,
      payment: true,
      shipment: true,
    },
  });
}

export type CustomerOrderRecord = NonNullable<Awaited<ReturnType<typeof getCustomerOrderById>>>;
export type CustomerOrderItemRecord = CustomerOrderRecord["items"][number];
