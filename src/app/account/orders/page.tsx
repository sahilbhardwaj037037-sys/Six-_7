import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  getCustomerOrders,
  type CustomerOrderRecord,
  type CustomerOrderItemRecord,
} from "@/lib/services/customer-orders";

export const dynamic = "force-dynamic";

function getStatusBadge(status: string) {
  switch (status) {
    case "PAID":
      return "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800";
    case "PROCESSING":
      return "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-800";
    case "SHIPPED":
      return "bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/40 dark:text-sky-400 dark:border-sky-800";
    case "DELIVERED":
      return "bg-green-50 text-green-700 border-green-200 dark:bg-green-950/40 dark:text-green-400 dark:border-green-800";
    case "CANCELLED":
      return "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-800";
    case "PENDING":
    default:
      return "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800";
  }
}

export default async function CustomerOrderListPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login?callbackUrl=/account/orders");
  }

  const orders: CustomerOrderRecord[] = await getCustomerOrders(session.user.id);

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Navigation Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-neutral-500 dark:text-neutral-400">
          <Link href="/account" className="hover:text-neutral-900 dark:hover:text-white transition-colors">
            Account
          </Link>
          <span>/</span>
          <span className="text-neutral-900 dark:text-white font-medium">Orders</span>
        </nav>

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-neutral-200 dark:border-neutral-800 pb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">
              Order History
            </h1>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
              Review and track your past orders and receipts.
            </p>
          </div>
          <Link
            href="/account"
            className="inline-flex items-center text-sm font-medium text-neutral-600 dark:text-neutral-300 hover:text-black dark:hover:text-white"
          >
            ← Back to Account
          </Link>
        </div>

        {/* Empty State */}
        {orders.length === 0 ? (
          <div className="text-center py-16 px-4 rounded-2xl border border-dashed border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
            <div className="mx-auto w-12 h-12 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mb-4 text-neutral-400">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <h3 className="text-base font-semibold text-neutral-900 dark:text-white">No orders yet</h3>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1 max-w-sm mx-auto">
              You haven&apos;t placed any orders yet. Discover our latest collection to get started.
            </p>
            <div className="mt-6">
              <Link
                href="/shop"
                className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-medium text-white bg-black hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200 rounded-lg transition-colors shadow-sm"
              >
                Explore Catalog
              </Link>
            </div>
          </div>
        ) : (
          /* Order List */
          <div className="space-y-4">
            {orders.map((order: CustomerOrderRecord) => {
              const itemCount = order.items.reduce(
                (sum: number, item: CustomerOrderItemRecord) => sum + item.quantity,
                0
              );
              const formattedDate = new Date(order.createdAt).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
              });

              return (
                <div
                  key={order.id}
                  className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 sm:p-6 transition-shadow hover:shadow-sm"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-100 dark:border-neutral-800">
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-sm font-semibold text-neutral-900 dark:text-white">
                          #{order.orderNumber}
                        </span>
                        <span
                          className={`text-xs px-2.5 py-0.5 rounded-full border font-medium ${getStatusBadge(
                            order.status
                          )}`}
                        >
                          {order.status}
                        </span>
                        <span
                          className={`text-xs px-2.5 py-0.5 rounded-full border font-medium ${getStatusBadge(
                            order.paymentStatus
                          )}`}
                        >
                          Payment: {order.paymentStatus}
                        </span>
                      </div>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400">
                        Placed on {formattedDate}
                      </p>
                    </div>

                    <div className="flex sm:flex-col sm:items-end justify-between items-center gap-1">
                      <span className="text-base font-semibold text-neutral-900 dark:text-white">
                        ₹{Number(order.total).toLocaleString("en-IN")}
                      </span>
                      <span className="text-xs text-neutral-500 dark:text-neutral-400">
                        {itemCount} {itemCount === 1 ? "item" : "items"}
                      </span>
                    </div>
                  </div>

                  {/* Item Previews (Historical Snapshot) */}
                  <div className="py-4 space-y-2">
                    {order.items.map((item: CustomerOrderItemRecord) => (
                      <div key={item.id} className="flex justify-between items-center text-xs sm:text-sm text-neutral-600 dark:text-neutral-300">
                        <span className="truncate pr-4">
                          <span className="font-medium text-neutral-800 dark:text-neutral-200">{item.productName}</span>
                          <span className="text-neutral-400 dark:text-neutral-500 ml-2">
                            ({item.size} / {item.color}) × {item.quantity}
                          </span>
                        </span>
                        <span className="font-medium text-neutral-900 dark:text-white shrink-0">
                          ₹{Number(item.lineTotal).toLocaleString("en-IN")}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Card Action */}
                  <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800 flex justify-end">
                    <Link
                      href={`/account/orders/${order.id}`}
                      className="inline-flex items-center text-xs sm:text-sm font-semibold text-black dark:text-white hover:underline gap-1"
                    >
                      View Order Details
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
