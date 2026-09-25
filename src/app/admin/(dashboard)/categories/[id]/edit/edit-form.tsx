"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { updateCategory } from "@/lib/actions/admin-categories";

interface CategoryData {
  id: string;
  name: string;
  slug: string;
  description: string | null;
}

export default function EditCategoryForm({ category }: { category: CategoryData }) {
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

    startTransition(async () => {
      const result = await updateCategory(category.id, { name, slug, description });

      if (!result.success) {
        setError(result.error || "An unexpected error occurred.");
      } else {
        router.push("/admin/categories");
      }
    });
  };

  return (
    <div className="bg-white border border-gray-200 rounded-sm shadow-sm overflow-hidden">
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {error && (
          <div className="p-4 text-sm text-red-800 bg-red-50 rounded-sm border border-red-200">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Category Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              defaultValue={category.name}
              required
              className="mt-1 block w-full rounded-sm border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm px-3 py-2 border"
              placeholder="e.g., Running Shoes"
            />
          </div>

          <div>
            <label htmlFor="slug" className="block text-sm font-medium text-gray-700">
              Slug <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="slug"
              name="slug"
              defaultValue={category.slug}
              required
              pattern="^[a-z0-9-]+$"
              title="Only lowercase letters, numbers, and hyphens"
              className="mt-1 block w-full rounded-sm border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm px-3 py-2 border"
              placeholder="e.g., running-shoes"
            />
            <p className="mt-1 text-xs text-gray-500">
              Used in URLs. Must be lowercase, numbers, and hyphens only.
            </p>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              defaultValue={category.description || ""}
              rows={4}
              className="mt-1 block w-full rounded-sm border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm px-3 py-2 border"
              placeholder="Optional category description..."
            />
          </div>
        </div>

        <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
          <Link
            href="/admin/categories"
            className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isPending}
            className="bg-black text-white px-4 py-2 rounded-sm text-sm font-medium hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isPending ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
