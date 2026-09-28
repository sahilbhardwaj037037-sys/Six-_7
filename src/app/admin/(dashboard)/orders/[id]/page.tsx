import { OrderFulfillmentSection } from "./OrderFulfillmentSection";
import { OrderStatusActions } from "./OrderStatusActions";
import { requireAdmin } from "@/lib/admin-auth";
import { getAdminOrderById } from "@/lib/services/admin-orders";
import { notFound } from "next/navigation";
import Link from "next/link";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string }>;
}

function formatCurrency(amount: number, currency = "INR") {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(amount);
}

function formatDateTime(date: Date) {
  return new Intl.DateTimeFormat("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
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

export default async function AdminOrderDetailPage({ params }: PageProps) {
  await requireAdmin();
  const { id } = await params;
  const order = await getAdminOrderById(id);

  if (!order) {
    notFound();
  }

  const customerName = order.user.name || order.shippingName || "Unknown Customer";
  const customerEmail = order.user.email || "No email on file";

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Navigation & Header */}
      <div className="space-y-3">
        {/* Admin Order Status Lifecycle Management */}
        <OrderStatusActions orderId={order.id} currentStatus={order.status} paymentStatus={order.paymentStatus} />
        {/* Admin Fulfillment & Shipment Details Section */}
        <OrderFulfillmentSection orderId={order.id} orderStatus={order.status} shipment={order.shipment} />


        <div>
          <Link
            href="/admin/orders"
            className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
          >
            ← Back to Orders
          </Link>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">
              {order.orderNumber}
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Placed on {formatDateTime(order.createdAt)}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center rounded-md px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${getPaymentBadgeClass(
                order.paymentStatus
              )}`}
            >
              Payment: {order.paymentStatus}
            </span>
            <span
              className={`inline-flex items-center rounded-md px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${getOrderBadgeClass(
                order.status
              )}`}
            >
              Order: {order.status}
            </span>
          </div>
        </div>
      </div>

      {/* Responsive Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Column (2/3) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items Table */}
          <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-base font-semibold text-gray-900">
                Order Items ({order.items.length})
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Product
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      SKU
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Variant
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Price
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Qty
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {order.items.length === 0 ? (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-6 py-8 text-center text-sm text-gray-500"
                      >
                        No items found in this order.
                      </td>
                    </tr>
                  ) : (
                    order.items.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {item.productName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-500">
                          {item.sku}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {item.size} / {item.color}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                          {formatCurrency(Number(item.price), order.currency)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">
                          {item.quantity}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-right text-gray-900">
                          {formatCurrency(Number(item.lineTotal), order.currency)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Financial Breakdown */}
          <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-base font-semibold text-gray-900">
                Financial Breakdown
              </h2>
            </div>
            <div className="px-6 py-4 space-y-3">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Subtotal</span>
                <span>{formatCurrency(Number(order.subtotal), order.currency)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Shipping Fee</span>
                <span>{formatCurrency(Number(order.shippingFee), order.currency)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Tax</span>
                <span>{formatCurrency(Number(order.tax), order.currency)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Discount</span>
                <span>-{formatCurrency(Number(order.discountTotal), order.currency)}</span>
              </div>
              <div className="pt-3 border-t border-gray-200 flex justify-between text-base font-semibold text-gray-900">
                <span>Total</span>
                <span>{formatCurrency(Number(order.total), order.currency)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Column (1/3) */}
        <div className="lg:col-span-1 space-y-6">
          {/* Customer Card */}
          <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-base font-semibold text-gray-900">Customer</h2>
            </div>
            <div className="px-6 py-4 space-y-2 text-sm">
              <div>
                <span className="text-gray-500 block text-xs">Name</span>
                <span className="font-medium text-gray-900">{customerName}</span>
              </div>
              <div>
                <span className="text-gray-500 block text-xs">Email</span>
                <span className="text-gray-700">{customerEmail}</span>
              </div>
              <div>
                <span className="text-gray-500 block text-xs">User ID</span>
                <span className="font-mono text-xs text-gray-500 break-all">
                  {order.user.id}
                </span>
              </div>
            </div>
          </div>

          {/* Shipping Address Card */}
          <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-base font-semibold text-gray-900">
                Shipping Address
              </h2>
            </div>
            <div className="px-6 py-4 space-y-2 text-sm text-gray-700">
              <div className="font-medium text-gray-900">{order.shippingName}</div>
              <div className="text-xs text-gray-500">{order.shippingPhone}</div>
              <div className="pt-1">
                <div>{order.shippingAddress1}</div>
                {order.shippingAddress2 && <div>{order.shippingAddress2}</div>}
                <div>
                  {order.shippingCity}, {order.shippingState} - {order.shippingPostalCode}
                </div>
                <div>{order.shippingCountry}</div>
              </div>
            </div>
          </div>

          {/* Payment Card */}
          <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-base font-semibold text-gray-900">Payment</h2>
            </div>
            <div className="px-6 py-4">
              {!order.payment ? (
                <p className="text-sm text-gray-500">
                  No payment transaction recorded.
                </p>
              ) : (
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">Status</span>
                    <span
                      className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${getPaymentBadgeClass(
                        order.payment.status
                      )}`}
                    >
                      {order.payment.status}
                    </span>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500 block">Provider</span>
                    <span className="font-medium text-gray-900">
                      {order.payment.provider}
                    </span>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500 block">Amount</span>
                    <span className="font-medium text-gray-900">
                      {formatCurrency(Number(order.payment.amount), order.payment.currency)}
                    </span>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500 block">Payment ID</span>
                    <span className="font-mono text-xs text-gray-600 break-all">
                      {order.payment.providerPaymentId || "None"}
                    </span>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500 block">Session ID</span>
                    <span className="font-mono text-xs text-gray-600 break-all">
                      {order.payment.providerSessionId || "None"}
                    </span>
                  </div>
                  <div className="pt-2 border-t border-gray-100 text-xs text-gray-400 space-y-1">
                    <div>Created: {formatDateTime(order.payment.createdAt)}</div>
                    <div>Updated: {formatDateTime(order.payment.updatedAt)}</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
