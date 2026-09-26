import { requireAdmin } from "@/lib/admin-auth";
import { getAllAdminInventory } from "@/lib/services/admin-catalog";

export const dynamic = "force-dynamic";

export default async function AdminInventoryPage() {
  await requireAdmin();
  const variants = await getAllAdminInventory();

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
            Global Inventory
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Read-only overview of all product variants and their current stock levels.
          </p>
        </div>
      </div>

      <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SKU</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Size / Color</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Reserved</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Available</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {variants.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-sm text-gray-500">
                    No inventory records found.
                  </td>
                </tr>
              ) : (
                variants.map((variant) => {
                  const qty = variant.inventory?.quantity ?? 0;
                  const res = variant.inventory?.reserved ?? 0;
                  const available = Math.max(0, qty - res);
                  const isArchived = variant.product.isArchived;

                  return (
                    <tr key={variant.id} className={`hover:bg-gray-50 ${isArchived ? 'opacity-60 bg-gray-50' : ''}`}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {variant.product.name}
                        {isArchived && <span className="ml-2 inline-flex items-center rounded-full bg-yellow-50 px-2 py-0.5 text-xs font-medium text-yellow-800 ring-1 ring-inset ring-yellow-600/20">Archived</span>}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {variant.sku}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-700">{variant.size}</span>
                          <span className="text-gray-300">|</span>
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
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-right text-gray-900">
                        {qty}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                        {res}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-right">
                        <span className={available > 0 ? "text-green-600" : "text-red-600"}>
                          {available}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
