import { notFound } from "next/navigation";
import Link from "next/link";
import { getProductBySlug, getProducts } from "@/lib/services/catalog";
import { ProductGallery } from "@/components/product/ProductGallery";
import { ProductPurchasePanel } from "@/components/product/ProductPurchasePanel";
import { ProductCard } from "@/components/shop/ProductCard";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  // In Next.js 15+, params is a Promise
  const resolvedParams = await params;
  const product = await getProductBySlug(resolvedParams.slug);

  if (!product) {
    notFound();
  }

  // Generate gallery images (simulating multiple angles with unsplash placeholders if needed)
  const galleryImages = [
    product.imageUrl,
    product.secondaryImageUrl || "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1511556532299-8f662fc26c06?auto=format&fit=crop&w=800&q=80"
  ];

  // Find up to 4 related products (matching category or gender, excluding current)
  const relatedProducts = (await getProducts()).filter
    ((p) => (p.categorySlug === product.categorySlug || p.gender === product.gender) && p.id !== product.id)
    .slice(0, 4);

  return (
    <main className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-4">
        <nav className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 flex items-center gap-2">
          <Link href="/" className="hover:text-neutral-900 transition-colors">Home</Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-neutral-900 transition-colors">Shop</Link>
          <span>/</span>
          <span className="text-neutral-900 truncate max-w-[200px] sm:max-w-none">{product.name}</span>
        </nav>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Left Column: Gallery */}
          <div className="lg:col-span-7">
            <ProductGallery 
              name={product.name} 
              badge={product.badge} 
              images={galleryImages} 
            />
          </div>

          {/* Right Column: Info & Purchase */}
          <div className="lg:col-span-5 flex flex-col">
            <div className="mb-8">
              <h2 className="text-[11px] font-mono uppercase tracking-widest text-neutral-500 mb-3">
                {product.category}
              </h2>
              <h1 className="text-3xl sm:text-4xl font-medium tracking-tight text-neutral-900 uppercase mb-4">
                {product.name}
              </h1>
              <div className="flex items-center gap-4 mb-6">
                <span className="text-xl font-mono text-neutral-950">${product.price}</span>
                {product.originalPrice && (
                  <span className="text-sm font-mono text-neutral-400 line-through">${product.originalPrice}</span>
                )}
              </div>
              <p className="text-neutral-600 text-sm leading-relaxed">
                Designed for movement and constructed with premium architectural precision. The {product.name} blends our signature minimalist aesthetic with advanced ergonomic support. Perfect for both high-intensity transition and static composure.
              </p>
            </div>

            <ProductPurchasePanel product={product} />

            {/* Editorial / Details Accordion */}
            <div className="mt-12 border-t border-neutral-200">
              <details className="group border-b border-neutral-200 py-4 cursor-pointer" open>
                <summary className="flex justify-between items-center font-mono text-xs uppercase tracking-wider text-neutral-900 list-none">
                  <span>Details & Specifications</span>
                  <span className="group-open:rotate-180 transition-transform duration-300">↓</span>
                </summary>
                <div className="pt-4 text-sm text-neutral-600 space-y-3">
                  <p><strong className="font-medium text-neutral-900">Upper:</strong> Seamless bio-knit and premium leather overlays.</p>
                  <p><strong className="font-medium text-neutral-900">Sole:</strong> Articulated EVA foam with localized rubber traction.</p>
                  <p><strong className="font-medium text-neutral-900">Origin:</strong> Hand-finished in Portugal.</p>
                </div>
              </details>
              <details className="group border-b border-neutral-200 py-4 cursor-pointer">
                <summary className="flex justify-between items-center font-mono text-xs uppercase tracking-wider text-neutral-900 list-none">
                  <span>Shipping & Returns</span>
                  <span className="group-open:rotate-180 transition-transform duration-300">↓</span>
                </summary>
                <div className="pt-4 text-sm text-neutral-600 space-y-3">
                  <p>Complimentary express shipping on all domestic orders over $200. Delivery typically takes 2-4 business days.</p>
                  <p>We accept returns within 30 days of delivery in their original, unworn condition.</p>
                </div>
              </details>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 border-t border-neutral-100 mt-12">
          <h3 className="text-lg font-medium uppercase tracking-tight text-neutral-900 mb-8">
            Complete the Look
          </h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </main>
  );
}
