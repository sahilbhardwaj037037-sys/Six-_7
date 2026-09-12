import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Compass, Layers, ShieldCheck, Sparkles } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "About // Six&7 Atelier",
  description:
    "Architectural footwear designed in Copenhagen, hand-finished in Tuscany. Form governed by restraint, balance, and modern ergonomics.",
};

const PHILOSOPHY_PILLARS = [
  {
    icon: Compass,
    title: "Parametric Restraint",
    description:
      "Every curve, bevel, and contour is calculated for structural balance. We strip away superfluous adornment to allow pure geometric silhouettes to emerge.",
  },
  {
    icon: Layers,
    title: "Bio-Composite Engineering",
    description:
      "Outsoles molded with sugarcane-derived EVA foams and recycled rubber matrices provide featherweight cushioning without compromising durability.",
  },
  {
    icon: ShieldCheck,
    title: "Tuscan Artisan Finishing",
    description:
      "Crafted across family-owned workshops outside Florence. Hand-buffed top-grain leathers and hand-lasted uppers built for longevity and resoling.",
  },
  {
    icon: Sparkles,
    title: "Monochrome Language",
    description:
      "Tonal depth achieved through raw textures, nubuck grains, and matte microfibers rather than loud graphics. Understated presence in any setting.",
  },
];

