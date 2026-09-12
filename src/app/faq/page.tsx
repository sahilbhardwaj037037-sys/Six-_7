"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ChevronDown,
  HelpCircle,
  Mail,
  Ruler,
  Search,
  Sparkles,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

interface FAQItem {
  id: string;
  category: string;
  question: string;
  answer: string;
}

const FAQ_CATEGORIES = [
  { id: "all", label: "All Questions" },
  { id: "orders", label: "Orders & Shipping" },
  { id: "sizing", label: "Sizing & Fit" },
  { id: "returns", label: "Returns & Exchanges" },
  { id: "materials", label: "Materials & Care" },
  { id: "sustainability", label: "Eco & Circularity" },
];

const FAQ_DATA: FAQItem[] = [
  {
    id: "faq-1",
    category: "orders",
    question: "How long does global express delivery take?",
    answer:
      "All Six&7 orders are dispatched directly from our distribution centers in Tuscany (EU) and Copenhagen (Nordics). Standard European delivery takes 2–4 business days. International express dispatches (North America, Japan, Asia-Pacific, UK) arrive within 3–5 business days via DHL Express with signature confirmation.",
  },
  {
    id: "faq-2",
    category: "orders",
    question: "Do orders include duties, tariffs, and local taxes?",
    answer:
      "Yes. All international shipments are delivered DDP (Delivered Duty Paid). All local customs, import duties, and value-added taxes are calculated and absorbed at checkout. You will never receive unexpected brokerage fees upon delivery.",
  },
  {
    id: "faq-3",
    category: "orders",
    question: "Can I modify or cancel my order after placement?",
    answer:
      "Because our fulfillment center processes orders with automated speed, cancellations or address modifications must be requested within 60 minutes of order confirmation. Please contact concierge@sixand7.com immediately with your SX7 order number.",
  },
  {
    id: "faq-4",
    category: "sizing",
    question: "How do Six&7 footwear lasts compare to standard athletic sneakers?",
    answer:
      "Our low-profile runners (Phantom Low, Monolith Minimal) fit true to EU sizing. If you wear an EU 42 or US 9 in premium designer shoes, take EU 42. For our architectural high-tops and boots, we recommend sizing down half a size if you are between measurements.",
  },
  {
    id: "faq-5",
    category: "sizing",
    question: "Where can I view full international conversion measurements?",
    answer:
      "You can visit our dedicated Sizing & Fit Guide (/size-guide) for exact foot length measurements in centimeters and inches across adult and junior silhouettes, along with step-by-step instructions on measuring your foot.",
  },
  {
    id: "faq-6",
    category: "returns",
    question: "What is your return and exchange policy?",
    answer:
      "We offer 30-day complimentary returns and exchanges globally. Footwear must remain in unworn, brand-new condition with all original packaging, shoe bags, and spare laces intact. Size exchanges are always priority-shipped free of charge.",
  },
  {
    id: "faq-7",
    category: "returns",
    question: "How do I initiate a complimentary return or exchange?",
    answer:
      "Contact our concierge desk via our Contact page or email returns@sixand7.com with your order reference. We will promptly issue a prepaid DHL return label and schedule an optional courier pickup directly from your doorstep.",
  },
  {
    id: "faq-8",
    category: "returns",
    question: "How long does it take to receive a refund?",
    answer:
      "Once your returned pair is inspected and cleared by our Tuscany workshop, your refund is issued immediately to your original payment method. Depending on your banking institution, funds settle within 3–5 business days.",
  },
  {
    id: "faq-9",
    category: "materials",
    question: "How should I clean and protect Italian calfskin and nubuck uppers?",
    answer:
      "Wipe smooth calfskin with a slightly damp microfiber cloth and treat quarterly with natural beeswax or neutral conditioning cream. For nubuck and suede panels, use a brass or crepe suede brush in gentle unidirectional strokes. Avoid direct heat sources when drying.",
  },
  {
    id: "faq-10",
    category: "materials",
    question: "Can the architectural bio-foam outsoles be resoled?",
    answer:
      "Yes. In partnership with our Florence guild, Six&7 offers an Atelier Resole Program for select stitched cupsole silhouettes. You can submit your worn pairs after 18–24 months of heavy wear for a factory-spec recrafting.",
  },
  {
    id: "faq-11",
    category: "sustainability",
    question: "What makes Six&7 foams sustainable?",
    answer:
      "Our proprietary Bio-Foam compound incorporates 48% renewable sugarcane waste and recycled post-industrial rubber granules. This reduces petrochemical crude reliance while retaining superior shock absorption and lightweight spring.",
  },
  {
    id: "faq-12",
    category: "sustainability",
    question: "Is your packaging recyclable and plastic-free?",
    answer:
      "Every shoe box is fabricated from 100% FSC-certified post-consumer recycled unbleached kraft board, printed with water-based non-toxic soy inks. Interior wraps use raw organic cotton dust bags that double as travel totes.",
  },
];

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [openIds, setOpenIds] = useState<string[]>(["faq-1", "faq-4"]);

  const toggleItem = (id: string) => {
    setOpenIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const filteredFaqs = useMemo(() => {
    return FAQ_DATA.filter((faq) => {
      const matchesCategory =
        activeCategory === "all" || faq.category === activeCategory;
      const matchesSearch =
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

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
                    Knowledge Base // Client Concierge
                  </span>
                </div>
                <h1 className="text-3xl sm:text-5xl font-light uppercase tracking-tight text-neutral-950">
                  Frequently Asked Questions
                </h1>
                <p className="text-neutral-500 text-xs sm:text-sm font-light mt-3 leading-relaxed">
                  Clarifications on our dispatch timelines, sizing tolerances, sustainable compound formulas, and complimentary global exchange service.
                </p>
              </div>

              {/* Live Search Filter */}
              <div className="w-full md:w-80">
                <div className="relative">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 stroke-[1.5]" />
                  <input
                    type="text"
                    placeholder="Search queries (e.g. returns, size, foam)..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-neutral-50 border border-neutral-200 text-xs text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-900 font-sans"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono uppercase text-neutral-400 hover:text-black"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Category Pills Switcher */}
        <section className="border-b border-neutral-200 bg-neutral-50/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
              {FAQ_CATEGORIES.map((cat) => {
                const isActive = activeCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setActiveCategory(cat.id)}
                    className={`whitespace-nowrap px-4 py-2 font-mono text-xs uppercase tracking-wider transition-colors ${
                      isActive
                        ? "bg-neutral-950 text-white"
                        : "bg-white border border-neutral-200 text-neutral-600 hover:border-neutral-900 hover:text-black"
                    }`}
                  >
                    {cat.label}
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* FAQ Accordion List */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
          {filteredFaqs.length === 0 ? (
            <div className="text-center py-16 bg-white border border-neutral-200 p-8">
              <HelpCircle className="w-8 h-8 text-neutral-400 mx-auto mb-3 stroke-[1.5]" />
              <h3 className="text-base font-light uppercase tracking-tight text-neutral-900 mb-1">
                No Matching Clarifications Found
              </h3>
              <p className="text-xs text-neutral-500 font-light mb-6">
                We couldn&apos;t find an answer matching &ldquo;{searchQuery}&rdquo;. Contact our concierge directly for immediate help.
              </p>
              <div className="flex justify-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    setActiveCategory("all");
                  }}
                  className="px-4 py-2 border border-neutral-300 font-mono text-xs uppercase tracking-wider hover:bg-neutral-100"
                >
                  Reset Filters
                </button>
                <Link
                  href="/contact"
                  className="px-4 py-2 bg-neutral-950 text-white font-mono text-xs uppercase tracking-wider hover:bg-neutral-800"
                >
                  Contact Concierge
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredFaqs.map((item) => {
                const isOpen = openIds.includes(item.id);
                return (
                  <div
                    key={item.id}
                    className="bg-white border border-neutral-200 overflow-hidden transition-colors"
                  >
                    <button
                      type="button"
                      onClick={() => toggleItem(item.id)}
                      className="w-full text-left p-6 flex items-center justify-between gap-4 hover:bg-neutral-50/50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <span className="font-mono text-[11px] text-neutral-400 uppercase tracking-widest hidden sm:inline-block">
                          {item.id.replace("faq-", "0")}
                        </span>
                        <h3 className="text-sm sm:text-base font-normal uppercase tracking-tight text-neutral-950">
                          {item.question}
                        </h3>
                      </div>
                      <ChevronDown
                        className={`w-4 h-4 text-neutral-400 shrink-0 transition-transform duration-200 ${
                          isOpen ? "rotate-180 text-neutral-950" : ""
                        }`}
                      />
                    </button>

                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="px-6 pb-6 pt-2 text-xs sm:text-sm text-neutral-600 font-light leading-relaxed border-t border-neutral-100">
                            <p>{item.answer}</p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          )}

          {/* Sizing & Contact Prompt Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12 pt-12 border-t border-neutral-200">
            <div className="bg-white border border-neutral-200 p-6 flex flex-col justify-between">
              <div>
                <div className="w-8 h-8 flex items-center justify-center bg-neutral-100 border border-neutral-200 mb-4">
                  <Ruler className="w-4 h-4 text-neutral-800 stroke-[1.5]" />
                </div>
                <h4 className="font-mono text-xs uppercase tracking-wider text-neutral-950 font-semibold mb-1">
                  Need Exact Foot Measurements?
                </h4>
                <p className="text-xs text-neutral-500 font-light">
                  View international size conversion charts across EU, US, and UK metrics with millimeter precision guides.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-neutral-100">
                <Link
                  href="/size-guide"
                  className="font-mono text-xs uppercase tracking-wider text-neutral-900 underline underline-offset-4 hover:text-neutral-500"
                >
                  Inspect Size Guide &rarr;
                </Link>
              </div>
            </div>

            <div className="bg-white border border-neutral-200 p-6 flex flex-col justify-between">
              <div>
                <div className="w-8 h-8 flex items-center justify-center bg-neutral-100 border border-neutral-200 mb-4">
                  <Mail className="w-4 h-4 text-neutral-800 stroke-[1.5]" />
                </div>
                <h4 className="font-mono text-xs uppercase tracking-wider text-neutral-950 font-semibold mb-1">
                  Unresolved Questions?
                </h4>
                <p className="text-xs text-neutral-500 font-light">
                  Reach out directly to our concierge team. We respond to all correspondence within 24 hours.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-neutral-100">
                <Link
                  href="/contact"
                  className="font-mono text-xs uppercase tracking-wider text-neutral-900 underline underline-offset-4 hover:text-neutral-500"
                >
                  Contact Concierge Desk &rarr;
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
