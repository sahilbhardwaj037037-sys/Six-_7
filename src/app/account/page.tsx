import { auth, signOut } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function AccountPage() {
  const session = await auth();

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
          <section className="border border-neutral-200 p-8">
            <h2 className="text-lg font-mono uppercase tracking-wider mb-6">Recent Orders</h2>
            <div className="text-sm text-neutral-500 flex flex-col items-center justify-center py-12 text-center bg-neutral-50">
              <p>You haven't placed any orders yet.</p>
              <Link href="/shop" className="mt-4 text-[#111111] underline underline-offset-4 font-medium">
                Start Shopping
              </Link>
            </div>
          </section>
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
            <button disabled className="text-xs uppercase tracking-widest underline underline-offset-4 text-neutral-400 cursor-not-allowed">
              Manage Addresses (Coming Soon)
            </button>
          </section>
        </div>
      </div>
    </div>
  );
}
