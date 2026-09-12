"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { ProductCard } from "@/components/shop/ProductCard";
import { ShopProduct } from "@/data/mock-products";

export interface CategoryHighlight {
  label: string;
  value: string;
  description: string;
}

export interface CategoryLandingConfig {
  slug: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  description: string;
  heroImage: string;
  editorialNote: string;
  stats: CategoryHighlight[];
  explorePills: { label: string; href: string }[];
}

interface CategoryLandingViewProps {
  config: CategoryLandingConfig;
  products: ShopProduct[];
}

export function CategoryLandingView({ config, products }: CategoryLandingViewProps) {
  return (
    <div className="bg-[#FBFBFB] min-h-screen text-neutral-900">
      {/* 1. Category Hero Banner */}
      <section className="relative w-full min-h-[60vh] sm:min-h-[70vh] bg-[#0C0C0C] text-white flex items-end overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src={config.heroImage}
            alt={config.title}
            fill
            priority
            sizes="100vw"
            className="object-cover object-center opacity-50 mix-blend-luminosity scale-[1.01]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0C0C0C] via-[#0C0C0C]/50 to-black/30" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-3xl"
          >
            <div className="flex items-center gap-3 mb-4">
              <span className="inline-block w-8 h-[1px] bg-neutral-400" />
              <span className="font-mono text-xs uppercase tracking-[0.25em] text-neutral-300">
                {config.eyebrow}
              </span>
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-light tracking-tighter uppercase leading-[0.95] mb-5 text-white">
              {config.title}
            </h1>

            <p className="text-neutral-300 text-sm sm:text-base md:text-lg font-light leading-relaxed max-w-2xl mb-8">
              {config.subtitle}
            </p>

            <div className="flex flex-wrap gap-2 pt-2">
              {config.explorePills.map((pill) => (
                <Link
                  key={pill.label}
                  href={pill.href}
                  className="px-4 py-2 border border-white/20 bg-black/40 backdrop-blur-xs text-[11px] font-mono uppercase tracking-widest text-neutral-200 hover:border-white hover:text-white transition-colors"
                >
                  {pill.label}
                </Link>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. Editorial Statement & Technical Specs */}
      <section className="border-b border-neutral-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            <div className="lg:col-span-5">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-2 h-2 rounded-full bg-neutral-900" />
                <span className="font-mono text-xs uppercase tracking-[0.2em] text-neutral-500">
                  Design Narrative
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-light tracking-tight text-neutral-900 leading-snug">
                Form refined through disciplined restraint.
              </h2>
            </div>

            <div className="lg:col-span-7 flex flex-col justify-between">
              <p className="text-neutral-600 font-light text-sm sm:text-base leading-relaxed mb-8">
                {config.description}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-neutral-100">
                {config.stats.map((stat) => (
                  <div key={stat.label}>
                    <span className="block font-mono text-xs uppercase tracking-wider text-neutral-400 mb-1">
                      {stat.label}
                    </span>
                    <span className="block text-xl sm:text-2xl font-light text-neutral-900 tracking-tight">
                      {stat.value}
                    </span>
                    <span className="block text-xs text-neutral-500 mt-1 font-light">
                      {stat.description}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Curated Product Roster */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-8 border-b border-neutral-200 mb-10">
          <div>
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-neutral-400 block mb-1">
              Curated Roster
            </span>
            <h2 className="text-2xl sm:text-3xl font-light uppercase tracking-tight text-neutral-950">
              Active Silhouettes
            </h2>
          </div>
          <span className="font-mono text-xs text-neutral-500 uppercase tracking-widest">
            Showing {products.length} {products.length === 1 ? "Model" : "Models"}
          </span>
        </div>

        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="py-24 text-center border border-dashed border-neutral-300 bg-neutral-50/50">
            <p className="font-mono text-xs uppercase tracking-widest text-neutral-400 mb-3">
              Allocation Pending
            </p>
            <p className="text-neutral-700 font-light text-sm max-w-sm mx-auto mb-6">
              New seasonal iterations for this category are currently transitioning through production.
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-neutral-950 underline underline-offset-4"
            >
              <span>Explore Complete Atelier Catalog</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}
      </section>

      {/* 4. Atelier Editorial Secondary Strip */}
      <section className="bg-neutral-900 text-white border-t border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            <div className="max-w-xl">
              <span className="font-mono text-xs uppercase tracking-[0.25em] text-neutral-400 block mb-2">
                Atelier Standards
              </span>
              <h3 className="text-2xl sm:text-3xl font-light uppercase tracking-tight mb-3">
                {config.editorialNote}
              </h3>
              <p className="text-neutral-400 font-light text-sm leading-relaxed">
                Every release is shaped through rapid acoustic prototyping, natural vegetable-tanned leathers, and structural bio-damping soles.
              </p>
            </div>
            <Link
              href="/shop"
              className="group inline-flex items-center gap-3 px-8 py-4 bg-white text-neutral-950 text-xs font-mono uppercase tracking-widest font-semibold hover:bg-neutral-200 transition-colors shrink-0"
            >
              <span>View Full Catalog</span>
              <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
