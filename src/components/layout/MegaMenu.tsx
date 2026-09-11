"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { MegaMenuContent } from "@/data/mega-menu-data";

interface MegaMenuProps {
  content: MegaMenuContent;
  onClose: () => void;
}

export function MegaMenu({ content, onClose }: MegaMenuProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
      className="absolute top-full left-0 w-full bg-[#FCFCFC] border-b border-neutral-200/90 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.08)] z-50 text-neutral-900"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-10">
        <div className="grid grid-cols-12 gap-10 items-start">
          {/* Content Columns (Sections) */}
          <div className="col-span-8 grid grid-cols-3 gap-8 border-r border-neutral-200/70 pr-10">
            {content.sections.map((section, idx) => (
              <div key={idx} className="flex flex-col">
                <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-neutral-400 font-semibold mb-4">
                  {section.title}
                </span>

                <ul className="space-y-3">
                  {section.items.map((item, itemIdx) => (
                    <li key={itemIdx}>
                      <Link
                        href={item.href}
                        onClick={onClose}
                        className="group inline-flex items-center gap-2 text-[13px] font-light text-neutral-700 hover:text-black transition-colors"
                      >
                        <span className="group-hover:translate-x-0.5 transition-transform duration-150">
                          {item.name}
                        </span>
                        {item.badge && (
                          <span className="text-[9px] font-mono uppercase tracking-wider px-1.5 py-0.5 bg-neutral-900 text-white font-medium">
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Featured Visual Spotlight */}
          {content.featured && (
            <div className="col-span-4 flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-neutral-400 font-semibold block mb-4">
                  Spotlight
                </span>

                <Link
                  href={content.featured.href}
                  onClick={onClose}
                  className="group block relative aspect-[16/10] w-full overflow-hidden bg-neutral-100 border border-neutral-200/80 mb-4"
                >
                  <Image
                    src={content.featured.imageUrl}
                    alt={content.featured.title}
                    fill
                    sizes="(max-width: 1280px) 30vw, 380px"
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <p className="font-mono text-[10px] uppercase tracking-wider text-neutral-300">
                      Signature Release
                    </p>
                    <p className="text-sm font-medium tracking-tight uppercase">
                      {content.featured.title}
                    </p>
                  </div>
                </Link>

                <p className="text-xs text-neutral-500 font-light leading-relaxed mb-4">
                  {content.featured.subtitle}
                </p>
              </div>

              <Link
                href={content.featured.href}
                onClick={onClose}
                className="group inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-neutral-900 hover:text-neutral-500 font-medium transition-colors"
              >
                <span>{content.featured.ctaText}</span>
                <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