const STUDIO_METRICS = [
  { label: "Design Atelier", value: "Copenhagen", note: "Denmark // Est. 2024" },
  { label: "Production Guild", value: "Tuscany", note: "Italy // Artisanal Handcraft" },
  { label: "Bio-Foam Compound", value: "48%", note: "Sugarcane Bio-Mass Ratio" },
  { label: "Circular Sole Life", value: "100%", note: "Recyclable Outsole Compound" },
];

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#FBFBFB] text-neutral-900">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative w-full bg-[#0C0C0C] text-white py-24 sm:py-32 overflow-hidden border-b border-neutral-900">
          <div className="absolute inset-0 z-0">
            <Image
              src="https://images.unsplash.com/photo-1515347619252-60a4bf4fff4f?q=80&w=2000&auto=format&fit=crop"
              alt="Six&7 Atelier Material Archive"
              fill
              priority
              sizes="100vw"
              className="object-cover object-center opacity-30 mix-blend-luminosity"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0C0C0C] via-[#0C0C0C]/70 to-transparent" />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <div className="flex items-center gap-3 mb-4">
                <span className="inline-block w-8 h-[1px] bg-neutral-400" />
                <span className="font-mono text-xs uppercase tracking-[0.25em] text-neutral-300">
                  Six&7 Atelier // Identity & Form
                </span>
              </div>
              <h1 className="text-4xl sm:text-6xl font-light uppercase tracking-tight leading-[1.08] text-white">
                Architectural Footwear <br />
                <span className="text-neutral-400 italic font-serif">Governed by Restraint</span>
              </h1>
              <p className="text-neutral-400 text-sm sm:text-base font-light mt-6 leading-relaxed max-w-2xl">
                Founded at the intersection of Scandinavian minimalism and traditional Italian cordwaining, Six&7 is an independent footwear atelier exploring sculptural proportion, modular silhouettes, and material longevity.
              </p>
            </div>
          </div>
        </section>

        {/* Brand Manifesto & Studio Narrative */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            <div className="lg:col-span-5">
              <span className="font-mono text-xs uppercase tracking-[0.25em] text-neutral-400 block mb-3">
                01 // Design Manifesto
              </span>
              <h2 className="text-2xl sm:text-3xl font-light uppercase tracking-tight text-neutral-950 leading-snug">
                We believe footwear should behave like modern architecture: structurally honest, quietly assertive.
              </h2>
              <div className="mt-8 space-y-4 text-xs sm:text-sm text-neutral-600 font-light leading-relaxed">
                <p>
                  Contemporary sneaker culture has grown noisy—saturated with disposable trend cycles, exaggerated neon panels, and unnecessary branded plastics. Six&7 was conceived as an intentional retreat from that excess.
                </p>
                <p>
                  Every silhouette begins with a monolithic block. Rather than applying decoration, we subtract until only vital structural planes remain. The result is a footwear collection that transcends seasonal churn, maintaining visual relevance year after year.
                </p>
              </div>
            </div>

            <div className="lg:col-span-7">
              <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full overflow-hidden bg-neutral-100 border border-neutral-200">
                <Image
                  src="https://images.unsplash.com/photo-1552346154-21d32810aba3?q=80&w=1600&auto=format&fit=crop"
                  alt="Minimalist Footwear Silhouette Prototype"
                  fill
                  sizes="(max-width: 1024px) 100vw, 55vw"
                  className="object-cover object-center grayscale hover:grayscale-0 transition-all duration-700"
                />
                <div className="absolute bottom-3 left-3 bg-[#0C0C0C]/80 backdrop-blur-sm px-3 py-1.5 font-mono text-[10px] text-neutral-300 uppercase tracking-widest">
                  Atelier Prototype 00 // Sculpted Outsole Geometry
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Metrics Grid */}
        <section className="bg-neutral-100 border-y border-neutral-200 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {STUDIO_METRICS.map((metric, idx) => (
                <div key={idx} className="border-l border-neutral-300 pl-4 sm:pl-6">
                  <div className="font-mono text-[11px] text-neutral-500 uppercase tracking-wider mb-1">
                    {metric.label}
                  </div>
                  <div className="text-2xl sm:text-3xl font-light text-neutral-900 uppercase">
                    {metric.value}
                  </div>
                  <div className="font-mono text-[10px] text-neutral-400 mt-1">
                    {metric.note}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Four Craft Pillars */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="font-mono text-xs uppercase tracking-[0.25em] text-neutral-400 block mb-2">
              02 // Craftsmanship & Method
            </span>
            <h2 className="text-2xl sm:text-3xl font-light uppercase tracking-tight text-neutral-950">
              The Architecture of Comfort
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500 font-light mt-3">
              How we unite tactile materiality with modern athletic biomechanics.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {PHILOSOPHY_PILLARS.map((pillar, idx) => {
              const Icon = pillar.icon;
              return (
                <div
                  key={idx}
                  className="bg-white border border-neutral-200 p-6 sm:p-8 flex flex-col justify-between"
                >
                  <div>
                    <div className="w-10 h-10 flex items-center justify-center bg-neutral-100 border border-neutral-200 mb-6 text-neutral-900">
                      <Icon className="w-5 h-5 stroke-[1.5]" />
                    </div>
                    <h3 className="font-mono text-xs uppercase tracking-wider text-neutral-950 font-semibold mb-3">
                      {pillar.title}
                    </h3>
                    <p className="text-xs text-neutral-500 font-light leading-relaxed">
                      {pillar.description}
                    </p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-neutral-100 font-mono text-[10px] text-neutral-400 uppercase tracking-widest">
                    Pillar 0{idx + 1}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Visual Editorial Diptych */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 sm:pb-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="relative aspect-[4/5] bg-neutral-100 overflow-hidden border border-neutral-200">
              <Image
                src="https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=1200&auto=format&fit=crop"
                alt="Six&7 Tuscan Lasting Process"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover grayscale hover:grayscale-0 transition-all duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <span className="font-mono text-[10px] tracking-widest uppercase text-neutral-300 block mb-1">
                  Tactile Archive
                </span>
                <h4 className="text-lg font-light uppercase tracking-tight">
                  Hand-Lasted Precision
                </h4>
                <p className="text-xs text-neutral-300 font-light mt-1 max-w-sm">
                  Each upper is wrapped on custom aluminum lasts for 72 hours, ensuring natural anatomical contouring that molds to the foot over time.
                </p>
              </div>
            </div>

            <div className="relative aspect-[4/5] bg-neutral-100 overflow-hidden border border-neutral-200">
              <Image
                src="https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=1200&auto=format&fit=crop"
                alt="Six&7 Cushioning Engineering"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover grayscale hover:grayscale-0 transition-all duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <span className="font-mono text-[10px] tracking-widest uppercase text-neutral-300 block mb-1">
                  Compound Lab
                </span>
                <h4 className="text-lg font-light uppercase tracking-tight">
                  Zero-Fatigue Bio-Foam
                </h4>
                <p className="text-xs text-neutral-300 font-light mt-1 max-w-sm">
                  Engineered dual-density midsole compounds absorb high impact on heel strike while returning spring energy throughout your stride.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-[#0C0C0C] text-white py-16 sm:py-20 border-t border-neutral-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="max-w-xl mx-auto">
              <span className="font-mono text-xs uppercase tracking-[0.25em] text-neutral-400 block mb-3">
                Experience The Silhouettes
              </span>
              <h2 className="text-2xl sm:text-4xl font-light uppercase tracking-tight text-white mb-4">
                Explore The Current Collection
              </h2>
              <p className="text-xs sm:text-sm text-neutral-400 font-light mb-8">
                Discover limited editions, low-profile runners, and high-top architectural silhouettes.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <Link
                  href="/shop"
                  className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-neutral-950 text-xs font-mono uppercase tracking-widest hover:bg-neutral-200 transition-colors"
                >
                  <span>Explore Shop</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <Link
                  href="/size-guide"
                  className="inline-flex items-center gap-2 px-8 py-3.5 bg-transparent border border-neutral-800 text-white text-xs font-mono uppercase tracking-widest hover:border-neutral-500 transition-colors"
                >
                  <span>View Size Guide</span>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
