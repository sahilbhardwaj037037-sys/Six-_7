"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Truck,
  RotateCcw,
  Clock,
  ShieldCheck,
  PackageCheck,
  Globe2,
  ChevronDown,
  ArrowRight,
  HelpCircle,
  Mail,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

interface PolicySection {
  id: string;
  title: string;
  description: string;
  points: string[];
}

const SHIPPING_TIERS = [
  {
    tier: "Complimentary Express",
    coverage: "Global Orders Over $300",
    window: "2–4 Business Days",
    carrier: "DHL Express / Carbon Neutral",
    cost: "Complimentary",
  },
  {
    tier: "Standard Atelier Dispatch",
    coverage: "Domestic & Regional EU",
    window: "3–5 Business Days",
    carrier: "Tracked Ground Logistics",
    cost: "$15 (Flat Rate)",
  },
  {
    tier: "Priority International",
    coverage: "Orders Under $300",
    window: "2–4 Business Days",
    carrier: "DHL Express DDP (Duty Paid)",
    cost: "$25 (Flat Rate)",
  },
];

const RETURN_CONDITIONS = [
  {
    title: "Pristine, Unworn Condition",
    description:
      "Footwear must be tested solely on clean, carpeted surfaces. Soles showing street abrasion or crease degradation cannot be accepted.",
  },
  {
    title: "Original Packaging Intact",
    description:
      "All original packaging—including our structural dust bag, custom shoe horn, and protective outer box—must be returned without damage.",
  },
  {
    title: "30-Day Evaluation Window",
    description:
      "Return or exchange requests must be initiated within 30 days from the documented parcel delivery date.",
  },
  {
    title: "Digital Proof of Purchase",
    description:
      "Please retain your order confirmation email with your unique SX7-order identifier for return authorization.",
  },
];

const ACCORDION_FAQS: PolicySection[] = [
  {
    id: "step-by-step",
    title: "How to Initiate a Return or Exchange",
    description:
      "We provide a prepaid shipping label and step-by-step dispatch documentation for all authorized returns.",
    points: [
      "Access your order via our Client Concierge or visit our Contact page with your SX7 order identifier.",
      "Select your return or exchange preference and receive a prepaid digital return dispatch label.",
      "Repack the unworn silhouette in its original protective inner and outer packaging.",
      "Drop off the sealed parcel at any authorized courier collection depot or arrange complimentary home pickup.",
      "Upon reception and atelier inspection (typically 2–3 business days), refunds are credited to the original payment method.",
    ],
  },
  {
    id: "customs-duties",
    title: "International Duties, Tariffs & Taxes",
    description:
      "Six&7 delivers on a Delivered Duty Paid (DDP) protocol to eliminate surprise charges.",
    points: [
      "All import duties, regional tariffs, and local VAT are calculated and settled prior to release.",
      "International recipients will never be billed unexpected clearance or brokerage handling fees.",
      "Should an international order be returned, product amounts are refunded in full, excluding initial outbound carrier fees if applicable.",
    ],
  },
  {
    id: "exchanges",
    title: "Silhouettes Size & Variant Exchanges",
    description:
      "If the fit is imperfect, size exchanges are processed with zero additional handling charges.",
    points: [
      "Complimentary size exchanges are supported on all standard, non-archive releases.",
      "We immediately reserve your requested replacement size upon receipt of the initial courier drop-off scan.",
      "For guidance on choosing the accurate replacement size, consult our dedicated Sizing & Fit Guide.",
    ],
  },
  {
    id: "damaged-defective",
    title: "Damaged or Defective Items",
    description:
      "Every pair undergoes a rigorous multi-point inspection before leaving our atelier.",
    points: [
      "In the rare event of transit damage or structural defect, report the issue within 48 hours of receipt.",
      "Attach clear photographs showing the discrepancy along with your package reference number.",
      "We provide immediate priority dispatch of a replacement pair or a 100% full refund.",
    ],
  },
];

