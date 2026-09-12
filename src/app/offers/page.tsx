import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ProductCard } from "@/components/shop/ProductCard";
import { SHOP_PRODUCTS } from "@/data/mock-products";

export const metadata: Metadata = {
  title: "Archival Offers // Six&7 Atelier",
  description:
    "Curated promotional silhouettes and seasonal reductions from the Six&7 collection.",
};

export default function OffersPage() {
  const promotionalProducts = SHOP_PRODUCTS.filter(
    (product) => product.originalPrice !== undefined && product.originalPrice > product.price
  );

  return (
    <div className="flex flex-col min-h-screen bg-[#FBFBFB]">
      <Navbar />

      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          {/* Breadcrumb / Back Link */}
          <div className="mb-6">
            <Link
              href="/shop"
              className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-widest text-neutral-400 hover:text-neutral-900 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Catalog</span>
            </Link>
          </div>

          {/* Editorial Header */}
          <div className="pt-2 pb-8 border-b border-neutral-200">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-mono text-xs uppercase tracking-[0.25em] text-neutral-400">
                    Selected Editions // Archive Reductions
                  </span>
                </div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-light uppercase tracking-tight text-neutral-950">
                  Offers & Reductions
                </h1>
                <p className="text-neutral-500 text-xs sm:text-sm font-light mt-2 max-w-xl">
                  Limited-time pricing adjustments on select silhouettes. Handcrafted materials with preserved warranty and authenticity.
                </p>
              </div>

              <div className="flex items-center">
                <span className="font-mono text-xs uppercase tracking-widest text-neutral-500">
                  Showing {promotionalProducts.length} {promotionalProducts.length === 1 ? "Silhouette" : "Silhouettes"}
                </span>
              </div>
            </div>
          </div>

          {/* Product Grid */}
          <div className="pt-10">
            {promotionalProducts.length === 0 ? (
              <div className="py-24 text-center border border-dashed border-neutral-200 bg-white p-8">
                <span className="font-mono text-xs uppercase tracking-widest text-neutral-400 block mb-2">
                  No Current Reductions
                </span>
                <p className="text-sm text-neutral-600 mb-6">
                  All active silhouettes are currently at standard edition pricing.
                </p>
                <Link
                  href="/shop"
                  className="inline-block px-6 py-3 bg-neutral-950 text-white text-xs font-mono uppercase tracking-wider hover:bg-neutral-800 transition-colors"
                >
                  Explore Full Catalog
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10">
                {promotionalProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
