"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

interface ProductGalleryProps {
  name: string;
  badge?: string;
  images: string[];
}

export function ProductGallery({ name, badge, images }: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const activeImage = images[selectedIndex] || images[0];

  return (
    <div className="flex flex-col-reverse lg:flex-row gap-4 w-full">
      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex lg:flex-col gap-3 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0 scrollbar-none shrink-0">
          {images.map((img, idx) => {
            const isSelected = idx === selectedIndex;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => setSelectedIndex(idx)}
                aria-label={`View image ${idx + 1} of ${name}`}
                className={`relative w-18 h-22 sm:w-20 sm:h-24 bg-neutral-100 overflow-hidden border transition-all duration-200 shrink-0 ${
                  isSelected
                    ? "border-neutral-900 ring-1 ring-neutral-900"
                    : "border-transparent hover:border-neutral-300 opacity-70 hover:opacity-100"
                }`}
              >
                <Image
                  src={img}
                  alt={`${name} thumbnail ${idx + 1}`}
                  fill
                  sizes="80px"
                  className="object-cover object-center"
                />
              </button>
            );
          })}
        </div>
      )}

      {/* Main Image Display */}
      <div className="relative aspect-[4/5] w-full bg-[#F5F5F5] overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedIndex}
            initial={{ opacity: 0.4 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0.4 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="relative w-full h-full"
          >
            <Image
              src={activeImage}
              alt={`${name} view ${selectedIndex + 1}`}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 55vw"
              className="object-cover object-center"
            />
          </motion.div>
        </AnimatePresence>

        {badge && (
          <span className="absolute top-4 left-4 text-[10px] font-mono tracking-widest uppercase bg-white/95 text-neutral-900 px-2.5 py-1 border border-neutral-200 pointer-events-none z-10">
            {badge}
          </span>
        )}

        {/* Counter for Mobile */}
        {images.length > 1 && (
          <div className="absolute bottom-4 right-4 text-[11px] font-mono tracking-wider bg-neutral-950/70 text-white px-2.5 py-1 rounded-full backdrop-blur-sm lg:hidden">
            {selectedIndex + 1} / {images.length}
          </div>
        )}
      </div>
    </div>
  );
}
