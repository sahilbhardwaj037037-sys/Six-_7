import { requireAdmin } from "@/lib/admin-auth";
import { signOut } from "@/auth";
import Link from "next/link";

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireAdmin();

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-black text-white flex flex-col">
        <div className="p-6 border-b border-gray-800">
          <h1 className="text-xl font-bold tracking-tight">Six&7 Workspace</h1>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          <Link href="/admin" className="block px-3 py-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-sm text-sm font-medium transition-colors">
            Dashboard
          </Link>
          <Link href="/admin/brands" className="block px-3 py-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-sm text-sm font-medium transition-colors">
            Brands
          </Link>
          <Link href="/admin/categories" className="block px-3 py-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-sm text-sm font-medium transition-colors">
            Categories
          </Link>
          <Link href="/admin/products" className="block px-3 py-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-sm text-sm font-medium transition-colors">
            Products
          </Link>
          <div className="block px-3 py-2 text-gray-600 rounded-sm text-sm font-medium cursor-not-allowed">
            Inventory (Soon)
          </div>
          <div className="block px-3 py-2 text-gray-600 rounded-sm text-sm font-medium cursor-not-allowed">
            Orders (Soon)
          </div>
        </nav>
        <div className="p-4 border-t border-gray-800">
          <form
            action={async () => {
              "use server";
              await signOut();
            }}
          >
            <button
              type="submit"
              className="w-full text-left px-3 py-2 text-gray-400 hover:text-white rounded-sm text-sm font-medium transition-colors"
            >
              Log out
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between">
          <h2 className="text-lg font-medium text-gray-800">Overview</h2>
          <div className="flex items-center space-x-3">
            <span className="text-sm font-medium text-gray-600">{user.email}</span>
            <div className="h-8 w-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 font-bold text-sm">
              {user.email?.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-8 flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}
