import { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ProductCard } from "@/components/shop/ProductCard";
import { getProducts } from "@/lib/services/catalog";
import { Prisma } from "@/generated/prisma/client";
import { ArrowLeft, Search } from "lucide-react";

export const metadata: Metadata = {
  title: "Search // Six&7 Atelier",
  description: "Search our catalog of architectural silhouettes.",
};

interface SearchPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const rawQuery = params.q;
  const query = typeof rawQuery === "string" ? rawQuery.trim() : "";

  // FIX: Strictly type the empty array to match the return signature of getProducts
  let products: Awaited<ReturnType<typeof getProducts>> = [];
  let hasSearched = false;

  // Only query the database if there is an actual search term
  if (query) {
    hasSearched = true;
    
    // Construct the free-text search payload using Prisma's native OR syntax.
    const where: Prisma.ProductWhereInput = {
      OR: [
        { name: { contains: query, mode: "insensitive" } },
        { slug: { contains: query, mode: "insensitive" } },
        { category: { name: { contains: query, mode: "insensitive" } } },
      ],
    };

    products = await getProducts(where);
  }

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

          {/* Search Header */}
          <div className="pt-2 pb-8 border-b border-neutral-200">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-mono text-xs uppercase tracking-[0.25em] text-neutral-400">
                    Search Archive
                  </span>
                </div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-light uppercase tracking-tight text-neutral-950">
                  {hasSearched ? `Results for "${query}"` : "Search"}
                </h1>
                {hasSearched && (
                  <p className="text-neutral-500 text-xs sm:text-sm font-light mt-2 max-w-xl">
                    Showing {products.length} {products.length === 1 ? "Silhouette" : "Silhouettes"}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Dynamic Search Content */}
          <div className="pt-12">
            {!hasSearched ? (
              // Empty Search Prompt State
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <Search className="w-8 h-8 text-neutral-300 mb-4 stroke-[1.5]" />
                <h2 className="text-lg font-medium text-neutral-900">Discover Silhouettes</h2>
                <p className="text-sm text-neutral-500 mt-2 max-w-md mx-auto">
                  Use the search menu above to find specific models, colorways, or collections.
                </p>
              </div>
            ) : products.length === 0 ? (
              // No Results State
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <Search className="w-8 h-8 text-neutral-300 mb-4 stroke-[1.5]" />
                <h2 className="text-lg font-medium text-neutral-900">No results found</h2>
                <p className="text-sm text-neutral-500 mt-2 max-w-md mx-auto">
                  We couldn't find any silhouettes matching "{query}". Try checking your spelling or exploring our main collections.
                </p>
                <Link
                  href="/shop"
                  className="mt-6 inline-block bg-black text-white text-xs font-mono uppercase tracking-widest px-6 py-3 hover:bg-neutral-800 transition-colors"
                >
                  Browse Full Catalog
                </Link>
              </div>
            ) : (
              // Results Grid
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10">
                {products.map((product) => (
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
