import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { FEATURED_COLLECTIONS } from "@/data/mock-homepage";

export function CollectionsGrid() {
  return (
    <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 pb-4 border-b border-neutral-200">
        <div>
          <span className="font-mono text-xs uppercase tracking-widest text-neutral-500">
            Curation
          </span>
          <h2 className="text-3xl sm:text-4xl font-light uppercase tracking-tight text-neutral-900 mt-1">
            Featured Collections
          </h2>
        </div>
        <p className="text-neutral-500 text-sm max-w-md mt-4 md:mt-0 font-light">
          Engineered silhouettes segmented by terrain, pacing, and architectural formality.
        </p>
      </div>

      {/* Grid of 3 Collections */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {FEATURED_COLLECTIONS.map((col) => (
          <Link
            key={col.id}
            href={`/collections/${col.slug}`}
            className="group block relative overflow-hidden bg-neutral-100"
          >
            {/* Image Container with Hover Scale */}
            <div className="relative aspect-[3/4] w-full overflow-hidden">
              <Image
                src={col.imageUrl}
                alt={col.title}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover object-center grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-neutral-950/20 to-transparent" />
            </div>

            {/* Overlay Details */}
            <div className="absolute inset-0 p-6 flex flex-col justify-between text-white">
              <div className="flex justify-between items-start">
                <span className="text-[11px] font-mono tracking-widest uppercase bg-black/40 backdrop-blur-md px-2.5 py-1 border border-white/20">
                  {col.itemCount} Styles
                </span>
                <span className="w-8 h-8 rounded-full border border-white/30 flex items-center justify-center opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300">
                  <ArrowRight className="w-4 h-4 text-white" />
                </span>
              </div>

              <div>
                <h3 className="text-xl font-medium tracking-tight uppercase mb-1">
                  {col.title}
                </h3>
                <p className="text-xs text-neutral-300 font-light line-clamp-2">
                  {col.tagline}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
