import { prisma } from "@/lib/prisma";

export async function getFulfillmentOrders() {
  const orders = await prisma.order.findMany({
    where: {
      status: {
        in: ["PAID", "PROCESSING", "SHIPPED", "DELIVERED"],
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      user: {
        select: {
          name: true,
          email: true,
        },
      },
      items: true,
      payment: true,
      shipment: true,
    },
  });

  const awaitingFulfillment = orders.filter(
    (o) => o.status === "PAID" || o.status === "PROCESSING"
  );
  const shipped = orders.filter((o) => o.status === "SHIPPED");
  const delivered = orders.filter((o) => o.status === "DELIVERED");

  return {
    all: orders,
    awaitingFulfillment,
    shipped,
    delivered,
  };
}
