import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ProductCard } from "@/components/shop/ProductCard";
import { FEATURED_COLLECTIONS } from "@/data/mock-homepage";
import { SHOP_PRODUCTS, ShopProduct } from "@/data/mock-products";

interface CollectionPageProps {
  params: Promise<{ slug: string }>;
}

const ADDITIONAL_COLLECTIONS: Record<
  string,
  { title: string; tagline: string; slug: string; imageUrl: string }
> = {
  "bio-foam": {
    title: "Bio-Foam Essentials",
    tagline: "Zero-drag propulsion engineered with bio-foam composites and sustainable dampening.",
    slug: "bio-foam",
    imageUrl:
      "https://images.unsplash.com/photo-1582588678413-dbf45f4823e9?auto=format&fit=crop&w=1800&q=80",
  },
};

function getCollectionBySlug(slug: string) {
  const featured = FEATURED_COLLECTIONS.find((c) => c.slug === slug);
  if (featured) return featured;
  return ADDITIONAL_COLLECTIONS[slug] || null;
}

function getCollectionProducts(slug: string): ShopProduct[] {
  let matched: ShopProduct[] = [];
  if (slug === "vanguard-trail") {
    matched = SHOP_PRODUCTS.filter(
      (p) =>
        p.categorySlug === "trail" ||
        p.sport === "trail" ||
        p.slug.includes("vanguard") ||
        p.sport === "training"
    );
  } else if (slug === "atelier-monochrome") {
    matched = SHOP_PRODUCTS.filter(
      (p) =>
        p.slug.includes("atelier") ||
        p.slug.includes("phantom") ||
        p.slug.includes("monolith") ||
        p.categorySlug === "court" ||
        p.categorySlug === "derby"
    );
  } else if (slug === "studio-runners") {
    matched = SHOP_PRODUCTS.filter(
      (p) =>
        p.categorySlug === "running" ||
        p.sport === "running" ||
        p.sport === "training"
    );
  } else if (slug === "bio-foam") {
    matched = SHOP_PRODUCTS.filter(
      (p) =>
        p.categorySlug === "running" ||
        p.category.toLowerCase().includes("bio-foam")
    );
  }
  return matched.length > 0 ? matched : SHOP_PRODUCTS;
}

export async function generateMetadata({
  params,
}: CollectionPageProps): Promise<Metadata> {
  const { slug } = await params;
  const collection = getCollectionBySlug(slug);

  if (!collection) {
    return {
      title: "Collection Not Found // Six&7 Atelier",
    };
  }

  return {
    title: `${collection.title} // Six&7 Atelier`,
    description: collection.tagline,
  };
}

export function generateStaticParams() {
  return [
    { slug: "vanguard-trail" },
    { slug: "atelier-monochrome" },
    { slug: "studio-runners" },
    { slug: "bio-foam" },
  ];
}

export default async function CollectionDetailPage({
  params,
}: CollectionPageProps) {
  const { slug } = await params;
  const collection = getCollectionBySlug(slug);

  if (!collection) {
    notFound();
  }

  const products = getCollectionProducts(slug);

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
                    Curated Collection // Edition
                  </span>
                </div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-light uppercase tracking-tight text-neutral-950">
                  {collection.title}
                </h1>
                <p className="text-neutral-500 text-xs sm:text-sm font-light mt-2 max-w-xl">
                  {collection.tagline}
                </p>
              </div>

              <div className="flex items-center">
                <span className="font-mono text-xs uppercase tracking-widest text-neutral-500">
                  Showing {products.length} {products.length === 1 ? "Silhouette" : "Silhouettes"}
                </span>
              </div>
            </div>
          </div>

          {/* Collection Hero Visual */}
          <div className="mt-8 relative aspect-[21/9] sm:aspect-[24/9] w-full overflow-hidden bg-neutral-900">
            <Image
              src={collection.imageUrl}
              alt={collection.title}
              fill
              priority
              sizes="(max-width: 1280px) 100vw, 1280px"
              className="object-cover object-center opacity-85"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/70 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-6 sm:bottom-6 sm:left-8">
              <span className="text-[10px] sm:text-xs font-mono tracking-widest uppercase text-neutral-300 bg-black/50 px-2.5 py-1 backdrop-blur-sm border border-white/10">
                Official Roster // {collection.title}
              </span>
            </div>
          </div>

          {/* Product Grid */}
          <div className="pt-12">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10">
              {products.map((product) => (
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
