import { notFound } from "next/navigation";
import Link from "next/link";
import { getAdminProductById, getAdminProductVariants } from "@/lib/services/admin-catalog";

export default async function AdminProductVariantsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  
  // Fetch base product for the header
  const product = await getAdminProductById(id);
  if (!product) {
    notFound();
  }

  // Fetch variants using our new read-only service
  const variants = await getAdminProductVariants(id);

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between border-b border-gray-200 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Variants: {product.name}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Read-only view of existing product variants and inventory.
          </p>
        </div>
        <div className="flex space-x-3">
          <Link
            href={`/admin/products/${id}/edit`}
            className="text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 border border-gray-300 px-4 py-2 rounded-sm shadow-sm transition-colors"
          >
            Back to Edit Product
          </Link>
          <Link
            href="/admin/products"
            className="text-sm font-medium text-white bg-black hover:bg-gray-800 px-4 py-2 rounded-sm shadow-sm transition-colors"
          >
            All Products
          </Link>
        </div>
      </div>

      <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SKU</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Size</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Color</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Price (Override)</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Reserved</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {variants.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-sm text-gray-500">
                    No variants currently exist for this product.
                  </td>
                </tr>
              ) : (
                variants.map((variant) => (
                  <tr key={variant.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {variant.sku}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {variant.size}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center gap-2">
                        {variant.colorHex && (
                          <span 
                            className="h-3 w-3 rounded-full border border-gray-200 block" 
                            style={{ backgroundColor: variant.colorHex }}
                            title={variant.colorHex}
                          />
                        )}
                        <span>{variant.color}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                      {variant.price ? `$${variant.price.toString()}` : <span className="text-gray-400 italic">Default</span>}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-right">
                      {variant.inventory ? (
                        <span className={variant.inventory.quantity > 0 ? "text-green-600" : "text-red-600"}>
                          {variant.inventory.quantity}
                        </span>
                      ) : (
                        <span className="text-gray-400">N/A</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                      {variant.inventory?.reserved ?? 0}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
