import { requireAdmin } from "@/lib/admin-auth";
import { getAdminProductById, getBrands, getCategories } from "@/lib/services/admin-catalog";
import { notFound } from "next/navigation";
import Link from "next/link";
import ProductEditForm from "./edit-form";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  
  const resolvedParams = await params;
  const product = await getAdminProductById(resolvedParams.id);
  
  if (!product) {
    notFound();
  }

  const [brands, categories] = await Promise.all([getBrands(), getCategories()]);

  const serializedProduct = {
    ...product,
    basePrice: product.basePrice.toString(),
    originalPrice: product.originalPrice ? product.originalPrice.toString() : null,
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
          Edit Product: {product.name}
        </h1>
        <div className="flex items-center space-x-4">
          <Link
            href={`/admin/products/${product.id}/variants`}
            className="text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 border border-gray-300 px-4 py-2 rounded-sm shadow-sm transition-colors"
          >
            Manage Variants
          </Link>
          <Link
            href="/admin/products"
            className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
          >
            Cancel
          </Link>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-sm shadow-sm overflow-hidden">
        <ProductEditForm product={serializedProduct} brands={brands} categories={categories} />
      </div>
    </div>
  );
}
