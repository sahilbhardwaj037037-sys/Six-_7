import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowRight, CheckCircle2, HelpCircle, Ruler, Sparkles } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Footwear Size & Fit Guide // Six&7 Atelier",
  description:
    "Comprehensive size conversion matrices, measurement instructions, and model-specific fit advice for Six&7 footwear.",
};

interface SizeRow {
  eu: string;
  usMen: string;
  usWomen: string;
  uk: string;
  cm: string;
  inches: string;
}

const ADULT_SIZE_CHART: SizeRow[] = [
  { eu: "38", usMen: "5.5", usWomen: "7.0", uk: "5.0", cm: "24.0", inches: "9.4" },
  { eu: "39", usMen: "6.5", usWomen: "8.0", uk: "6.0", cm: "24.7", inches: "9.7" },
  { eu: "40", usMen: "7.0", usWomen: "8.5", uk: "6.5", cm: "25.3", inches: "10.0" },
  { eu: "41", usMen: "8.0", usWomen: "9.5", uk: "7.5", cm: "26.0", inches: "10.2" },
  { eu: "42", usMen: "8.5", usWomen: "10.0", uk: "8.0", cm: "26.7", inches: "10.5" },
  { eu: "43", usMen: "9.5", usWomen: "11.0", uk: "9.0", cm: "27.3", inches: "10.7" },
  { eu: "44", usMen: "10.5", usWomen: "12.0", uk: "10.0", cm: "28.0", inches: "11.0" },
  { eu: "45", usMen: "11.5", usWomen: "13.0", uk: "11.0", cm: "28.7", inches: "11.3" },
  { eu: "46", usMen: "12.0", usWomen: "13.5", uk: "11.5", cm: "29.3", inches: "11.5" },
  { eu: "47", usMen: "13.0", usWomen: "14.5", uk: "12.5", cm: "30.0", inches: "11.8" },
];

const JUNIOR_SIZE_CHART = [
  { eu: "28", us: "10.5C", uk: "10.0K", cm: "17.1", stage: "Little Kids" },
  { eu: "30", us: "12.0C", uk: "11.5K", cm: "18.5", stage: "Little Kids" },
  { eu: "32", us: "1.0Y", uk: "13.5K", cm: "20.0", stage: "Kids" },
  { eu: "34", us: "2.5Y", uk: "2.0", cm: "21.3", stage: "Kids" },
  { eu: "36", us: "4.0Y", uk: "3.5", cm: "22.7", stage: "Teens" },
  { eu: "37", us: "5.0Y", uk: "4.5", cm: "23.3", stage: "Teens" },
];

const FIT_PROFILES = [
  {
    category: "Low-Profile & Minimalist Trainers",
    models: "Phantom Low, Monolith Minimal, Vapour Knit",
    guidance: "True to Size",
    details:
      "Crafted with our ergonomic standard last. If you typically wear EU 42 across designer footwear, select EU 42. Accommodates standard to medium-wide widths comfortably.",
  },
  {
    category: "High-Top Silhouettes & Boots",
    models: "High Arc Sculpt, Apex Chelsea, Matrix Boot",
    guidance: "Size Down 0.5 If In-Between",
    details:
      "Engineered with extra vertical volume and structural leather ankle quarters. If you fall squarely between two half sizes, take the lower size for locked-in heel retention.",
  },
  {
    category: "Athletic, Track & Velocity Series",
    models: "HyperFlow Track, Bio-Stride Pro, Aero Foam Runner",
    guidance: "Size Up 0.5 For Dynamic Movement",
    details:
      "Features snug forefoot lockdown for lateral stability. We recommend adding 0.5 size if you intend to wear performance athletic socks or run high daily mileage.",
  },
];

const MEASURING_STEPS = [
  {
    step: "01",
    title: "Tape Paper to Firm Floor",
    description: "Place a sheet of blank paper against a flat vertical wall on a hard surface (hardwood or tile, not plush carpet).",
  },
  {
    step: "02",
    title: "Heel Against Wall",
    description: "Stand upright with your heel touching the wall, distributing weight evenly while wearing the socks you plan to use.",
  },
  {
    step: "03",
    title: "Mark Longest Toe",
    description: "Use a pen held perpendicular to the floor to mark the outermost tip of your longest toe on the paper.",
  },
  {
    step: "04",
    title: "Measure In Millimeters",
    description: "Measure the exact distance from the edge of the paper to your mark. Match that measurement against the CM column in our chart.",
  },
];

