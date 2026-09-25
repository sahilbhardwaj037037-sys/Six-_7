import { requireAdmin } from "@/lib/admin-auth";
import { getBrands } from "@/lib/services/admin-catalog";
import Link from "next/link";

export default async function AdminBrandsPage() {
  await requireAdmin();
  const brands = await getBrands();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight text-gray-900">Brands</h1>
        <Link
          href="/admin/brands/new"
          className="bg-black text-white px-4 py-2 rounded-sm text-sm font-medium hover:bg-gray-800 transition-colors"
        >
          Create Brand
        </Link>
      </div>

      <div className="bg-white border border-gray-200 rounded-sm shadow-sm overflow-hidden">
        {brands.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No brands found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 border-b border-gray-200 text-gray-500">
                <tr>
                  <th className="px-6 py-4 font-medium">Name</th>
                  <th className="px-6 py-4 font-medium">Slug</th>
                  <th className="px-6 py-4 font-medium">Description</th>
                  <th className="px-6 py-4 font-medium">Created Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {brands.map((brand) => (
                  <tr key={brand.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">{brand.name}</td>
                    <td className="px-6 py-4 text-gray-500">{brand.slug}</td>
                    <td className="px-6 py-4 text-gray-500 truncate max-w-xs">
                      {brand.description || "—"}
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {new Date(brand.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
