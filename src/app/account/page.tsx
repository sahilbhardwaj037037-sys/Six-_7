import { getCustomerOrders, type CustomerOrderRecord, type CustomerOrderItemRecord } from "@/lib/services/customer-orders";
import { auth, signOut } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";


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

export default async function AccountPage() {
  const session = await auth();
  const orders: CustomerOrderRecord[] = session?.user?.id ? await getCustomerOrders(session.user.id) : [];
  const recentOrders = orders.slice(0, 5);

  if (!session?.user?.id) {
    redirect("/login");
  }

  const dbUser = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (!dbUser) {
    redirect("/login");
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 min-h-[calc(100vh-10rem)]">
      <div className="mb-6">
        <Link href="/" className="text-xs font-mono uppercase tracking-widest text-neutral-500 hover:text-black transition-colors">
          ← HOME
        </Link>
      </div>
      
      <div className="mb-12 border-b border-neutral-200 pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-mono font-bold tracking-tighter uppercase text-[#111111]">
            My Account
          </h1>
          <p className="mt-2 text-neutral-600">
            Welcome back, {dbUser.name || "Customer"}.
          </p>
          <p className="text-sm text-neutral-500 mt-1">{dbUser.email}</p>
        </div>
        
        <form
          action={async () => {
            "use server";
            await signOut({ redirectTo: "/login" });
          }}
        >
          <button
            type="submit"
            className="text-xs font-mono tracking-widest uppercase border border-neutral-300 px-6 py-3 hover:border-black transition-colors"
          >
            Sign Out
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="col-span-1 md:col-span-2 space-y-8">
                  {/* Recent Orders Section */}
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">
                Recent Orders
              </h2>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                Your most recent purchases and their current status
              </p>
            </div>
            {orders.length > 0 && (
              <Link
                href="/account/orders"
                className="text-xs sm:text-sm font-medium text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors"
              >
                View all ({orders.length}) →
              </Link>
            )}
          </div>

          {orders.length === 0 ? (
            <div className="text-center py-10 px-4 rounded-xl border border-dashed border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50">
              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                You haven&apos;t placed any orders yet.
              </p>
              <div className="mt-4">
                <Link
                  href="/shop"
                  className="inline-flex items-center justify-center px-4 py-2 text-xs sm:text-sm font-medium text-white bg-black hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200 rounded-lg transition-colors"
                >
                  Start Shopping
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {recentOrders.map((order: CustomerOrderRecord) => {
                const formattedDate = new Date(order.createdAt).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                });
                const itemCount = order.items.reduce(
                  (sum: number, item: CustomerOrderItemRecord) => sum + item.quantity,
                  0
                );

                return (
                  <div
                    key={order.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-950/40 gap-3 transition-colors hover:border-neutral-300 dark:hover:border-neutral-700"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs sm:text-sm font-semibold text-neutral-900 dark:text-white">
                          #{order.orderNumber}
                        </span>
                        <span
                          className={"text-[10px] sm:text-xs px-2 py-0.5 rounded-full border font-medium " + getStatusBadge(order.status)}
                        >
                          {order.status}
                        </span>
                        <span
                          className={"text-[10px] sm:text-xs px-2 py-0.5 rounded-full border font-medium " + getStatusBadge(order.paymentStatus)}
                        >
                          Payment: {order.paymentStatus}
                        </span>
                      </div>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400">
                        Placed on {formattedDate} • {itemCount} {itemCount === 1 ? "item" : "items"}
                      </p>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-4">
                      <span className="text-sm font-bold text-neutral-900 dark:text-white">
                        ₹{Number(order.total).toLocaleString("en-IN")}
                      </span>
                      <Link
                        href={"/account/orders/" + order.id}
                        className="inline-flex items-center text-xs font-semibold text-black dark:text-white hover:underline gap-0.5"
                      >
                        View Details →
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
        </div>

        <div className="space-y-8">
          <section className="border border-neutral-200 p-8">
            <h2 className="text-lg font-mono uppercase tracking-wider mb-6">Account Details</h2>
            <div className="space-y-4 text-sm text-neutral-600">
              <div>
                <span className="block text-xs font-mono uppercase tracking-widest text-neutral-400 mb-1">Name</span>
                <span className="text-neutral-900">{dbUser.name || "N/A"}</span>
              </div>
              <div>
                <span className="block text-xs font-mono uppercase tracking-widest text-neutral-400 mb-1">Email</span>
                <span className="text-neutral-900">{dbUser.email}</span>
              </div>
              <div>
                <span className="block text-xs font-mono uppercase tracking-widest text-neutral-400 mb-1">Password</span>
                <span className="text-neutral-900">••••••••</span>
              </div>
            </div>
            <Link href="/account/profile" className="mt-6 inline-block text-xs uppercase tracking-widest underline underline-offset-4 text-neutral-900 hover:text-neutral-600 transition-colors">
              Edit Details
            </Link>
          </section>

          <section className="border border-neutral-200 p-8 bg-neutral-50">
            <h2 className="text-lg font-mono uppercase tracking-wider mb-4">Saved Addresses</h2>
            <p className="text-sm text-neutral-500 mb-4">Manage your shipping and billing addresses for a faster checkout.</p>
            <Link href="/account/addresses" className="inline-block text-xs uppercase tracking-widest underline underline-offset-4 text-neutral-900 hover:text-neutral-600 transition-colors">
              Manage Addresses
            </Link>
          </section>
        </div>
      </div>
    </div>
  );
}
