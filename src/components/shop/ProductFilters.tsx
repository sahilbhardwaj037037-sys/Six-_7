"use client";

import { X } from "lucide-react";
import { Gender, ProductCategory, SportType } from "@/data/mock-products";

export interface FilterState {
  gender: Gender | "all";
  category: ProductCategory | "all";
  sport: SportType | "all";
  priceRange: "all" | "under-250" | "250-350" | "over-350";
}

interface ProductFiltersProps {
  filters: FilterState;
  onFilterChange: <K extends keyof FilterState>(key: K, value: FilterState[K]) => void;
  onResetFilters: () => void;
  isMobile?: boolean;
  onCloseMobile?: () => void;
}

const GENDER_OPTIONS: { label: string; value: FilterState["gender"] }[] = [
  { label: "All Genders", value: "all" },
  { label: "Men", value: "men" },
  { label: "Women", value: "women" },
  { label: "Unisex", value: "unisex" },
  { label: "Kids", value: "kids" },
];

const CATEGORY_OPTIONS: { label: string; value: FilterState["category"] }[] = [
  { label: "All Silhouettes", value: "all" },
  { label: "Sneakers", value: "sneakers" },
  { label: "Running", value: "running" },
  { label: "Architectural Court", value: "court" },
  { label: "Leather Derby", value: "derby" },
  { label: "Mules & Slides", value: "mules" },
  { label: "Weatherproof Trail", value: "trail" },
];

const SPORT_OPTIONS: { label: string; value: FilterState["sport"] }[] = [
  { label: "All Disciplines", value: "all" },
  { label: "Lifestyle", value: "lifestyle" },
  { label: "Road Running", value: "running" },
  { label: "Training & Track", value: "training" },
  { label: "Court", value: "court" },
  { label: "Trail & Outdoor", value: "trail" },
];

const PRICE_OPTIONS: { label: string; value: FilterState["priceRange"] }[] = [
  { label: "All Prices", value: "all" },
  { label: "Under $250", value: "under-250" },
  { label: "$250 – $350", value: "250-350" },
  { label: "Over $350", value: "over-350" },
];

export function ProductFilters({
  filters,
  onFilterChange,
  onResetFilters,
  isMobile = false,
  onCloseMobile,
}: ProductFiltersProps) {
  const hasActiveFilters =
    filters.gender !== "all" ||
    filters.category !== "all" ||
    filters.sport !== "all" ||
    filters.priceRange !== "all";

  return (
    <div className={`flex flex-col gap-8 text-neutral-900 ${isMobile ? "p-6" : ""}`}>
      {/* Mobile Top Header */}
      {isMobile && (
        <div className="flex items-center justify-between pb-4 border-b border-neutral-200">
          <span className="font-mono text-sm uppercase tracking-widest font-medium">
            Refine Catalog
          </span>
          <button
            type="button"
            onClick={onCloseMobile}
            className="p-1 text-neutral-500 hover:text-black"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Reset Affordance */}
      {hasActiveFilters && (
        <div className="flex items-center justify-between pb-4 border-b border-neutral-200">
          <span className="font-mono text-xs text-neutral-500 uppercase">Filters Applied</span>
          <button
            type="button"
            onClick={onResetFilters}
            className="text-xs font-mono uppercase tracking-widest text-neutral-900 underline underline-offset-4 hover:text-neutral-500 transition-colors"
          >
            Clear All
          </button>
        </div>
      )}

      {/* Filter Block 1: Gender */}
      <div>
        <h3 className="font-mono text-[11px] uppercase tracking-[0.2em] text-neutral-400 font-semibold mb-3">
          Gender
        </h3>
        <div className="space-y-2">
          {GENDER_OPTIONS.map((opt) => (
            <label
              key={opt.value}
              className="flex items-center gap-3 text-xs text-neutral-700 hover:text-black cursor-pointer select-none"
            >
              <input
                type="radio"
                name={isMobile ? "gender-mobile" : "gender-desktop"}
                checked={filters.gender === opt.value}
                onChange={() => onFilterChange("gender", opt.value)}
                className="w-3.5 h-3.5 accent-neutral-900 border-neutral-300"
              />
              <span>{opt.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Filter Block 2: Category / Silhouette */}
      <div>
        <h3 className="font-mono text-[11px] uppercase tracking-[0.2em] text-neutral-400 font-semibold mb-3">
          Silhouette
        </h3>
        <div className="space-y-2">
          {CATEGORY_OPTIONS.map((opt) => (
            <label
              key={opt.value}
              className="flex items-center gap-3 text-xs text-neutral-700 hover:text-black cursor-pointer select-none"
            >
              <input
                type="radio"
                name={isMobile ? "category-mobile" : "category-desktop"}
                checked={filters.category === opt.value}
                onChange={() => onFilterChange("category", opt.value)}
                className="w-3.5 h-3.5 accent-neutral-900 border-neutral-300"
              />
              <span>{opt.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Filter Block 3: Sport / Discipline */}
      <div>
        <h3 className="font-mono text-[11px] uppercase tracking-[0.2em] text-neutral-400 font-semibold mb-3">
          Discipline
        </h3>
        <div className="space-y-2">
          {SPORT_OPTIONS.map((opt) => (
            <label
              key={opt.value}
              className="flex items-center gap-3 text-xs text-neutral-700 hover:text-black cursor-pointer select-none"
            >
              <input
                type="radio"
                name={isMobile ? "sport-mobile" : "sport-desktop"}
                checked={filters.sport === opt.value}
                onChange={() => onFilterChange("sport", opt.value)}
                className="w-3.5 h-3.5 accent-neutral-900 border-neutral-300"
              />
              <span>{opt.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Filter Block 4: Price Range */}
      <div>
        <h3 className="font-mono text-[11px] uppercase tracking-[0.2em] text-neutral-400 font-semibold mb-3">
          Price Range
        </h3>
        <div className="space-y-2">
          {PRICE_OPTIONS.map((opt) => (
            <label
              key={opt.value}
              className="flex items-center gap-3 text-xs text-neutral-700 hover:text-black cursor-pointer select-none"
            >
              <input
                type="radio"
                name={isMobile ? "price-mobile" : "price-desktop"}
                checked={filters.priceRange === opt.value}
                onChange={() => onFilterChange("priceRange", opt.value)}
                className="w-3.5 h-3.5 accent-neutral-900 border-neutral-300"
              />
              <span>{opt.label}</span>
            </label>
          ))}
        </div>
      </div>

      {isMobile && (
        <div className="pt-4 mt-auto border-t border-neutral-200">
          <button
            type="button"
            onClick={onCloseMobile}
            className="w-full py-3 bg-neutral-900 text-white font-mono text-xs uppercase tracking-widest font-semibold hover:bg-neutral-800 transition-colors"
          >
            Apply Filters
          </button>
        </div>
      )}
    </div>
  );
}
