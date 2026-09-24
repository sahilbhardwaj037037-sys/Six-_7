import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ProductCard } from "@/components/shop/ProductCard";
import { getProducts } from "@/lib/services/catalog";

export const metadata: Metadata = {
  title: "New Arrivals // Six&7 Atelier",
  description:
    "Explore the latest drop of architectural silhouettes, advanced cushioning, and experimental forms.",
};

export default async function NewArrivalsPage() {
  const newArrivals = await getProducts({ isNewArrival: true });

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
                    Latest Releases // Drop 01
                  </span>
                </div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-light uppercase tracking-tight text-neutral-950">
                  New Arrivals
                </h1>
                <p className="text-neutral-500 text-xs sm:text-sm font-light mt-2 max-w-xl">
                  Recent explorations in bio-composite materials, sculpted sole geometry, and precision-engineered silhouettes.
                </p>
              </div>

              <div className="flex items-center">
                <span className="font-mono text-xs uppercase tracking-widest text-neutral-500">
                  Showing {newArrivals.length} {newArrivals.length === 1 ? "Silhouette" : "Silhouettes"}
                </span>
              </div>
            </div>
          </div>

          {/* Product Grid */}
          <div className="pt-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10">
              {newArrivals.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
