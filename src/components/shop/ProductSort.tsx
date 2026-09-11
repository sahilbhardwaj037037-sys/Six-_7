"use client";

import { ChevronDown } from "lucide-react";

export type SortOption = "featured" | "newest" | "price-asc" | "price-desc";

interface ProductSortProps {
  currentSort: SortOption;
  onSortChange: (sort: SortOption) => void;
}

const SORT_OPTIONS: { label: string; value: SortOption }[] = [
  { label: "Featured Order", value: "featured" },
  { label: "Newest Releases", value: "newest" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
];

export function ProductSort({ currentSort, onSortChange }: ProductSortProps) {
  return (
    <div className="relative inline-flex items-center">
      <span className="font-mono text-xs uppercase tracking-wider text-neutral-400 mr-2 hidden sm:inline">
        Sort By:
      </span>
      <div className="relative">
        <select
          value={currentSort}
          onChange={(e) => onSortChange(e.target.value as SortOption)}
          className="appearance-none bg-white border border-neutral-200 text-neutral-900 text-xs font-mono uppercase tracking-wider pl-3 pr-8 py-2 cursor-pointer focus:outline-none focus:border-neutral-900 transition-colors"
          aria-label="Sort silhouettes"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown className="w-3.5 h-3.5 text-neutral-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
      </div>
    </div>
  );
}
