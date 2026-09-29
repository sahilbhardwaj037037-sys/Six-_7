import { requireAdmin } from "@/lib/admin-auth";
import { getAdminCustomers } from "@/lib/services/admin-customers";
import { Prisma } from "@/generated/prisma/client";
import Link from "next/link";

export const dynamic = "force-dynamic";

function formatCurrency(amount: number, currency = "INR") {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(amount);
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(date));
}

export default async function AdminCustomersPage() {
  await requireAdmin();
  const customers = await getAdminCustomers();

  // KPI Calculations
  const totalCustomers = customers.length;
  const purchasingCustomers = customers.filter((c) => c.paidOrdersCount > 0);
  const activePurchasingCustomersCount = purchasingCustomers.length;

  const totalPurchasingSpendDecimal = purchasingCustomers.reduce((acc, c) => {
    return acc.add(new Prisma.Decimal(c.lifetimeSpend));
  }, new Prisma.Decimal("0.00"));

  const avgRevenueNumber =
    activePurchasingCustomersCount > 0
      ? totalPurchasingSpendDecimal.div(activePurchasingCustomersCount).toNumber()
      : 0;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
            Customers
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Directory of registered customers, purchase activity, and lifetime value.
          </p>
        </div>
      </div>

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div className="bg-white p-6 shadow-sm ring-1 ring-gray-900/5 sm:rounded-lg">
          <dt className="text-sm font-medium text-gray-500">
            Total Registered Customers
          </dt>
          <dd className="text-2xl font-semibold tracking-tight text-gray-900 mt-2">
            {totalCustomers}
          </dd>
        </div>

        <div className="bg-white p-6 shadow-sm ring-1 ring-gray-900/5 sm:rounded-lg">
          <dt className="text-sm font-medium text-gray-500">
            Active Purchasing Customers
          </dt>
          <dd className="text-2xl font-semibold tracking-tight text-gray-900 mt-2">
            {activePurchasingCustomersCount}
          </dd>
        </div>

        <div className="bg-white p-6 shadow-sm ring-1 ring-gray-900/5 sm:rounded-lg">
          <dt className="text-sm font-medium text-gray-500">
            Average Revenue Per Purchasing Customer
          </dt>
          <dd className="text-2xl font-semibold tracking-tight text-gray-900 mt-2">
            {formatCurrency(avgRevenueNumber)}
          </dd>
        </div>
      </div>

      {/* Customer Directory Table */}
      <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Member Since
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Orders
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Lifetime Value
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Order
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {customers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-sm text-gray-500">
                    No registered customers found.
                  </td>
                </tr>
              ) : (
                customers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="font-medium text-gray-900">{customer.name}</div>
                      <div className="text-xs text-gray-500">{customer.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className="inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset bg-gray-100 text-gray-600 ring-gray-500/10">
                        {customer.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(customer.joinedAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="font-medium text-gray-900">
                        {customer.totalOrdersCount} {customer.totalOrdersCount === 1 ? "order" : "orders"}
                      </div>
                      <div className="text-xs text-gray-500">
                        {customer.paidOrdersCount} completed{customer.cancelledOrdersCount > 0 ? `, ${customer.cancelledOrdersCount} cancelled` : ""}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-right text-gray-900">
                      {formatCurrency(Number(customer.lifetimeSpend))}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {customer.lastOrderDate ? formatDate(customer.lastOrderDate) : "—"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-right">
                      {customer.latestOrder ? (
                        <Link
                          href={`/admin/orders/${customer.latestOrder.id}`}
                          className="text-xs font-medium text-gray-900 hover:underline hover:text-black transition-colors"
                        >
                          View Order ({customer.latestOrder.orderNumber})
                        </Link>
                      ) : (
                        <span className="text-xs text-gray-400">No orders</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
