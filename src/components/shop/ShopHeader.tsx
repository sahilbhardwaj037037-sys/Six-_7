"use client";

import { LayoutGrid, Grid3X3 } from "lucide-react";

interface ShopHeaderProps {
  totalCount: number;
  activeGender?: string;
  activeCategory?: string;
  gridCols: 3 | 4;
  onGridColsChange: (cols: 3 | 4) => void;
}

export function ShopHeader({
  totalCount,
  activeGender,
  activeCategory,
  gridCols,
  onGridColsChange,
}: ShopHeaderProps) {
  const getDynamicTitle = () => {
    if (activeGender && activeCategory) {
      return `${activeGender}'s ${activeCategory}`;
    }
    if (activeGender) {
      return `${activeGender}'s Footwear`;
    }
    if (activeCategory) {
      return activeCategory;
    }
    return "All Footwear";
  };

  return (
    <div className="pt-8 pb-6 border-b border-neutral-200">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="font-mono text-xs uppercase tracking-[0.25em] text-neutral-400">
              The Catalog // 2026
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-light uppercase tracking-tight text-neutral-950">
            {getDynamicTitle()}
          </h1>
          <p className="text-neutral-500 text-xs sm:text-sm font-light mt-2 max-w-xl">
            Architectural silhouettes, bio-composite dampening, and handcrafted Italian leather construction.
          </p>
        </div>

        {/* Right Controls: Count & Grid View Toggle */}
        <div className="flex items-center justify-between md:justify-end gap-6 pt-2 md:pt-0">
          <span className="font-mono text-xs uppercase tracking-widest text-neutral-500">
            Showing {totalCount} {totalCount === 1 ? "Silhouette" : "Silhouettes"}
          </span>

          <div className="hidden lg:flex items-center gap-1 border border-neutral-200 p-1 bg-white">
            <button
              type="button"
              onClick={() => onGridColsChange(3)}
              className={`p-1.5 transition-colors ${
                gridCols === 3
                  ? "bg-neutral-900 text-white"
                  : "text-neutral-400 hover:text-neutral-900"
              }`}
              aria-label="3 columns grid"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => onGridColsChange(4)}
              className={`p-1.5 transition-colors ${
                gridCols === 4
                  ? "bg-neutral-900 text-white"
                  : "text-neutral-400 hover:text-neutral-900"
              }`}
              aria-label="4 columns grid"
            >
              <Grid3X3 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
