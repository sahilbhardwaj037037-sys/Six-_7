"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { HERO_SLIDES } from "@/data/mock-homepage";

export function HeroSection() {
  const slide = HERO_SLIDES[0];

  return (
    <section className="relative w-full min-h-[calc(100vh-5rem)] bg-[#0C0C0C] text-white flex items-center overflow-hidden">
      {/* Background Editorial Image with subtle dark gradient overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src={slide.imageUrl}
          alt={slide.title}
          fill
          priority
          sizes="100vw"
          className="object-cover object-center opacity-60 mix-blend-luminosity scale-[1.02] transition-transform duration-1000 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0C0C0C] via-[#0C0C0C]/40 to-black/30" />
      </div>

      {/* Hero Content Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full flex flex-col justify-end min-h-[calc(100vh-8rem)]">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-3xl"
        >
          {/* Eyebrow */}
          <div className="flex items-center gap-3 mb-4">
            <span className="inline-block w-8 h-[1px] bg-neutral-400" />
            <span className="font-mono text-xs uppercase tracking-[0.25em] text-neutral-300">
              {slide.eyebrow}
            </span>
          </div>

          {/* Main Title */}
          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-light tracking-tighter uppercase leading-[0.95] mb-6">
            {slide.title}
          </h1>

          {/* Subtitle description */}
          <p className="text-neutral-300 text-sm sm:text-base md:text-lg max-w-xl font-light leading-relaxed mb-8">
            {slide.subtitle}
          </p>

          {/* Call to Actions */}
          <div className="flex flex-wrap items-center gap-4">
            <Link
              href={slide.ctaLink}
              className="group inline-flex items-center justify-between gap-3 px-8 py-4 bg-white text-neutral-950 text-xs font-mono uppercase tracking-widest font-semibold hover:bg-neutral-200 transition-colors"
            >
              <span>{slide.ctaText}</span>
              <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>

            <Link
              href={slide.secondaryLink}
              className="inline-flex items-center px-8 py-4 border border-white/30 text-white text-xs font-mono uppercase tracking-widest hover:border-white hover:bg-white/5 transition-colors"
            >
              {slide.secondaryCta}
            </Link>
          </div>
        </motion.div>

        {/* Footnote Specs */}
        <div className="mt-16 pt-6 border-t border-white/15 grid grid-cols-2 sm:grid-cols-3 gap-6 text-neutral-400 text-xs font-mono">
          <div>
            <p className="text-neutral-500 uppercase tracking-widest text-[10px]">Silhouettes</p>
            <p className="text-white mt-1">Limited Run / 250 Pairs</p>
          </div>
          <div>
            <p className="text-neutral-500 uppercase tracking-widest text-[10px]">Upper Material</p>
            <p className="text-white mt-1">Full-Grain Tuscan Calf</p>
          </div>
          <div className="hidden sm:block">
            <p className="text-neutral-500 uppercase tracking-widest text-[10px]">Sole Dynamic</p>
            <p className="text-white mt-1">Bio-Cellular Dampening</p>
          </div>
        </div>
      </div>
    </section>
  );
}