export default function SizeGuidePage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#FBFBFB] text-neutral-900">
      <Navbar />

      <main className="flex-1">
        {/* Editorial Header */}
        <section className="border-b border-neutral-200 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
            <div className="mb-4">
              <Link
                href="/shop"
                className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-widest text-neutral-400 hover:text-neutral-900 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Return to Catalog</span>
              </Link>
            </div>

            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="max-w-2xl">
                <div className="flex items-center gap-2 mb-2">
                  <span className="inline-block w-6 h-[1px] bg-neutral-400" />
                  <span className="font-mono text-xs uppercase tracking-[0.25em] text-neutral-400">
                    Precision Sizing // Atelier Lasts
                  </span>
                </div>
                <h1 className="text-3xl sm:text-5xl font-light uppercase tracking-tight text-neutral-950">
                  Footwear Size & Fit Guide
                </h1>
                <p className="text-neutral-500 text-xs sm:text-sm font-light mt-3 leading-relaxed">
                  Six&7 silhouettes are built on custom Scandinavian lasts engineered for anatomical balance. Review our international conversion table and measuring instructions to identify your ideal fit.
                </p>
              </div>

              <div className="flex items-center gap-4 text-xs font-mono uppercase tracking-wider text-neutral-500">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-neutral-800 stroke-[1.5]" />
                  <span>Free Size Exchanges</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Primary Adult Size Conversion Table */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-6 gap-2">
            <div>
              <span className="font-mono text-xs uppercase tracking-[0.25em] text-neutral-400 block mb-1">
                Conversion Matrix 01
              </span>
              <h2 className="text-xl sm:text-2xl font-light uppercase tracking-tight text-neutral-950">
                Adult Silhouettes (Men & Women)
              </h2>
            </div>
            <span className="font-mono text-[11px] text-neutral-400 uppercase">
              Scroll horizontally on mobile &rarr;
            </span>
          </div>

          <div className="overflow-x-auto border border-neutral-200 bg-white shadow-xs">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-neutral-200 bg-neutral-50 font-mono text-[11px] uppercase tracking-wider text-neutral-600">
                  <th className="py-3.5 px-4 font-semibold text-neutral-900 border-r border-neutral-200">
                    EU (Base Last)
                  </th>
                  <th className="py-3.5 px-4 font-semibold text-neutral-900 border-r border-neutral-200">
                    US Men
                  </th>
                  <th className="py-3.5 px-4 font-semibold text-neutral-900 border-r border-neutral-200">
                    US Women
                  </th>
                  <th className="py-3.5 px-4 font-semibold text-neutral-900 border-r border-neutral-200">
                    UK
                  </th>
                  <th className="py-3.5 px-4 font-semibold text-neutral-900 border-r border-neutral-200">
                    Length (CM)
                  </th>
                  <th className="py-3.5 px-4 font-semibold text-neutral-900">
                    Length (Inches)
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 font-mono text-neutral-700">
                {ADULT_SIZE_CHART.map((row, idx) => (
                  <tr
                    key={idx}
                    className="hover:bg-neutral-50/80 transition-colors"
                  >
                    <td className="py-3 px-4 font-bold text-neutral-950 border-r border-neutral-100">
                      {row.eu}
                    </td>
                    <td className="py-3 px-4 border-r border-neutral-100">{row.usMen}</td>
                    <td className="py-3 px-4 border-r border-neutral-100">{row.usWomen}</td>
                    <td className="py-3 px-4 border-r border-neutral-100">{row.uk}</td>
                    <td className="py-3 px-4 border-r border-neutral-100 text-neutral-900 font-medium">
                      {row.cm} cm
                    </td>
                    <td className="py-3 px-4 text-neutral-500">{row.inches}&quot;</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Junior & Kids Size Table */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 sm:pb-16">
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-6 gap-2">
            <div>
              <span className="font-mono text-xs uppercase tracking-[0.25em] text-neutral-400 block mb-1">
                Conversion Matrix 02
              </span>
              <h2 className="text-xl sm:text-2xl font-light uppercase tracking-tight text-neutral-950">
                Junior & Youth Silhouettes
              </h2>
            </div>
            <span className="font-mono text-[11px] text-neutral-400 uppercase">
              Junior Footwear Sizing
            </span>
          </div>

          <div className="overflow-x-auto border border-neutral-200 bg-white shadow-xs">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-neutral-200 bg-neutral-50 font-mono text-[11px] uppercase tracking-wider text-neutral-600">
                  <th className="py-3.5 px-4 font-semibold text-neutral-900 border-r border-neutral-200">
                    EU
                  </th>
                  <th className="py-3.5 px-4 font-semibold text-neutral-900 border-r border-neutral-200">
                    US Kids / Youth
                  </th>
                  <th className="py-3.5 px-4 font-semibold text-neutral-900 border-r border-neutral-200">
                    UK Kids
                  </th>
                  <th className="py-3.5 px-4 font-semibold text-neutral-900 border-r border-neutral-200">
                    Foot Length
                  </th>
                  <th className="py-3.5 px-4 font-semibold text-neutral-900">
                    Category Stage
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 font-mono text-neutral-700">
                {JUNIOR_SIZE_CHART.map((row, idx) => (
                  <tr key={idx} className="hover:bg-neutral-50/80 transition-colors">
                    <td className="py-3 px-4 font-bold text-neutral-950 border-r border-neutral-100">
                      {row.eu}
                    </td>
                    <td className="py-3 px-4 border-r border-neutral-100">{row.us}</td>
                    <td className="py-3 px-4 border-r border-neutral-100">{row.uk}</td>
                    <td className="py-3 px-4 border-r border-neutral-100 font-medium text-neutral-900">
                      {row.cm} cm
                    </td>
                    <td className="py-3 px-4 text-neutral-600 uppercase text-[11px]">
                      {row.stage}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Step-by-Step Measuring Guide */}
        <section className="bg-neutral-100 border-y border-neutral-200 py-16 sm:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mb-12">
              <span className="font-mono text-xs uppercase tracking-[0.25em] text-neutral-400 block mb-2">
                Measurement Methodology
              </span>
              <h2 className="text-2xl sm:text-3xl font-light uppercase tracking-tight text-neutral-950">
                How to Measure Your Foot Length
              </h2>
              <p className="text-xs sm:text-sm text-neutral-600 font-light mt-2">
                We recommend taking measurements in the afternoon or evening, as feet naturally expand slightly throughout the day.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {MEASURING_STEPS.map((step, idx) => (
                <div
                  key={idx}
                  className="bg-white border border-neutral-200 p-6 flex flex-col justify-between"
                >
                  <div>
                    <div className="font-mono text-xl font-light text-neutral-400 mb-4">
                      {step.step}
                    </div>
                    <h3 className="font-mono text-xs uppercase tracking-wider text-neutral-950 font-semibold mb-2">
                      {step.title}
                    </h3>
                    <p className="text-xs text-neutral-500 font-light leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                  <div className="mt-6 pt-3 border-t border-neutral-100 flex items-center gap-1 font-mono text-[10px] text-neutral-400 uppercase">
                    <Ruler className="w-3 h-3" />
                    <span>Precise Alignment</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Silhouette Specific Fit Advisory */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="max-w-2xl mb-12">
            <span className="font-mono text-xs uppercase tracking-[0.25em] text-neutral-400 block mb-2">
              Last Profile Advisory
            </span>
            <h2 className="text-2xl sm:text-3xl font-light uppercase tracking-tight text-neutral-950">
              Silhouette-Specific Fit Notes
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500 font-light mt-2">
              Different upper materials and structural constructions influence interior volume. Use these guidelines when picking your pair.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {FIT_PROFILES.map((profile, idx) => (
              <div
                key={idx}
                className="bg-white border border-neutral-200 p-6 sm:p-8 flex flex-col justify-between"
              >
                <div>
                  <div className="inline-block px-2.5 py-1 bg-neutral-100 border border-neutral-200 font-mono text-[10px] uppercase tracking-wider text-neutral-800 mb-4">
                    {profile.guidance}
                  </div>
                  <h3 className="text-base font-normal uppercase tracking-tight text-neutral-950 mb-1">
                    {profile.category}
                  </h3>
                  <div className="font-mono text-[11px] text-neutral-400 uppercase mb-4">
                    {profile.models}
                  </div>
                  <p className="text-xs text-neutral-600 font-light leading-relaxed">
                    {profile.details}
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-neutral-100 font-mono text-[10px] text-neutral-400 uppercase tracking-wider">
                  Verified Last Fit
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Concierge & Exchange Assistance Box */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 sm:pb-24">
          <div className="bg-[#0C0C0C] text-white p-8 sm:p-12 border border-neutral-900 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            <div className="max-w-xl">
              <div className="flex items-center gap-2 mb-3">
                <HelpCircle className="w-4 h-4 text-neutral-400 stroke-[1.5]" />
                <span className="font-mono text-xs uppercase tracking-[0.25em] text-neutral-400">
                  Still Uncertain of Your Size?
                </span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-light uppercase tracking-tight text-white mb-2">
                Atelier Size Concierge
              </h3>
              <p className="text-neutral-400 text-xs sm:text-sm font-light leading-relaxed">
                Provide us with your current footwear brands and measurements. Our product team will recommend the exact Six&7 last for your foot profile. All orders include complimentary size exchanges within 30 days.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
              <Link
                href="/contact"
                className="px-6 py-3.5 bg-white text-neutral-950 text-xs font-mono uppercase tracking-widest text-center hover:bg-neutral-200 transition-colors"
              >
                Inquire With Concierge
              </Link>
              <Link
                href="/shop"
                className="px-6 py-3.5 border border-neutral-800 text-white text-xs font-mono uppercase tracking-widest text-center hover:border-neutral-500 transition-colors inline-flex items-center justify-center gap-2"
              >
                <span>Browse Footwear</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
