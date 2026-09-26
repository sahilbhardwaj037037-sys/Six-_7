"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateProduct } from "@/lib/actions/admin-products";

type Brand = { id: string; name: string };
type Category = { id: string; name: string };

type Product = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  basePrice: any; 
  originalPrice: any | null;
  gender: string;
  sport: string;
  brandId: string;
  categoryId: string;
  isArchived: boolean;
  isNewArrival: boolean;
  isBestSeller: boolean;
  featured: boolean;
};

export default function ProductEditForm({ 
  product, 
  brands, 
  categories 
}: { 
  product: Product, 
  brands: Brand[], 
  categories: Category[] 
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const slug = formData.get("slug") as string;
    const description = formData.get("description") as string;
    const basePrice = Number(formData.get("basePrice"));
    
    const originalPriceRaw = formData.get("originalPrice");
    const originalPrice = originalPriceRaw ? Number(originalPriceRaw) : undefined;
    
    const gender = formData.get("gender") as "MEN" | "WOMEN" | "UNISEX" | "KIDS";
    const sport = formData.get("sport") as "RUNNING" | "TRAINING" | "COURT" | "TRAIL" | "LIFESTYLE";
    const brandId = formData.get("brandId") as string;
    const categoryId = formData.get("categoryId") as string;

    // Checkboxes submit 'on' if checked, or null if unchecked
    const isPublished = formData.get("isPublished") === "on";
    const isArchived = !isPublished;
    const isNewArrival = formData.get("isNewArrival") === "on";
    const isBestSeller = formData.get("isBestSeller") === "on";
    const featured = formData.get("featured") === "on";

    startTransition(async () => {
      const result = await updateProduct(product.id, {
        name,
        slug,
        description,
        basePrice,
        originalPrice,
        gender,
        sport,
        brandId,
        categoryId,
        isArchived,
        isNewArrival,
        isBestSeller,
        featured,
      });

      if (!result.success) {
        setError(result.error || "An unexpected error occurred.");
      } else {
        router.push("/admin/products");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-8">
      {error && (
        <div className="p-4 text-sm text-red-800 bg-red-50 rounded-sm border border-red-200">
          {error}
        </div>
      )}

      {/* BASE FIELDS SECTION */}
      <div>
        <h3 className="text-sm font-medium text-gray-900 mb-4 pb-2 border-b border-gray-100">Base Information</h3>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Product Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              defaultValue={product.name}
              className="mt-1 block w-full rounded-sm border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm px-3 py-2 border"
            />
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="slug" className="block text-sm font-medium text-gray-700">
              Slug <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="slug"
              name="slug"
              required
              pattern="^[a-z0-9-]+$"
              title="Only lowercase letters, numbers, and hyphens"
              defaultValue={product.slug}
              className="mt-1 block w-full rounded-sm border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm px-3 py-2 border"
            />
          </div>

          <div>
            <label htmlFor="brandId" className="block text-sm font-medium text-gray-700">Brand <span className="text-red-500">*</span></label>
            <select id="brandId" name="brandId" required defaultValue={product.brandId} className="mt-1 block w-full rounded-sm border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm px-3 py-2 border bg-white">
              <option value="" disabled>Select a brand</option>
              {brands.map((b) => (<option key={b.id} value={b.id}>{b.name}</option>))}
            </select>
          </div>

          <div>
            <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700">Category <span className="text-red-500">*</span></label>
            <select id="categoryId" name="categoryId" required defaultValue={product.categoryId} className="mt-1 block w-full rounded-sm border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm px-3 py-2 border bg-white">
              <option value="" disabled>Select a category</option>
              {categories.map((c) => (<option key={c.id} value={c.id}>{c.name}</option>))}
            </select>
          </div>

          <div>
            <label htmlFor="basePrice" className="block text-sm font-medium text-gray-700">Base Price ($) <span className="text-red-500">*</span></label>
            <input type="number" id="basePrice" name="basePrice" required min="0" step="0.01" defaultValue={Number(product.basePrice)} className="mt-1 block w-full rounded-sm border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm px-3 py-2 border" />
          </div>

          <div>
            <label htmlFor="originalPrice" className="block text-sm font-medium text-gray-700">Original Price ($) <span className="text-gray-400 text-xs">(Optional)</span></label>
            <input type="number" id="originalPrice" name="originalPrice" min="0" step="0.01" defaultValue={product.originalPrice ? Number(product.originalPrice) : ""} className="mt-1 block w-full rounded-sm border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm px-3 py-2 border" />
          </div>

          <div>
            <label htmlFor="gender" className="block text-sm font-medium text-gray-700">Gender <span className="text-red-500">*</span></label>
            <select id="gender" name="gender" required defaultValue={product.gender} className="mt-1 block w-full rounded-sm border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm px-3 py-2 border bg-white">
              <option value="MEN">Men</option>
              <option value="WOMEN">Women</option>
              <option value="UNISEX">Unisex</option>
              <option value="KIDS">Kids</option>
            </select>
          </div>

          <div>
            <label htmlFor="sport" className="block text-sm font-medium text-gray-700">Sport <span className="text-red-500">*</span></label>
            <select id="sport" name="sport" required defaultValue={product.sport} className="mt-1 block w-full rounded-sm border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm px-3 py-2 border bg-white">
              <option value="RUNNING">Running</option>
              <option value="TRAINING">Training</option>
              <option value="COURT">Court</option>
              <option value="TRAIL">Trail</option>
              <option value="LIFESTYLE">Lifestyle</option>
            </select>
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
            <textarea id="description" name="description" rows={4} defaultValue={product.description || ""} className="mt-1 block w-full rounded-sm border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm px-3 py-2 border" />
          </div>
        </div>
      </div>

      {/* STATUS SECTION */}
      <div>
        <h3 className="text-sm font-medium text-gray-900 mb-4 pb-2 border-b border-gray-100">Product Status</h3>
        <div className="flex items-center">
          <input
            type="checkbox"
            id="isPublished"
            name="isPublished"
            defaultChecked={!product.isArchived}
            className="h-4 w-4 rounded border-gray-300 text-black focus:ring-black"
          />
          <label htmlFor="isPublished" className="ml-2 block text-sm font-medium text-gray-700">
            Published / Active
          </label>
        </div>
        <p className="mt-1 text-xs text-gray-500">
          Unchecking this will archive the product, instantly hiding it from the customer catalog.
        </p>
      </div>

      {/* MERCHANDISING SECTION */}
      <div>
        <h3 className="text-sm font-medium text-gray-900 mb-4 pb-2 border-b border-gray-100">Merchandising</h3>
        <div className="space-y-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="isNewArrival"
              name="isNewArrival"
              defaultChecked={product.isNewArrival}
              className="h-4 w-4 rounded border-gray-300 text-black focus:ring-black"
            />
            <label htmlFor="isNewArrival" className="ml-2 block text-sm font-medium text-gray-700">New Arrival</label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="isBestSeller"
              name="isBestSeller"
              defaultChecked={product.isBestSeller}
              className="h-4 w-4 rounded border-gray-300 text-black focus:ring-black"
            />
            <label htmlFor="isBestSeller" className="ml-2 block text-sm font-medium text-gray-700">Best Seller</label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="featured"
              name="featured"
              defaultChecked={product.featured}
              className="h-4 w-4 rounded border-gray-300 text-black focus:ring-black"
            />
            <label htmlFor="featured" className="ml-2 block text-sm font-medium text-gray-700">Featured Product</label>
          </div>
        </div>
      </div>

      <div className="pt-4 flex justify-end">
        <button
          type="submit"
          disabled={isPending}
          className="bg-black text-white px-4 py-2 rounded-sm text-sm font-medium hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isPending ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </form>
  );
}
