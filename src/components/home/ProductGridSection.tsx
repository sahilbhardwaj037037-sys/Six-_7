import Image from "next/image";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Product } from "@/data/mock-homepage";

interface ProductGridSectionProps {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  products: Product[];
  viewAllHref: string;
}

export function ProductGridSection({
  id,
  eyebrow,
  title,
  description,
  products,
  viewAllHref,
}: ProductGridSectionProps) {
  return (
    <section id={id} className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 pb-4 border-b border-neutral-200">
        <div>
          <span className="font-mono text-xs uppercase tracking-widest text-neutral-500">
            {eyebrow}
          </span>
          <h2 className="text-3xl font-light uppercase tracking-tight text-neutral-900 mt-1">
            {title}
          </h2>
        </div>
        <div className="flex items-center gap-6 mt-4 sm:mt-0">
          <p className="text-neutral-500 text-xs sm:text-sm font-light hidden md:block max-w-xs">
            {description}
          </p>
          <Link
            href={viewAllHref}
            className="text-xs font-mono uppercase tracking-widest font-medium text-neutral-900 hover:text-neutral-500 transition-colors underline underline-offset-4"
          >
            View All ({products.length})
          </Link>
        </div>
      </div>

      {/* Product Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
        {products.map((product) => (
          <div key={product.id} className="group flex flex-col">
            {/* Image Box */}
            <div className="relative aspect-[4/5] w-full bg-[#F3F3F3] overflow-hidden">
              <Image
                src={product.imageUrl}
                alt={product.name}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className="object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
              />

              {/* Badge */}
              {product.badge && (
                <span className="absolute top-3 left-3 text-[10px] font-mono tracking-widest uppercase bg-white/95 text-neutral-900 px-2 py-0.5 border border-neutral-200">
                  {product.badge}
                </span>
              )}

              {/* Quick Add Action Affordance */}
              <button
                type="button"
                className="absolute bottom-3 right-3 w-9 h-9 bg-white text-neutral-900 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 group-hover:translate-y-0 translate-y-2 transition-all duration-300 shadow-md hover:bg-neutral-900 hover:text-white"
                aria-label={`Add ${product.name} to cart`}
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Info */}
            <div className="pt-4 flex flex-col flex-1 justify-between">
              <div>
                <div className="flex justify-between items-start gap-2">
                  <p className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider">
                    {product.category}
                  </p>
                  {/* Swatches */}
                  <div className="flex items-center gap-1 mt-0.5">
                    {product.colorways.map((color, idx) => (
                      <span
                        key={idx}
                        className="w-2.5 h-2.5 rounded-full border border-neutral-300"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>

                <h3 className="text-sm font-medium text-neutral-900 mt-1 uppercase tracking-tight group-hover:text-neutral-600 transition-colors">
                  {product.name}
                </h3>
              </div>

              {/* Price Row */}
              <div className="flex items-center gap-2 mt-2">
                <span className="font-mono text-sm text-neutral-900 font-medium">
                  ${product.price}
                </span>
                {product.originalPrice && (
                  <span className="font-mono text-xs text-neutral-400 line-through">
                    ${product.originalPrice}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
