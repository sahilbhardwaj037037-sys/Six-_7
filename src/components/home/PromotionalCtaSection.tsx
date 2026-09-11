import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export function PromotionalCtaSection() {
  return (
    <section id="offers" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
      <div className="relative bg-[#171717] text-white p-8 sm:p-14 lg:p-20 overflow-hidden">
        {/* Subtle grid accent background */}
        <div className="absolute inset-0 opacity-5 pointer-events-none bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:24px_24px]" />

        <div className="relative z-10 max-w-2xl">
          <span className="font-mono text-xs uppercase tracking-[0.25em] text-neutral-400">
            Private Access // Seasonal Drop
          </span>

          <h2 className="text-3xl sm:text-5xl font-light uppercase tracking-tight text-white mt-4 leading-tight">
            Reserve The 2026 Atelier Capsule
          </h2>

          <p className="text-neutral-400 text-sm sm:text-base font-light mt-4 leading-relaxed">
            Members receive prioritized allocations on limited 250-pair batch releases and private invitation-only studio viewings.
          </p>

          {/* Form & CTA Row */}
          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              placeholder="Enter email for private allocation..."
              className="px-4 py-3.5 bg-neutral-900 border border-neutral-700 text-sm font-sans text-white placeholder:text-neutral-500 focus:outline-none focus:border-white transition-colors flex-1"
            />
            <button
              type="button"
              className="px-8 py-3.5 bg-white text-neutral-950 text-xs font-mono uppercase tracking-widest font-semibold hover:bg-neutral-200 transition-colors shrink-0"
            >
              Request Access
            </button>
          </div>

          <div className="mt-8 pt-6 border-t border-neutral-800 flex items-center gap-6">
            <Link
              href="/shop"
              className="group inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-neutral-300 hover:text-white transition-colors"
            >
              <span>Explore In-Stock Silhouettes</span>
              <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
