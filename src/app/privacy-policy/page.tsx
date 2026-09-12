"use client";

import Link from "next/link";
import {
  ShieldCheck,
  Lock,
  Eye,
  FileText,
  Cookie,
  UserCheck,
  RefreshCw,
  Mail,
  ArrowRight,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

const POLICY_SECTIONS = [
  {
    id: "overview",
    number: "01",
    title: "Overview & Purpose",
    icon: ShieldCheck,
    summary:
      "This Privacy Policy outlines how Six&7 Atelier handles and respects personal data when you explore our digital flagship, create an account, or order footwear silhouettes.",
    details: [
      "Six&7 Atelier operates as a demonstration e-commerce concept and portfolio showcase for architectural footwear design.",
      "We believe privacy is an intrinsic design discipline: we collect only data essential to providing a seamless browsing, sizing, and fulfillment experience.",
      "By interacting with our platform, you acknowledge the collection and processing practices described in this document.",
    ],
  },
  {
    id: "data-collection",
    number: "02",
    title: "Information Collected",
    icon: Eye,
    summary:
      "We categorize personal data into information you actively supply and contextual technical telemetry.",
    details: [
      "Contact and Account Details: Full name, delivery address, billing location, email address, and telephone number provided during checkout or account registration.",
      "Order & Purchase Records: Silhouettes selected, sizing preferences, purchase history, and return/exchange documentation.",
      "Transactional Data: Payment method tokens and fulfillment status. Sensitive payment card numbers are encrypted directly by third-party PCI-DSS certified processors and never stored on our servers.",
      "Device & Usage Telemetry: Browser specifications, IP address, approximate geographical region, session duration, and page interactions captured for platform performance.",
    ],
  },
  {
    id: "data-usage",
    number: "03",
    title: "How Information is Used",
    icon: FileText,
    summary:
      "Your information is utilized strictly to fulfill orders, maintain site integrity, and refine our digital atelier.",
    details: [
      "Order Fulfillment: Preparing, packaging, and dispatching your orders with real-time tracking updates.",
      "Client Concierge: Addressing sizing inquiries, return requests, and product care communications.",
      "Platform Optimization: Analyzing user flows to identify performance bottlenecks and improve responsive rendering.",
      "Security & Fraud Prevention: Detecting automated scraping, suspicious transactional patterns, and unauthorized account access.",
    ],
  },
  {
    id: "cookies",
    number: "04",
    title: "Cookies & Local Storage",
    icon: Cookie,
    summary:
      "We deploy lightweight session identifiers and cookies strictly necessary to support cart state and user preferences.",
    details: [
      "Essential Cookies: Preserve your shopping bag contents, currency selection, and session authentication state across page navigations.",
      "Preference Storage: Remember your chosen filter states, sizing preferences, and display settings.",
      "Analytics: Aggregate metrics on navigation pathways without persisting identifiable personal profiles.",
      "You may adjust or disable cookie storage via your browser settings; however, disabling essential cookies may impact bag and checkout continuity.",
    ],
  },
  {
    id: "data-sharing",
    number: "05",
    title: "Data Sharing & Third Parties",
    icon: UserCheck,
    summary:
      "We never sell, rent, or monetize personal customer records to advertising brokers.",
    details: [
      "Logistics Partners: Trusted courier carriers (e.g., DHL Express) receive solely the recipient name, delivery coordinates, and phone number necessary for customs clearance and physical delivery.",
      "Payment Infrastructure: Tokenized payment transmissions routed securely through PCI-DSS Level 1 compliant financial gateways.",
      "Cloud & Hosting Infrastructure: Secure servers and content distribution networks hosting our web application assets.",
      "Legal Compliance: Disclosures made only where strictly required by applicable legal mandates or binding court orders.",
    ],
  },
  {
    id: "security",
    number: "06",
    title: "Data Security & Retention",
    icon: Lock,
    summary:
      "We apply modern technical defenses and encryption protocols across all communication channels.",
    details: [
      "All digital transactions and administrative requests are transmitted over Transport Layer Security (TLS/HTTPS).",
      "Access to customer records is restricted to authorized atelier personnel bound by confidentiality agreements.",
      "Data is retained only as long as reasonably required to service active accounts, fulfill tax compliance obligations, or resolve dispute proceedings.",
    ],
  },
  {
    id: "user-rights",
    number: "07",
    title: "Patron Rights & Choices",
    icon: RefreshCw,
    summary:
      "You maintain full governance over your personal information and account credentials.",
    details: [
      "Access & Portability: Request an export of your stored personal details and purchase records at any time.",
      "Correction: Modify your name, shipping addresses, and contact preferences through the Account portal.",
      "Deletion: Request complete expungement of your account and customer record, subject to regulatory tax archiving.",
      "Communication Opt-Out: Unsubscribe from atelier release announcements via the link in any digital communiqué.",
    ],
  },
];

export default function PrivacyPolicyPage() {
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
              <span className="text-neutral-900">Privacy Policy</span>
            </div>

            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-neutral-900 text-[#FCFCFC] text-[10px] font-mono uppercase tracking-[0.2em] mb-6">
                Data Governance // Edition 2026
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-light tracking-tight text-neutral-950 mb-6 leading-[1.1]">
                Privacy Policy <br />
                <span className="font-serif italic font-normal text-neutral-600">
                  & Digital Transparency
                </span>
              </h1>

              <p className="text-base sm:text-lg text-neutral-600 font-light leading-relaxed max-w-2xl">
                Six&7 Atelier is committed to protecting your personal data with the same
                meticulous precision that guides our footwear design. Review how your
                information is collected, protected, and honored across our platform.
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

        {/* Structured Sections */}
        <section className="py-16 lg:py-24 max-w-7xl mx-auto px-6 lg:px-8">
          <div className="space-y-16 lg:space-y-20">
            {POLICY_SECTIONS.map((section) => {
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
                      {section.details.map((detail, idx) => (
                        <div
                          key={idx}
                          className="flex items-start gap-3.5 text-xs sm:text-sm text-neutral-600 font-light leading-relaxed"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-neutral-900 mt-2 shrink-0" />
                          <span>{detail}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Contact & Inquiries CTA */}
        <section className="py-16 border-t border-neutral-200/80 bg-neutral-100/50">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="max-w-2xl">
              <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-neutral-400 font-semibold mb-2 block">
                08 // Questions & Rights
              </span>
              <h3 className="text-2xl font-light text-neutral-950 mb-3">
                Have questions about our data governance?
              </h3>
              <p className="text-xs sm:text-sm text-neutral-600 font-light leading-relaxed mb-6">
                For data export requests, account removal inquiries, or questions
                regarding our demonstration data policies, reach out to our client concierge.
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
                  href="/terms-and-conditions"
                  className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-neutral-900 border-b border-neutral-900 pb-0.5 hover:text-neutral-600 hover:border-neutral-400 transition-colors"
                >
                  Review Terms & Conditions
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
