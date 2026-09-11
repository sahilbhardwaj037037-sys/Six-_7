"use client";

import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { SlidersHorizontal } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { SHOP_PRODUCTS, ShopProduct, Gender, ProductCategory, SportType } from "@/data/mock-products";
import { ShopHeader } from "./ShopHeader";
import { ProductCard } from "./ProductCard";
import { ProductFilters, FilterState } from "./ProductFilters";
import { ProductSort, SortOption } from "./ProductSort";
import { EmptyProductsState } from "./EmptyProductsState";

export function ShopClient() {
  const searchParams = useSearchParams();

  const [filters, setFilters] = useState<FilterState>({
    gender: "all",
    category: "all",
    sport: "all",
    priceRange: "all",
  });

  const [sortOption, setSortOption] = useState<SortOption>("featured");
  const [gridCols, setGridCols] = useState<3 | 4>(3);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Sync with initial URL search params if present
  useEffect(() => {
    const categoryParam = searchParams.get("category") as ProductCategory | null;
    const genderParam = searchParams.get("gender") as Gender | null;
    const sportParam = searchParams.get("sport") as SportType | null;

    setFilters((prev) => ({
      ...prev,
      category: categoryParam || prev.category,
      gender: genderParam || prev.gender,
      sport: sportParam || prev.sport,
    }));
  }, [searchParams]);

  const handleFilterChange = <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleResetFilters = () => {
    setFilters({
      gender: "all",
      category: "all",
      sport: "all",
      priceRange: "all",
    });
  };

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    let result: ShopProduct[] = [...SHOP_PRODUCTS];

    // Gender Filter
    if (filters.gender !== "all") {
      result = result.filter(
        (p) => p.gender === filters.gender || p.gender === "unisex"
      );
    }

    // Category Filter
    if (filters.category !== "all") {
      result = result.filter((p) => p.categorySlug === filters.category);
    }

    // Sport / Discipline Filter
    if (filters.sport !== "all") {
      result = result.filter((p) => p.sport === filters.sport);
    }

    // Price Filter
    if (filters.priceRange === "under-250") {
      result = result.filter((p) => p.price < 250);
    } else if (filters.priceRange === "250-350") {
      result = result.filter((p) => p.price >= 250 && p.price <= 350);
    } else if (filters.priceRange === "over-350") {
      result = result.filter((p) => p.price > 350);
    }

    // Sorting
    if (sortOption === "newest") {
      result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (sortOption === "price-asc") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortOption === "price-desc") {
      result.sort((a, b) => b.price - a.price);
    } else {
      // "featured" default: featured items first
      result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }

    return result;
  }, [filters, sortOption]);

  const activeGenderLabel = filters.gender !== "all" ? filters.gender.toUpperCase() : undefined;
  const activeCategoryLabel = filters.category !== "all" ? filters.category.toUpperCase() : undefined;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
      {/* Editorial Header */}
      <ShopHeader
        totalCount={filteredProducts.length}
        activeGender={activeGenderLabel}
        activeCategory={activeCategoryLabel}
        gridCols={gridCols}
        onGridColsChange={setGridCols}
      />

      {/* Discovery Subbar: Mobile Filter Trigger & Sort Options */}
      <div className="py-4 flex items-center justify-between border-b border-neutral-200 lg:justify-end mb-8">
        <button
          type="button"
          onClick={() => setMobileFilterOpen(true)}
          className="lg:hidden inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-neutral-900 border border-neutral-200 px-3 py-2 bg-white"
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span>Filters</span>
        </button>

        <ProductSort currentSort={sortOption} onSortChange={setSortOption} />
      </div>

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Desktop Sticky Filters Sidebar */}
        <aside className="hidden lg:block lg:col-span-3 sticky top-28 pr-6">
          <ProductFilters
            filters={filters}
            onFilterChange={handleFilterChange}
            onResetFilters={handleResetFilters}
          />
        </aside>

        {/* Products Grid Area */}
        <section className="lg:col-span-9">
          {filteredProducts.length === 0 ? (
            <EmptyProductsState onResetFilters={handleResetFilters} />
          ) : (
            <div
              className={`grid gap-x-6 gap-y-10 grid-cols-1 sm:grid-cols-2 ${
                gridCols === 3 ? "lg:grid-cols-3" : "lg:grid-cols-4"
              }`}
            >
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Mobile Filters Slide-over Drawer */}
      <AnimatePresence>
        {mobileFilterOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileFilterOpen(false)}
              className="fixed inset-0 bg-black z-50 lg:hidden"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.25 }}
              className="fixed inset-y-0 right-0 w-full max-w-xs bg-[#FCFCFC] z-50 overflow-y-auto border-l border-neutral-200 shadow-2xl lg:hidden flex flex-col"
            >
              <ProductFilters
                filters={filters}
                onFilterChange={handleFilterChange}
                onResetFilters={handleResetFilters}
                isMobile
                onCloseMobile={() => setMobileFilterOpen(false)}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
