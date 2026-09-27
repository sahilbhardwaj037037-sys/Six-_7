"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { updateProductVariant } from "@/lib/actions/admin-products";

interface EditVariantFormProps {
  productId: string;
  variant: {
    id: string;
    sku: string;
    size: string;
    color: string;
    colorHex: string;
    price: string;
  };
}

export function EditVariantForm({ productId, variant }: EditVariantFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    
    startTransition(async () => {
      const res = await updateProductVariant(productId, variant.id, formData);
      if (res?.error) {
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
        <h1 className="text-2xl font-bold text-gray-900">Edit Variant</h1>
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
        
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                <strong>Notice:</strong> Changing size, color, or price will immediately affect any existing customer carts containing this variant.
              </p>
            </div>
          </div>
        </div>

        <div>
          <label htmlFor="sku" className="block text-sm font-medium text-gray-700">SKU *</label>
          <input type="text" id="sku" name="sku" required defaultValue={variant.sku} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black sm:text-sm" />
        </div>

        <div>
          <label htmlFor="size" className="block text-sm font-medium text-gray-700">Size *</label>
          <input type="text" id="size" name="size" required defaultValue={variant.size} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black sm:text-sm" />
        </div>

        <div>
          <label htmlFor="color" className="block text-sm font-medium text-gray-700">Color *</label>
          <input type="text" id="color" name="color" required defaultValue={variant.color} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black sm:text-sm" />
        </div>

        <div>
          <label htmlFor="colorHex" className="block text-sm font-medium text-gray-700">Color Hex</label>
          <input type="text" id="colorHex" name="colorHex" defaultValue={variant.colorHex} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black sm:text-sm" placeholder="e.g. #111111" />
        </div>

        <div>
          <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price Override (Optional)</label>
          <input type="number" step="0.01" min="0" id="price" name="price" defaultValue={variant.price} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black sm:text-sm" placeholder="Leave blank to use base product price" />
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={isPending}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-sm shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isPending ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
