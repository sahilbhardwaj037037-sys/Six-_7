"use client";

import { RotateCcw } from "lucide-react";

interface EmptyProductsStateProps {
  onResetFilters: () => void;
}

export function EmptyProductsState({ onResetFilters }: EmptyProductsStateProps) {
  return (
    <div className="py-24 text-center border border-dashed border-neutral-300 bg-neutral-50/50 p-12">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-neutral-400 mb-2">
        0 Silhouettes Found
      </p>
      <h3 className="text-xl font-light uppercase tracking-tight text-neutral-900 mb-3">
        No Matching Models
      </h3>
      <p className="text-neutral-500 text-xs sm:text-sm font-light max-w-md mx-auto mb-8 leading-relaxed">
        Your current filter configuration yielded no active catalog items. Try resetting your filters to explore the complete footwear collection.
      </p>
      <button
        type="button"
        onClick={onResetFilters}
        className="inline-flex items-center gap-2 px-6 py-3 bg-neutral-900 text-white font-mono text-xs uppercase tracking-widest hover:bg-neutral-800 transition-colors"
      >
        <RotateCcw className="w-3.5 h-3.5" />
        <span>Reset Filters</span>
      </button>
    </div>
  );
}
