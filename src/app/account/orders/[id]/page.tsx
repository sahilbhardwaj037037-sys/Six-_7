import { auth } from "@/auth";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { getCustomerOrderById, type CustomerOrderItemRecord } from "@/lib/services/customer-orders";

export const dynamic = "force-dynamic";

interface OrderDetailPageProps {
  params: Promise<{ id: string }>;
}

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

export default async function CustomerOrderDetailPage({ params }: OrderDetailPageProps) {
  const { id } = await params;
  const session = await auth();

  if (!session?.user?.id) {
    redirect(`/login?callbackUrl=/account/orders/${id}`);
  }

  // Strict ownership check: scoped to session.user.id
  const order = await getCustomerOrderById(id, session.user.id);

  if (!order) {
    notFound();
  }

  const formattedDate = new Date(order.createdAt).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const formattedTime = new Date(order.createdAt).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Navigation Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-neutral-500 dark:text-neutral-400">
          <Link href="/account" className="hover:text-neutral-900 dark:hover:text-white transition-colors">
            Account
          </Link>
          <span>/</span>
          <Link href="/account/orders" className="hover:text-neutral-900 dark:hover:text-white transition-colors">
            Orders
          </Link>
          <span>/</span>
          <span className="font-mono text-neutral-900 dark:text-white font-medium">{order.orderNumber}</span>
        </nav>

        {/* Header Summary */}
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 sm:p-8 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-semibold tracking-wider uppercase text-neutral-400 dark:text-neutral-500">
                Order Receipt
              </span>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 dark:text-white font-mono mt-1">
                #{order.orderNumber}
              </h1>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                Placed on {formattedDate} at {formattedTime}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className={`text-xs px-3 py-1 rounded-full border font-semibold ${getStatusBadge(order.status)}`}>
                Order: {order.status}
              </span>
              <span className={`text-xs px-3 py-1 rounded-full border font-semibold ${getStatusBadge(order.paymentStatus)}`}>
                Payment: {order.paymentStatus}
              </span>
            </div>
          </div>
        </div>

                  {/* Delivery & Tracking Details (Rendered conditionally when shipment exists) */}
          {order.shipment && (
            <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 sm:p-8 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-100 dark:border-neutral-800 pb-4">
                <div>
                  <span className="text-xs font-semibold tracking-wider uppercase text-neutral-400 dark:text-neutral-500">
                    Fulfillment & Shipping
                  </span>
                  <h2 className="text-lg font-bold text-neutral-900 dark:text-white mt-0.5">
                    Delivery & Tracking
                  </h2>
                </div>
                {(order.status === "SHIPPED" || order.status === "DELIVERED") && (
                  <span className={`self-start sm:self-auto text-xs px-3 py-1 rounded-full border font-semibold ${getStatusBadge(order.status)}`}>
                    Shipment: {order.status}
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-1 text-sm">
                <div>
                  <span className="text-xs font-mono uppercase tracking-wider text-neutral-400 dark:text-neutral-500 block">
                    Shipping Carrier
                  </span>
                  <p className="font-medium text-neutral-900 dark:text-white mt-1">
                    {order.shipment.carrier || "Standard Carrier"}
                  </p>
                </div>

                <div>
                  <span className="text-xs font-mono uppercase tracking-wider text-neutral-400 dark:text-neutral-500 block">
                    Tracking Number
                  </span>
                  <p className="font-mono font-medium text-neutral-900 dark:text-white mt-1">
                    {order.shipment.trackingNumber || "Not available"}
                  </p>
                </div>

                {order.shipment.trackingUrl && (
                  <div className="sm:col-span-2 md:col-span-1">
                    <span className="text-xs font-mono uppercase tracking-wider text-neutral-400 dark:text-neutral-500 block">
                      Tracking Link
                    </span>
                    <a
                      href={order.shipment.trackingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 mt-1 text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 underline underline-offset-4 transition-colors"
                    >
                      Track Package ↗
                    </a>
                  </div>
                )}
              </div>

              {order.shipment.shippedAt && (
                <div className="text-xs text-neutral-400 dark:text-neutral-500 font-mono pt-2 border-t border-neutral-100 dark:border-neutral-800">
                  Dispatched on{" "}
                  {new Date(order.shipment.shippedAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </div>
              )}
            </div>
          )}

          {/* Itemized Order Line Items (Authoritative Historical Snapshot) */}
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-neutral-200 dark:border-neutral-800">
            <h2 className="text-base font-semibold text-neutral-900 dark:text-white">Ordered Items</h2>
          </div>
          <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
            {order.items.map((item: CustomerOrderItemRecord) => (
              <div key={item.id} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">{item.productName}</h3>
                  <div className="flex flex-wrap gap-x-3 text-xs text-neutral-500 dark:text-neutral-400 font-mono">
                    <span>SKU: {item.sku}</span>
                    <span>•</span>
                    <span>Size: {item.size}</span>
                    <span>•</span>
                    <span>Color: {item.color}</span>
                  </div>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    Price: ₹{Number(item.price).toLocaleString("en-IN")} × {item.quantity}
                  </p>
                </div>
                <div className="text-left sm:text-right shrink-0">
                  <span className="text-sm font-bold text-neutral-900 dark:text-white">
                    ₹{Number(item.lineTotal).toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Financial & Delivery Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Shipping Address Snapshot */}
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 space-y-3">
            <h2 className="text-base font-semibold text-neutral-900 dark:text-white">Delivery Address</h2>
            <div className="text-sm text-neutral-600 dark:text-neutral-300 space-y-1">
              <p className="font-medium text-neutral-900 dark:text-white">{order.shippingName}</p>
              <p>{order.shippingAddress1}</p>
              {order.shippingAddress2 && <p>{order.shippingAddress2}</p>}
              <p>
                {order.shippingCity}, {order.shippingState} - {order.shippingPostalCode}
              </p>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 pt-2 font-mono">
                Phone: {order.shippingPhone}
              </p>
            </div>
          </div>

          {/* Financial Breakdown Snapshot */}
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 space-y-3">
            <h2 className="text-base font-semibold text-neutral-900 dark:text-white">Payment Summary</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-neutral-600 dark:text-neutral-400">
                <span>Subtotal</span>
                <span>₹{Number(order.subtotal).toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between text-neutral-600 dark:text-neutral-400">
                <span>Shipping Fee</span>
                <span>{Number(order.shippingFee) === 0 ? "Free" : `₹${Number(order.shippingFee).toLocaleString("en-IN")}`}</span>
              </div>
              <div className="flex justify-between text-neutral-600 dark:text-neutral-400">
                <span>Estimated Tax</span>
                <span>₹{Number(order.tax).toLocaleString("en-IN")}</span>
              </div>
              {Number(order.discountTotal) > 0 && (
                <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                  <span>Discount</span>
                  <span>-₹{Number(order.discountTotal).toLocaleString("en-IN")}</span>
                </div>
              )}
              <div className="pt-3 border-t border-neutral-200 dark:border-neutral-800 flex justify-between font-bold text-base text-neutral-900 dark:text-white">
                <span>Total</span>
                <span>₹{Number(order.total).toLocaleString("en-IN")}</span>
              </div>

              {order.payment && (
                <div className="pt-2 text-xs text-neutral-400 dark:text-neutral-500 font-mono">
                  Provider: {order.payment.provider} | Status: {order.payment.status}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Back Link */}
        <div className="pt-4 flex justify-between items-center">
          <Link
            href="/account/orders"
            className="inline-flex items-center text-sm font-semibold text-neutral-600 dark:text-neutral-300 hover:text-black dark:hover:text-white"
          >
            ← Back to Order History
          </Link>
          <Link
            href="/shop"
            className="inline-flex items-center text-sm font-semibold text-black dark:text-white hover:underline"
          >
            Continue Shopping →
          </Link>
        </div>
      </div>
    </div>
  );
}
