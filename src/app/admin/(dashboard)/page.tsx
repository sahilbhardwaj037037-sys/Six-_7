import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

export default async function AdminDashboardPage() {
  await requireAdmin();

  // Fetch real counts directly from the database using Promise.all for parallel execution
  const [productCount, categoryCount, brandCount, customerCount] = await Promise.all([
    prisma.product.count(),
    prisma.category.count(),
    prisma.brand.count(),
    prisma.user.count({
      where: { role: "CUSTOMER" }
    }),
  ]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight text-gray-900">Dashboard Overview</h1>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {/* Products Card */}
        <div className="bg-white overflow-hidden shadow-sm border border-gray-200 rounded-sm">
          <div className="p-5">
            <h3 className="text-sm font-medium text-gray-500 truncate">Total Products</h3>
            <p className="mt-1 text-3xl font-semibold text-gray-900">{productCount}</p>
          </div>
        </div>

        {/* Categories Card */}
        <div className="bg-white overflow-hidden shadow-sm border border-gray-200 rounded-sm">
          <div className="p-5">
            <h3 className="text-sm font-medium text-gray-500 truncate">Total Categories</h3>
            <p className="mt-1 text-3xl font-semibold text-gray-900">{categoryCount}</p>
          </div>
        </div>

        {/* Brands Card */}
        <div className="bg-white overflow-hidden shadow-sm border border-gray-200 rounded-sm">
          <div className="p-5">
            <h3 className="text-sm font-medium text-gray-500 truncate">Total Brands</h3>
            <p className="mt-1 text-3xl font-semibold text-gray-900">{brandCount}</p>
          </div>
        </div>

        {/* Customers Card */}
        <div className="bg-white overflow-hidden shadow-sm border border-gray-200 rounded-sm">
          <div className="p-5">
            <h3 className="text-sm font-medium text-gray-500 truncate">Total Customers</h3>
            <p className="mt-1 text-3xl font-semibold text-gray-900">{customerCount}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
