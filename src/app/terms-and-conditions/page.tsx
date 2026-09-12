"use client";

import Link from "next/link";
import {
  Scale,
  ShoppingBag,
  CreditCard,
  Truck,
  Copyright,
  ShieldAlert,
  FileCheck,
  Mail,
  ArrowRight,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

const TERMS_SECTIONS = [
  {
    id: "preamble",
    number: "01",
    title: "Acceptance of Terms & Site Purpose",
    icon: Scale,
    summary:
      "Conditions governing access to and usage of the Six&7 Atelier digital showcase and ordering interface.",
    clauses: [
      "By accessing, browsing, or placing orders through this platform, you agree to be bound by these Terms and Conditions along with our Privacy Policy.",
      "Six&7 Atelier operates as a demonstration e-commerce concept and portfolio showcase of architectural footwear design.",
      "If you do not agree with any provision of these terms, please refrain from using or placing orders through this digital platform.",
    ],
  },
  {
    id: "products-orders",
    number: "02",
    title: "Products, Sizing & Orders",
    icon: ShoppingBag,
    summary:
      "Guidelines regarding silhouette depictions, sizing recommendations, and order validation.",
    clauses: [
      "Product Descriptions: We strive to display silhouettes, leather textures, and tones as accurately as possible. Subtle visual variations may arise due to monitor profiles and the natural grain of handcrafted Italian leathers.",
      "Order Confirmation: Transmission of an order confirmation email acknowledges receipt of your request but does not constitute formal acceptance. We reserve the right to decline or cancel orders in cases of pricing inaccuracies or inventory discrepancies.",
      "Sizing Consultations: Our sizing recommendations and fit guides serve as informative benchmarks. Patrons are encouraged to consult our Sizing & Fit Guide prior to finalized checkouts.",
    ],
  },
  {
    id: "pricing-payment",
    number: "03",
    title: "Pricing, Currencies & Payment",
    icon: CreditCard,
    summary:
      "Standards governing price displays, international currency conversions, and payment settlements.",
    clauses: [
      "All prices are quoted in USD ($) unless explicitly toggled to an alternate supported currency.",
      "We reserve the right to correct pricing errors or revise silhouette pricing without prior notice; however, confirmed orders are honored at the documented transaction price.",
      "Payment must be validated and authorized prior to order fulfillment. Supported checkout methods include major credit cards and tokenized digital payment options.",
    ],
  },
  {
    id: "fulfillment-returns",
    number: "04",
    title: "Shipping, Returns & Title Transfer",
    icon: Truck,
    summary:
      "Cross-reference to dispatch timelines, carrier logistics, and condition-based return protocols.",
    clauses: [
      "All orders are handled under our documented delivery protocols. For comprehensive shipping tiers, customs fees, and transit windows, refer to our Shipping & Returns page.",
      "Risk of loss and title for ordered items pass to you upon successful delivery scan by our authorized courier partners.",
      "Returns and exchanges are accepted strictly within 30 days of delivery, provided products remain unworn, uncreased, and sealed in original atelier packaging.",
    ],
  },
  {
    id: "intellectual-property",
    number: "05",
    title: "Intellectual Property & Design Rights",
    icon: Copyright,
    summary:
      "Ownership of visual marks, footwear silhouettes, 3D assets, and atelier editorial media.",
    clauses: [
      "All visual branding, typography, photography, 3D renderings, silhouette patterns, and layout architectures are the proprietary property of Six&7 Atelier.",
      "You may not reproduce, duplicate, modify, distribute, or exploit any digital assets or editorial content without express written consent.",
      "Six&7 logos, brand marks, and product designations are proprietary trademarks and may not be utilized in connection with any third-party commercial offering.",
    ],
  },
  {
    id: "acceptable-use",
    number: "06",
    title: "Acceptable Use & Conduct",
    icon: ShieldAlert,
    summary:
      "Rules of conduct when interfacing with the platform, account portals, and concierge channels.",
    clauses: [
      "You agree not to deploy automated crawlers, scrapers, or bot frameworks designed to extract data, distort inventory reserves, or place automated batch orders.",
      "You shall not attempt to breach security defenses, probe vulnerabilities, or interfere with normal network traffic.",
      "Accounts found engaging in abusive activity, fraudulent chargebacks, or repeated policy violations will be suspended or permanently revoked.",
    ],
  },
  {
    id: "limitations",
    number: "07",
    title: "Limitation of Liability & Revisions",
    icon: FileCheck,
    summary:
      "General provisions, liability boundaries, and term revision policies.",
    clauses: [
      "To the extent permitted by applicable law, Six&7 Atelier shall not be held liable for indirect, incidental, or consequential damages resulting from platform downtime or third-party courier delays.",
      "We reserve the right to revise or update these Terms and Conditions periodically. Updated terms become effective immediately upon digital publication.",
      "Continued use of the platform after any such revisions signifies your agreement to the modified terms.",
    ],
  },
];

export default function TermsAndConditionsPage() {
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
              <span className="text-neutral-900">Terms & Conditions</span>
            </div>

            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-neutral-900 text-[#FCFCFC] text-[10px] font-mono uppercase tracking-[0.2em] mb-6">
                Legal Framework // Edition 2026
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-light tracking-tight text-neutral-950 mb-6 leading-[1.1]">
                Terms & Conditions <br />
                <span className="font-serif italic font-normal text-neutral-600">
                  & Commercial Protocols
                </span>
              </h1>

              <p className="text-base sm:text-lg text-neutral-600 font-light leading-relaxed max-w-2xl">
                Review the terms, covenants, and operating standards that govern your
                experience across the Six&7 Atelier online boutique, order fulfillment,
                and digital services.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-6 text-xs font-mono text-neutral-500 uppercase tracking-wider">
                <span>Effective Date: January 1, 2026</span>
                <span>•</span>
                <span>Last Updated: Autumn 2026</span>
                <span>•</span>
                <span className="text-neutral-900 font-medium">Demo Concept Edition</span>
              </div>
            </div>
          </div>
        </section>

        {/* Structured Clauses */}
        <section className="py-16 lg:py-24 max-w-7xl mx-auto px-6 lg:px-8">
          <div className="space-y-16 lg:space-y-20">
            {TERMS_SECTIONS.map((section) => {
              const Icon = section.icon;
              return (
                <div
                  key={section.id}
                  id={section.id}
                  className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 pt-12 first:pt-0 border-t first:border-t-0 border-neutral-200/80"
                >
                  <div className="lg:col-span-4">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-xs font-mono text-neutral-400 uppercase tracking-widest font-semibold">
                        {section.number} // SECTION
                      </span>
                      <Icon className="w-4 h-4 text-neutral-700" />
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-light text-neutral-950 mb-4">
                      {section.title}
                    </h2>
                    <p className="text-xs sm:text-sm text-neutral-500 font-light leading-relaxed">
                      {section.summary}
                    </p>
                  </div>

                  <div className="lg:col-span-8">
                    <div className="bg-white border border-neutral-200 p-6 sm:p-8 space-y-4">
                      {section.clauses.map((clause, idx) => (
                        <div
                          key={idx}
                          className="flex items-start gap-3.5 text-xs sm:text-sm text-neutral-600 font-light leading-relaxed"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-neutral-900 mt-2 shrink-0" />
                          <span>{clause}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Quick Links & Contact CTA */}
        <section className="py-16 border-t border-neutral-200/80 bg-neutral-100/50">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="max-w-2xl">
              <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-neutral-400 font-semibold mb-2 block">
                08 // Studio Inquiries
              </span>
              <h3 className="text-2xl font-light text-neutral-950 mb-3">
                Questions regarding our commercial terms?
              </h3>
              <p className="text-xs sm:text-sm text-neutral-600 font-light leading-relaxed mb-6">
                Our client concierge is available to clarify any questions regarding our
                terms of service, order policies, or intellectual property rights.
              </p>
              <div className="flex flex-wrap items-center gap-4">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 px-5 py-3 bg-neutral-900 text-white text-xs font-mono uppercase tracking-widest hover:bg-neutral-800 transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  Contact Concierge
                </Link>
                <Link
                  href="/shipping-and-returns"
                  className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-neutral-900 border-b border-neutral-900 pb-0.5 hover:text-neutral-600 hover:border-neutral-400 transition-colors"
                >
                  Review Shipping & Returns
                  <ArrowRight className="w-3.5 h-3.5" />
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
