import { requireAdmin } from "@/lib/admin-auth";
import { getAllAdminOrders } from "@/lib/services/admin-orders";

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

function getPaymentBadgeClass(status: string) {
  switch (status) {
    case "PAID":
      return "bg-green-50 text-green-700 ring-green-600/20";
    case "PENDING":
      return "bg-yellow-50 text-yellow-800 ring-yellow-600/20";
    case "FAILED":
      return "bg-red-50 text-red-700 ring-red-600/10";
    case "REFUNDED":
      return "bg-purple-50 text-purple-700 ring-purple-600/20";
    default:
      return "bg-gray-100 text-gray-600 ring-gray-500/10";
  }
}

function getOrderBadgeClass(status: string) {
  switch (status) {
    case "PENDING":
      return "bg-yellow-50 text-yellow-800 ring-yellow-600/20";
    case "PAID":
      return "bg-blue-50 text-blue-700 ring-blue-600/20";
    case "PROCESSING":
      return "bg-indigo-50 text-indigo-700 ring-indigo-600/20";
    case "SHIPPED":
      return "bg-cyan-50 text-cyan-700 ring-cyan-600/20";
    case "DELIVERED":
      return "bg-green-50 text-green-700 ring-green-600/20";
    case "CANCELLED":
      return "bg-gray-100 text-gray-600 ring-gray-500/10";
    default:
      return "bg-gray-100 text-gray-600 ring-gray-500/10";
  }
}

export default async function AdminOrdersPage() {
  await requireAdmin();
  const orders = await getAllAdminOrders();

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
            Orders
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Overview of customer orders and payment statuses.
          </p>
        </div>
      </div>

      <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order #</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Status</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-sm text-gray-500">
                    No orders found.
                  </td>
                </tr>
              ) : (
                orders.map((order) => {
                  const customerName = order.user.name || order.shippingName || "Unknown Customer";
                  const customerEmail = order.user.email || "No email on file";

                  return (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {order.orderNumber}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(order.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div className="font-medium text-gray-900">{customerName}</div>
                        <div className="text-xs text-gray-500">{customerEmail}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                        {order._count.items}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-right text-gray-900">
                        {formatCurrency(Number(order.total), order.currency)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${getPaymentBadgeClass(order.paymentStatus)}`}>
                          {order.paymentStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${getOrderBadgeClass(order.status)}`}>
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
