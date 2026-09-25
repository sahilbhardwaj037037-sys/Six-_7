import { requireAdmin } from "@/lib/admin-auth";
import { getCategories } from "@/lib/services/admin-catalog";
import Link from "next/link";

export default async function AdminCategoriesPage() {
  await requireAdmin();
  const categories = await getCategories();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight text-gray-900">Categories</h1>
        <Link
          href="/admin/categories/new"
          className="bg-black text-white px-4 py-2 rounded-sm text-sm font-medium hover:bg-gray-800 transition-colors"
        >
          Create Category
        </Link>
      </div>

      <div className="bg-white border border-gray-200 rounded-sm shadow-sm overflow-hidden">
        {categories.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No categories found.
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
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {categories.map((category) => (
                  <tr key={category.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">{category.name}</td>
                    <td className="px-6 py-4 text-gray-500">{category.slug}</td>
                    <td className="px-6 py-4 text-gray-500 truncate max-w-xs">
                      {category.description || "—"}
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {new Date(category.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        href={`/admin/categories/${category.id}/edit`}
                        className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
                      >
                        Edit
                      </Link>
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
