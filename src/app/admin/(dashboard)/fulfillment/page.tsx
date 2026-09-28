import { requireAdmin } from "@/lib/admin-auth";
import Link from "next/link";
import { getFulfillmentOrders } from "@/lib/services/admin-fulfillment";

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

export default async function AdminFulfillmentPage() {
  await requireAdmin();
  const { awaitingFulfillment, shipped, delivered } = await getFulfillmentOrders();

  const renderOrderTable = (orders: any[], emptyMessage: string) => {
    if (orders.length === 0) {
      return (
        <div className="p-8 text-center text-sm text-neutral-500 dark:text-neutral-400 bg-neutral-50/50 dark:bg-neutral-900/30 rounded-xl border border-dashed border-neutral-200 dark:border-neutral-800">
          {emptyMessage}
        </div>
      );
    }

    return (
      <div className="overflow-x-auto rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
        <table className="w-full text-left text-xs sm:text-sm">
          <thead className="border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950/50 text-neutral-500 dark:text-neutral-400">
            <tr>
              <th className="py-3 px-4 font-medium">Order Number</th>
              <th className="py-3 px-4 font-medium">Customer</th>
              <th className="py-3 px-4 font-medium">Status</th>
              <th className="py-3 px-4 font-medium">Items / Total</th>
              <th className="py-3 px-4 font-medium">Fulfillment Info</th>
              <th className="py-3 px-4 font-medium text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
            {orders.map((order) => {
              const itemCount = order.items.reduce((sum: number, item: any) => sum + item.quantity, 0);
              const formattedDate = new Date(order.createdAt).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
              });

              return (
                <tr key={order.id} className="hover:bg-neutral-50/60 dark:hover:bg-neutral-800/40 transition-colors">
                  <td className="py-3 px-4">
                    <span className="font-mono font-semibold text-neutral-900 dark:text-white">
                      #{order.orderNumber}
                    </span>
                    <p className="text-[11px] text-neutral-500 dark:text-neutral-400">{formattedDate}</p>
                  </td>
                  <td className="py-3 px-4">
                    <p className="font-medium text-neutral-900 dark:text-white">{order.shippingName}</p>
                    <p className="text-[11px] text-neutral-500 dark:text-neutral-400">{order.user?.email || order.shippingPhone}</p>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex flex-col gap-1">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full border text-[11px] font-semibold w-fit ${getStatusBadge(order.status)}`}>
                        {order.status}
                      </span>
                      <span className="text-[10px] text-neutral-500 dark:text-neutral-400 font-mono">
                        Payment: {order.paymentStatus}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <p className="font-semibold text-neutral-900 dark:text-white">₹{Number(order.total).toLocaleString("en-IN")}</p>
                    <p className="text-[11px] text-neutral-500 dark:text-neutral-400">{itemCount} {itemCount === 1 ? "item" : "items"}</p>
                  </td>
                  <td className="py-3 px-4">
                    {order.shipment ? (
                      <div className="space-y-0.5">
                        <p className="font-medium text-neutral-900 dark:text-white">{order.shipment.carrier || "Carrier not set"}</p>
                        <p className="font-mono text-[11px] text-neutral-500 dark:text-neutral-400">
                          {order.shipment.trackingNumber || "No tracking #"}
                        </p>
                        {order.shipment.trackingUrl && (
                          <a
                            href={order.shipment.trackingUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline gap-0.5"
                          >
                            Track Shipment ↗
                          </a>
                        )}
                      </div>
                    ) : (
                      <span className="text-xs text-neutral-400 dark:text-neutral-500 italic">No shipment recorded</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="inline-flex items-center text-xs font-semibold text-black dark:text-white hover:underline"
                    >
                      Manage Order →
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">
          Fulfillment Management
        </h1>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
          Review shipping queues, record carrier tracking details, and monitor order fulfillment.
        </p>
      </div>

      {/* 1. Awaiting Fulfillment Queue */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">
              Awaiting Fulfillment
            </h2>
            <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
              {awaitingFulfillment.length}
            </span>
          </div>
          <span className="text-xs text-neutral-500 dark:text-neutral-400">
            Orders with status PAID or PROCESSING
          </span>
        </div>
        {renderOrderTable(awaitingFulfillment, "No orders currently awaiting fulfillment.")}
      </div>

      {/* 2. Shipped Queue */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">
              Shipped Orders
            </h2>
            <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300">
              {shipped.length}
            </span>
          </div>
          <span className="text-xs text-neutral-500 dark:text-neutral-400">
            Orders in transit with active tracking
          </span>
        </div>
        {renderOrderTable(shipped, "No shipped orders currently in transit.")}
      </div>

      {/* 3. Delivered Queue */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">
              Delivered Orders
            </h2>
            <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
              {delivered.length}
            </span>
          </div>
          <span className="text-xs text-neutral-500 dark:text-neutral-400">
            Completed order deliveries
          </span>
        </div>
        {renderOrderTable(delivered, "No delivered orders recorded yet.")}
      </div>
    </div>
  );
}
