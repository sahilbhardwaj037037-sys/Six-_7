import Image from "next/image";
import { BRAND_PILLARS } from "@/data/mock-homepage";

export function BrandStorySection() {
  return (
    <section id="story" className="py-24 bg-[#111111] text-[#FBFBFB] scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-end pb-16 border-b border-neutral-800">
          <div className="lg:col-span-7">
            <span className="font-mono text-xs uppercase tracking-widest text-neutral-400">
              The Manifest
            </span>
            <h2 className="text-3xl sm:text-5xl font-light uppercase tracking-tight text-white mt-3 leading-tight">
              Footwear Reduced to Its Purest Architectural Form.
            </h2>
          </div>
          <div className="lg:col-span-5">
            <p className="text-neutral-400 text-sm sm:text-base font-light leading-relaxed">
              Six&7 rejects superfluous branding, decorative overlays, and seasonal obsolescence. We treat the human foot as a load-bearing structure requiring uncompromising ergonomic balance and unadorned materials.
            </p>
          </div>
        </div>

        {/* Narrative & Visual Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pt-16 items-center">
          {/* Craftsmanship Image */}
          <div className="lg:col-span-5 relative aspect-[4/5] bg-neutral-900 overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=1000&q=85"
              alt="Craftsmanship and premium materials detail"
              fill
              sizes="(max-width: 1024px) 100vw, 40vw"
              className="object-cover object-center grayscale contrast-125 hover:grayscale-0 transition-all duration-700"
            />
            <div className="absolute bottom-4 left-4 right-4 bg-black/60 backdrop-blur-md p-4 border border-white/10 text-xs font-mono text-neutral-300">
              Atelier Prototype 07 // Florence, Italy
            </div>
          </div>

          {/* Pillars List */}
          <div className="lg:col-span-7 flex flex-col gap-10">
            {BRAND_PILLARS.map((pillar) => (
              <div
                key={pillar.number}
                className="flex flex-col sm:flex-row gap-4 sm:gap-8 pb-8 border-b border-neutral-800/80 last:border-b-0"
              >
                <span className="font-mono text-xl text-neutral-500 font-light">
                  {pillar.number}
                </span>
                <div>
                  <h3 className="text-lg font-medium tracking-tight uppercase text-white mb-2">
                    {pillar.title}
                  </h3>
                  <p className="text-neutral-400 text-sm font-light leading-relaxed">
                    {pillar.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
