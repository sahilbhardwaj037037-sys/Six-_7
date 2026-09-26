import { requireAdmin } from "@/lib/admin-auth";
import { getBrands, getCategories } from "@/lib/services/admin-catalog";
import Link from "next/link";
import ProductCreateForm from "./create-form";

export default async function NewProductPage() {
  await requireAdmin();
  const [brands, categories] = await Promise.all([getBrands(), getCategories()]);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
          Create New Product
        </h1>
        <Link
          href="/admin/products"
          className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
        >
          Cancel
        </Link>
      </div>

      <div className="bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded-sm text-sm">
        <strong>Notice:</strong> New products are initially created as hidden drafts (archived) to prevent them from appearing incomplete on the storefront. You can configure media and variants in later steps.
      </div>

      <div className="bg-white border border-gray-200 rounded-sm shadow-sm overflow-hidden">
        <ProductCreateForm brands={brands} categories={categories} />
      </div>
    </div>
  );
}