export default function ShippingAndReturnsPage() {
  const [openAccordion, setOpenAccordion] = useState<string | null>("step-by-step");

  const toggleAccordion = (id: string) => {
    setOpenAccordion((prev) => (prev === id ? null : id));
  };

  return (
    <div className="min-h-screen bg-[#FCFCFC] text-neutral-900 flex flex-col font-sans selection:bg-neutral-900 selection:text-white">
      <Navbar />

      <main className="flex-1">
        {/* Editorial Hero Header */}
        <section className="relative border-b border-neutral-200/80 bg-gradient-to-b from-neutral-100/60 to-[#FCFCFC] pt-20 pb-16 lg:pt-28 lg:pb-20">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="flex items-center gap-2 text-xs font-mono tracking-widest text-neutral-400 uppercase mb-4">
              <Link href="/" className="hover:text-neutral-900 transition-colors">
                Index
              </Link>
              <span>/</span>
              <span className="text-neutral-900">Shipping & Returns</span>
            </div>

            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-neutral-900 text-[#FCFCFC] text-[10px] font-mono uppercase tracking-[0.2em] mb-6">
                Client Service Protocol // 2026
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-light tracking-tight text-neutral-950 mb-6 leading-[1.1]">
                Global Delivery <br />
                <span className="font-serif italic font-normal text-neutral-600">
                  & Complimentary Returns
                </span>
              </h1>

              <p className="text-base sm:text-lg text-neutral-600 font-light leading-relaxed max-w-2xl">
                Every Six&7 silhouette is packed in reinforced archival casing and
                dispatched via carbon-neutral express transit. Explore our dispatch
                timelines, duty protocols, and simple return procedures below.
              </p>
            </div>
          </div>
        </section>

        {/* Quick Summary Badges */}
        <section className="border-b border-neutral-200/80 py-8 bg-[#FCFCFC]">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="flex items-start gap-4 p-4 rounded-none border border-neutral-200/70 bg-white">
                <Truck className="w-5 h-5 text-neutral-900 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-mono uppercase tracking-wider text-neutral-900 mb-1">
                    Express Dispatch
                  </h4>
                  <p className="text-xs text-neutral-500 font-light leading-relaxed">
                    2–4 business days delivery on global express consignments.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-none border border-neutral-200/70 bg-white">
                <RotateCcw className="w-5 h-5 text-neutral-900 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-mono uppercase tracking-wider text-neutral-900 mb-1">
                    30-Day Window
                  </h4>
                  <p className="text-xs text-neutral-500 font-light leading-relaxed">
                    Complimentary returns and size exchanges within 30 days.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-none border border-neutral-200/70 bg-white">
                <Globe2 className="w-5 h-5 text-neutral-900 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-mono uppercase tracking-wider text-neutral-900 mb-1">
                    Duties Included
                  </h4>
                  <p className="text-xs text-neutral-500 font-light leading-relaxed">
                    DDP delivery with all import duties and local taxes covered.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-none border border-neutral-200/70 bg-white">
                <ShieldCheck className="w-5 h-5 text-neutral-900 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-mono uppercase tracking-wider text-neutral-900 mb-1">
                    Atelier Checked
                  </h4>
                  <p className="text-xs text-neutral-500 font-light leading-relaxed">
                    Hand-inspected before sealing in protective dust boxes.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 1: Shipping & Delivery Tiers */}
        <section className="py-16 lg:py-20 max-w-7xl mx-auto px-6 lg:px-8 border-b border-neutral-200/80">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-4">
              <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-neutral-400 font-medium">
                01 // Logistics
              </span>
              <h2 className="text-2xl sm:text-3xl font-light text-neutral-950 mt-2 mb-4">
                Shipping Methods & Dispatch
              </h2>
              <p className="text-sm text-neutral-600 font-light leading-relaxed mb-6">
                Orders received before 14:00 CET are prepared and handed to our
                express logistics partners on the same business day.
              </p>
              <div className="p-4 border border-neutral-200 bg-neutral-50/50 text-xs text-neutral-500 space-y-2">
                <div className="flex items-center gap-2 font-mono text-neutral-900 uppercase">
                  <Clock className="w-3.5 h-3.5 text-neutral-700" />
                  <span>Processing Hours</span>
                </div>
                <p className="font-light leading-relaxed">
                  Monday – Friday: 08:00 – 18:00 CET. Orders submitted over the
                  weekend enter fulfillment queue on the following Monday morning.
                </p>
              </div>
            </div>

            <div className="lg:col-span-8">
              <div className="overflow-x-auto border border-neutral-200 bg-white shadow-sm">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-neutral-200 bg-neutral-50/80 text-[11px] font-mono text-neutral-500 uppercase tracking-wider">
                      <th className="py-3.5 px-4 font-semibold">Delivery Tier</th>
                      <th className="py-3.5 px-4 font-semibold">Eligibility</th>
                      <th className="py-3.5 px-4 font-semibold">Estimated Transit</th>
                      <th className="py-3.5 px-4 font-semibold text-right">Fee</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200/80">
                    {SHIPPING_TIERS.map((tier, idx) => (
                      <tr key={idx} className="hover:bg-neutral-50/40 transition-colors">
                        <td className="py-4 px-4">
                          <div className="font-medium text-neutral-900 text-sm">
                            {tier.tier}
                          </div>
                          <div className="text-[11px] text-neutral-400 font-mono mt-0.5">
                            {tier.carrier}
                          </div>
                        </td>
                        <td className="py-4 px-4 text-neutral-600 font-light">
                          {tier.coverage}
                        </td>
                        <td className="py-4 px-4 text-neutral-700 font-mono">
                          {tier.window}
                        </td>
                        <td className="py-4 px-4 text-right font-mono font-medium text-neutral-900">
                          {tier.cost}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-4 flex items-center gap-3 text-xs text-neutral-500 font-light">
                <PackageCheck className="w-4 h-4 text-neutral-700 shrink-0" />
                <span>
                  All deliveries require a digital signature upon arrival to guarantee safe receipt.
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Returns & Condition Requirements */}
        <section className="py-16 lg:py-20 max-w-7xl mx-auto px-6 lg:px-8 border-b border-neutral-200/80">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-4">
              <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-neutral-400 font-medium">
                02 // Verification
              </span>
              <h2 className="text-2xl sm:text-3xl font-light text-neutral-950 mt-2 mb-4">
                Eligibility & Return Standard
              </h2>
              <p className="text-sm text-neutral-600 font-light leading-relaxed mb-6">
                To preserve the architectural integrity of our footwear for all
                patrons, items must strictly comply with our return criteria.
              </p>
              <Link
                href="/size-guide"
                className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-neutral-900 border-b border-neutral-900 pb-0.5 hover:text-neutral-600 hover:border-neutral-400 transition-colors"
              >
                Review Size & Fit Guide
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
              {RETURN_CONDITIONS.map((cond, idx) => (
                <div
                  key={idx}
                  className="p-6 border border-neutral-200 bg-white flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400">
                        Condition 0{idx + 1}
                      </span>
                      <ShieldCheck className="w-4 h-4 text-neutral-400" />
                    </div>
                    <h3 className="text-base font-medium text-neutral-900 mb-2">
                      {cond.title}
                    </h3>
                    <p className="text-xs text-neutral-600 font-light leading-relaxed">
                      {cond.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Section 3: Process & Detailed Accordion */}
        <section className="py-16 lg:py-20 max-w-7xl mx-auto px-6 lg:px-8 border-b border-neutral-200/80">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-4">
              <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-neutral-400 font-medium">
                03 // Protocols
              </span>
              <h2 className="text-2xl sm:text-3xl font-light text-neutral-950 mt-2 mb-4">
                Step-by-Step Guidance
              </h2>
              <p className="text-sm text-neutral-600 font-light leading-relaxed">
                Detailed breakdowns on how returns are processed, replacement
                allocations, and tariff compliance.
              </p>
            </div>

            <div className="lg:col-span-8 space-y-4">
              {ACCORDION_FAQS.map((sec) => {
                const isOpen = openAccordion === sec.id;
                return (
                  <div
                    key={sec.id}
                    className="border border-neutral-200 bg-white transition-colors"
                  >
                    <button
                      type="button"
                      onClick={() => toggleAccordion(sec.id)}
                      className="w-full flex items-center justify-between p-5 text-left hover:bg-neutral-50/50 transition-colors"
                      aria-expanded={isOpen}
                    >
                      <div>
                        <h3 className="text-base font-medium text-neutral-900">
                          {sec.title}
                        </h3>
                        <p className="text-xs text-neutral-500 font-light mt-1">
                          {sec.description}
                        </p>
                      </div>
                      <ChevronDown
                        className={`w-4 h-4 text-neutral-500 transition-transform duration-200 ml-4 shrink-0 ${
                          isOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.2 }}
                          className="border-t border-neutral-100 px-5 py-4 bg-neutral-50/30"
                        >
                          <ul className="space-y-2.5">
                            {sec.points.map((pt, pIdx) => (
                              <li
                                key={pIdx}
                                className="flex items-start gap-2.5 text-xs text-neutral-600 font-light leading-relaxed"
                              >
                                <span className="w-1.5 h-1.5 rounded-full bg-neutral-400 mt-1.5 shrink-0" />
                                <span>{pt}</span>
                              </li>
                            ))}
                          </ul>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Section 4: Concierge Support CTA */}
        <section className="py-20 bg-neutral-900 text-white">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-8">
                <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-neutral-400 font-semibold mb-2 block">
                  Support & Concierge Assistance
                </span>
                <h2 className="text-3xl sm:text-4xl font-light tracking-tight text-white mb-4">
                  Require specialized assistance with your parcel?
                </h2>
                <p className="text-sm sm:text-base text-neutral-300 font-light leading-relaxed max-w-2xl">
                  Our atelier client team is on hand Monday through Friday to track
                  shipments, arrange complimentary return pickups, or coordinate size exchanges.
                </p>
              </div>

              <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3">
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white text-neutral-900 text-xs font-mono uppercase tracking-widest hover:bg-neutral-200 transition-colors text-center"
                >
                  <Mail className="w-4 h-4" />
                  Contact Concierge
                </Link>
                <Link
                  href="/faq"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 border border-neutral-700 text-neutral-300 text-xs font-mono uppercase tracking-widest hover:bg-neutral-800 hover:text-white transition-colors text-center"
                >
                  <HelpCircle className="w-4 h-4" />
                  Explore FAQ Archive
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
