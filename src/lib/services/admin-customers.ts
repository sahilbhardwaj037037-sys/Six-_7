import { prisma } from "@/lib/prisma";
import { Prisma } from "@/generated/prisma/client";

export interface AdminCustomer {
  id: string;
  name: string;
  email: string;
  role: string;
  joinedAt: Date;
  totalOrdersCount: number;
  paidOrdersCount: number;
  cancelledOrdersCount: number;
  lifetimeSpend: string;
  lastOrderDate: Date | null;
  latestOrder: {
    id: string;
    orderNumber: string;
  } | null;
}

/**
 * Retrieves all registered CUSTOMER users and computes order aggregates.
 * Excludes ADMIN accounts, credentials, tokens, addresses, and payment identifiers.
 */
export async function getAdminCustomers(): Promise<AdminCustomer[]> {
  const users = await prisma.user.findMany({
    where: {
      role: "CUSTOMER",
    },
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      orders: {
        orderBy: {
          createdAt: "desc",
        },
        select: {
          id: true,
          orderNumber: true,
          status: true,
          paymentStatus: true,
          total: true,
          createdAt: true,
        },
      },
    },
  });

  return users.map((user) => {
    const totalOrdersCount = user.orders.length;

    const paidOrders = user.orders.filter((order) =>
      ["PAID", "PROCESSING", "SHIPPED", "DELIVERED"].includes(order.status)
    );
    const paidOrdersCount = paidOrders.length;

    const cancelledOrders = user.orders.filter(
      (order) => order.status === "CANCELLED"
    );
    const cancelledOrdersCount = cancelledOrders.length;

    // Prisma Decimal arithmetic to sum authoritative revenue without floating-point errors
    const lifetimeSpendDecimal = paidOrders.reduce((acc, order) => {
      return acc.add(new Prisma.Decimal(order.total));
    }, new Prisma.Decimal("0.00"));

    const latestOrderRecord = user.orders[0] ?? null;

    return {
      id: user.id,
      name: user.name || "Customer",
      email: user.email || "No email",
      role: user.role,
      joinedAt: user.createdAt,
      totalOrdersCount,
      paidOrdersCount,
      cancelledOrdersCount,
      lifetimeSpend: lifetimeSpendDecimal.toFixed(2),
      lastOrderDate: latestOrderRecord ? latestOrderRecord.createdAt : null,
      latestOrder: latestOrderRecord
        ? {
            id: latestOrderRecord.id,
            orderNumber: latestOrderRecord.orderNumber,
          }
        : null,
    };
  });
}
