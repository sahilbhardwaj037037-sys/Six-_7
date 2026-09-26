"use client";

import { useState, useTransition, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createProductVariant } from "@/lib/actions/admin-products";

export default function NewVariantPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: productId } = use(params);
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    
    // Safety sync: Ensure colorHex precisely matches color per database conventions
    const colorValue = formData.get("color");
    if (colorValue && typeof colorValue === "string") {
      formData.set("colorHex", colorValue.trim());
    }
    
    startTransition(async () => {
      const res = await createProductVariant(productId, formData);
      if (res.error) {
        setError(res.error);
      } else {
        router.push(`/admin/products/${productId}/variants`);
        router.refresh();
      }
    });
  };

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between border-b border-gray-200 pb-4">
        <h1 className="text-2xl font-bold text-gray-900">Add New Variant</h1>
        <Link
          href={`/admin/products/${productId}/variants`}
          className="text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 border border-gray-300 px-4 py-2 rounded-sm shadow-sm transition-colors"
        >
          Cancel
        </Link>
      </div>

      {error && (
        <div className="p-4 text-sm text-red-800 bg-red-50 border border-red-200 rounded-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 shadow-sm ring-1 ring-gray-900/5 sm:rounded-lg">
        <div>
          <label htmlFor="sku" className="block text-sm font-medium text-gray-700">SKU *</label>
          <input type="text" id="sku" name="sku" required className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black sm:text-sm" placeholder="e.g. V1-PHANTOM-LOW-NOIR-9" />
        </div>

        <div>
          <label htmlFor="size" className="block text-sm font-medium text-gray-700">Size *</label>
          <input type="text" id="size" name="size" required className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black sm:text-sm" placeholder="e.g. 9 or M" />
        </div>

        <div>
          <label htmlFor="color" className="block text-sm font-medium text-gray-700">Color *</label>
          <input type="text" id="color" name="color" required className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black sm:text-sm" placeholder="e.g. #111111" />
          <p className="mt-1 text-xs text-gray-500">Enter the exact hex color code used for this product.</p>
        </div>

        <div>
          <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price Override (Optional)</label>
          <input type="number" step="0.01" min="0" id="price" name="price" className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black sm:text-sm" placeholder="Leave blank to use base product price" />
        </div>

        <div>
          <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">Initial Stock *</label>
          <input type="number" min="0" id="quantity" name="quantity" required defaultValue="0" className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black sm:text-sm" />
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={isPending}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-sm shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isPending ? "Creating..." : "Create Variant"}
          </button>
        </div>
      </form>
    </div>
  );
}
