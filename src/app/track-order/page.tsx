"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Package,
  Truck,
  CheckCircle2,
  Clock,
  Search,
  ArrowRight,
  AlertCircle,
  HelpCircle,
  Mail,
  MapPin,
  Calendar,
  ExternalLink,
  ShieldCheck,
  RefreshCw,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

interface TimelineEvent {
  title: string;
  location: string;
  time: string;
  completed: boolean;
  active?: boolean;
}

interface OrderItem {
  id: string;
  name: string;
  variant: string;
  size: string;
  quantity: number;
  price: string;
}

interface MockOrder {
  orderNumber: string;
  email: string;
  status: "In Transit" | "Delivered" | "Processing";
  statusDescription: string;
  placedDate: string;
  estimatedDelivery: string;
  carrier: string;
  trackingNumber: string;
  destination: {
    recipient: string;
    city: string;
    country: string;
  };
  items: OrderItem[];
  timeline: TimelineEvent[];
}

const MOCK_ORDERS: Record<string, MockOrder> = {
  "SX7-89241": {
    orderNumber: "SX7-89241",
    email: "clara.vance@example.com",
    status: "In Transit",
    statusDescription: "Consignment handed to DHL Express Hub, Leipzig. Outbound flight departed.",
    placedDate: "September 09, 2026",
    estimatedDelivery: "September 14, 2026 — End of Day",
    carrier: "DHL Express Carbon-Neutral (DDP)",
    trackingNumber: "JD0146000098421034",
    destination: {
      recipient: "Clara Vance",
      city: "Stockholm, 114 34",
      country: "Sweden",
    },
    items: [
      {
        id: "item-1",
        name: "Phantom Low-Top Runner",
        variant: "Matte Chalk / Obsidian",
        size: "EU 42",
        quantity: 1,
        price: "$480",
      },
      {
        id: "item-2",
        name: "Architectural Dust Guard Kit",
        variant: "Natural Canvas",
        size: "Standard",
        quantity: 1,
        price: "$65",
      },
    ],
    timeline: [
      {
        title: "Consignment In Transit",
        location: "DHL European Air Hub — Leipzig, Germany",
        time: "Sep 11, 2026 — 22:45 CET",
        completed: true,
        active: true,
      },
      {
        title: "Export Customs Cleared (DDP)",
        location: "Bologna Cargo Facility, Italy",
        time: "Sep 10, 2026 — 18:15 CET",
        completed: true,
      },
      {
        title: "Dispatched from Atelier Guild",
        location: "Montelupo Finishing Workshop, Tuscany",
        time: "Sep 10, 2026 — 11:30 CET",
        completed: true,
      },
      {
        title: "Order Verified & Packed in Protective Casing",
        location: "Six&7 Distribution Archive — Tuscany",
        time: "Sep 09, 2026 — 16:20 CET",
        completed: true,
      },
      {
        title: "Order Placed & Payment Authorized",
        location: "Digital Atelier Platform",
        time: "Sep 09, 2026 — 14:02 CET",
        completed: true,
      },
    ],
  },
  "SX7-64102": {
    orderNumber: "SX7-64102",
    email: "marcus.lind@example.com",
    status: "Delivered",
    statusDescription: "Signed for by M. LIND at residential reception with archival packaging intact.",
    placedDate: "August 28, 2026",
    estimatedDelivery: "Delivered September 01, 2026",
    carrier: "DHL Express DDP (Signature Required)",
    trackingNumber: "JD0146000078129045",
    destination: {
      recipient: "Marcus Lind",
      city: "Copenhagen, 1260",
      country: "Denmark",
    },
    items: [
      {
        id: "item-1",
        name: "Monolith High Chelsea Boot",
        variant: "Vachetta Black",
        size: "EU 43",
        quantity: 1,
        price: "$620",
      },
    ],
    timeline: [
      {
        title: "Delivered & Signed for",
        location: "Copenhagen, Denmark",
        time: "Sep 01, 2026 — 13:40 CET",
        completed: true,
        active: true,
      },
      {
        title: "Out for Courier Delivery",
        location: "København Depot, Denmark",
        time: "Sep 01, 2026 — 08:15 CET",
        completed: true,
      },
      {
        title: "Arrival at Regional Hub",
        location: "Kastrup Gateway, Denmark",
        time: "Aug 31, 2026 — 21:00 CET",
        completed: true,
      },
      {
        title: "Dispatched from Tuscan Atelier",
        location: "Montelupo Workshop, Italy",
        time: "Aug 29, 2026 — 14:10 CET",
        completed: true,
      },
      {
        title: "Order Placed & Confirmed",
        location: "Digital Atelier Platform",
        time: "Aug 28, 2026 — 19:12 CET",
        completed: true,
      },
    ],
  },
};

export default function TrackOrderPage() {
  const [orderNumber, setOrderNumber] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [activeOrder, setActiveOrder] = useState<MockOrder | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    const cleanOrder = orderNumber.trim().toUpperCase();
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanOrder) {
      setValidationError("Please enter your SX7 order identifier (e.g., SX7-89241).");
      return;
    }

    if (!cleanEmail) {
      setValidationError("Please enter the email address used at checkout.");
      return;
    }

    // Basic email format check
    if (!cleanEmail.includes("@") || !cleanEmail.includes(".")) {
      setValidationError("Please enter a valid email address.");
      return;
    }

    setIsLoading(true);
    setHasSearched(true);

    // Simulate luxury fulfillment lookup delay
    setTimeout(() => {
      setIsLoading(false);
      const matched = MOCK_ORDERS[cleanOrder];
      if (matched && matched.email.toLowerCase() === cleanEmail) {
        setActiveOrder(matched);
      } else if (matched) {
        // Order exists but email mismatch
        setActiveOrder(null);
        setValidationError("The order identifier was found, but the associated email address does not match our records.");
      } else {
        setActiveOrder(null);
      }
    }, 700);
  };

  const loadPreset = (presetOrder: string, presetEmail: string) => {
    setOrderNumber(presetOrder);
    setEmail(presetEmail);
    setValidationError(null);
    setIsLoading(true);
    setHasSearched(true);

    setTimeout(() => {
      setIsLoading(false);
      setActiveOrder(MOCK_ORDERS[presetOrder] || null);
    }, 450);
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
              <span className="text-neutral-900">Track Consignment</span>
            </div>

            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="max-w-3xl">
                <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-neutral-900 text-[#FCFCFC] text-[10px] font-mono uppercase tracking-[0.2em] mb-6">
                  Logistics Telemetry // Live Dispatch
                </div>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-light tracking-tight text-neutral-950 mb-6 leading-[1.1]">
                  Track Atelier <br />
                  <span className="font-serif italic font-normal text-neutral-600">
                    Consignments
                  </span>
                </h1>

                <p className="text-base sm:text-lg text-neutral-600 font-light leading-relaxed max-w-2xl">
                  Real-time telemetry for footwear dispatched from our Tuscan finishing
                  workshop and European distribution archives. Enter your reference
                  number and order email below.
                </p>
              </div>

              <div className="flex items-center gap-2 font-mono text-xs text-neutral-500 uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse" />
                <span>Express Hubs Operational</span>
              </div>
            </div>
          </div>
        </section>

        {/* Search & Lookup Form */}
        <section className="py-12 lg:py-16 max-w-7xl mx-auto px-6 lg:px-8">
          <div className="bg-white border border-neutral-200 p-8 sm:p-10 shadow-sm">
            <div className="mb-6">
              <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-neutral-400 font-medium block mb-1">
                Lookup Protocol
              </span>
              <h2 className="text-xl sm:text-2xl font-light text-neutral-950">
                Enter Order Specifications
              </h2>
            </div>

            <form onSubmit={handleTrack} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="orderNumber"
                    className="block font-mono text-[11px] uppercase tracking-wider text-neutral-700 mb-2"
                  >
                    Order Identifier *
                  </label>
                  <input
                    id="orderNumber"
                    type="text"
                    placeholder="e.g. SX7-89241"
                    value={orderNumber}
                    onChange={(e) => setOrderNumber(e.target.value)}
                    className="w-full bg-neutral-50 border border-neutral-200 px-4 py-3 text-xs sm:text-sm text-neutral-900 font-mono focus:outline-none focus:border-neutral-900 uppercase transition-colors"
                  />
                  <span className="text-[11px] text-neutral-400 font-light mt-1.5 block">
                    Found on your order confirmation email and dispatch slip.
                  </span>
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block font-mono text-[11px] uppercase tracking-wider text-neutral-700 mb-2"
                  >
                    Order Email Address *
                  </label>
                  <input
                    id="email"
                    type="email"
                    placeholder="e.g. clara.vance@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-neutral-50 border border-neutral-200 px-4 py-3 text-xs sm:text-sm text-neutral-900 focus:outline-none focus:border-neutral-900 transition-colors font-sans"
                  />
                  <span className="text-[11px] text-neutral-400 font-light mt-1.5 block">
                    The email linked to your Six&7 purchase checkout.
                  </span>
                </div>
              </div>

              {validationError && (
                <div className="p-3.5 bg-amber-50/70 border border-amber-200 text-amber-800 text-xs flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
                  <span>{validationError}</span>
                </div>
              )}

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2 border-t border-neutral-100">
                <div className="flex items-center gap-2 text-xs text-neutral-500 font-mono">
                  <ShieldCheck className="w-4 h-4 text-neutral-400" />
                  <span>Encrypted Courier Protocol // TLS 1.3</span>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-neutral-900 text-white font-mono text-xs uppercase tracking-widest hover:bg-neutral-800 disabled:bg-neutral-400 transition-colors"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Querying Logistics...</span>
                    </>
                  ) : (
                    <>
                      <Search className="w-3.5 h-3.5" />
                      <span>Track Consignment</span>
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Quick Demo Previews */}
            <div className="mt-8 pt-6 border-t border-neutral-100">
              <span className="font-mono text-[10px] uppercase tracking-widest text-neutral-400 block mb-2">
                Demo Verification Presets:
              </span>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => loadPreset("SX7-89241", "clara.vance@example.com")}
                  className="px-3 py-1.5 border border-neutral-200 text-[11px] font-mono text-neutral-700 bg-neutral-50 hover:bg-neutral-100 hover:border-neutral-400 transition-colors"
                >
                  Load In-Transit Demo (SX7-89241)
                </button>
                <button
                  type="button"
                  onClick={() => loadPreset("SX7-64102", "marcus.lind@example.com")}
                  className="px-3 py-1.5 border border-neutral-200 text-[11px] font-mono text-neutral-700 bg-neutral-50 hover:bg-neutral-100 hover:border-neutral-400 transition-colors"
                >
                  Load Delivered Demo (SX7-64102)
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Results Section */}
        <section className="pb-20 max-w-7xl mx-auto px-6 lg:px-8">
          <AnimatePresence mode="wait">
            {isLoading && (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="py-16 text-center border border-neutral-200 bg-white space-y-4"
              >
                <div className="w-10 h-10 border-2 border-neutral-300 border-t-neutral-900 rounded-full animate-spin mx-auto" />
                <p className="font-mono text-xs uppercase tracking-widest text-neutral-500">
                  Contacting Carrier Telemetry Gateway...
                </p>
              </motion.div>
            )}

            {!isLoading && hasSearched && !activeOrder && (
              <motion.div
                key="not-found"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="p-8 sm:p-12 border border-neutral-200 bg-white text-center space-y-4"
              >
                <div className="w-12 h-12 rounded-full bg-neutral-100 text-neutral-500 flex items-center justify-center mx-auto">
                  <Package className="w-6 h-6 stroke-[1.5]" />
                </div>
                <h3 className="text-xl font-light text-neutral-950">
                  No Consignment Records Found
                </h3>
                <p className="text-xs sm:text-sm text-neutral-500 font-light max-w-md mx-auto leading-relaxed">
                  We could not locate an active dispatch matching the supplied reference
                  number and email combination. Please confirm the characters on your
                  original confirmation notice.
                </p>
                <div className="pt-2 flex flex-wrap justify-center gap-4">
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-neutral-900 text-white font-mono text-xs uppercase tracking-wider hover:bg-neutral-800 transition-colors"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    Inquire with Concierge
                  </Link>
                  <Link
                    href="/shipping-and-returns"
                    className="inline-flex items-center gap-2 px-5 py-2.5 border border-neutral-200 text-neutral-700 font-mono text-xs uppercase tracking-wider hover:bg-neutral-50 transition-colors"
                  >
                    View Shipping Policies
                  </Link>
                </div>
              </motion.div>
            )}

            {!isLoading && activeOrder && (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-8"
              >
                {/* Order Summary Header Bar */}
                <div className="border border-neutral-200 bg-white p-6 sm:p-8">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-neutral-100">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <span className="font-mono text-xs uppercase tracking-widest text-neutral-400">
                          Consignment Record
                        </span>
                        <span className="font-mono text-sm font-semibold text-neutral-900">
                          {activeOrder.orderNumber}
                        </span>
                      </div>
                      <h3 className="text-2xl sm:text-3xl font-light text-neutral-950">
                        Status:{" "}
                        <span
                          className={
                            activeOrder.status === "Delivered"
                              ? "text-emerald-700 font-normal"
                              : "text-neutral-900 font-normal"
                          }
                        >
                          {activeOrder.status}
                        </span>
                      </h3>
                      <p className="text-xs sm:text-sm text-neutral-500 font-light mt-1">
                        {activeOrder.statusDescription}
                      </p>
                    </div>

                    <div className="flex flex-wrap lg:flex-col items-start lg:items-end gap-3 text-right">
                      <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-neutral-100 text-neutral-900 font-mono text-xs">
                        <Calendar className="w-3.5 h-3.5 text-neutral-500" />
                        <span>Est. Delivery: {activeOrder.estimatedDelivery}</span>
                      </div>
                      <span className="text-[11px] font-mono text-neutral-400">
                        Dispatched via {activeOrder.carrier}
                      </span>
                    </div>
                  </div>

                  {/* Metadata Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-6 text-xs">
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 block mb-1">
                        Carrier Tracking ID
                      </span>
                      <span className="font-mono text-neutral-900 break-all font-medium">
                        {activeOrder.trackingNumber}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 block mb-1">
                        Consignment Destination
                      </span>
                      <span className="text-neutral-900 font-medium">
                        {activeOrder.destination.recipient}
                      </span>
                      <p className="text-neutral-500 font-light mt-0.5">
                        {activeOrder.destination.city}, {activeOrder.destination.country}
                      </p>
                    </div>
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 block mb-1">
                        Order Initialized
                      </span>
                      <span className="text-neutral-700">
                        {activeOrder.placedDate}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 block mb-1">
                        Duties & Clearance
                      </span>
                      <span className="text-emerald-700 font-medium font-mono">
                        DDP Cleared (0.00 Balance)
                      </span>
                    </div>
                  </div>
                </div>

                {/* Timeline & Manifest Split */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  {/* Left: Checkpoint Timeline */}
                  <div className="lg:col-span-7 bg-white border border-neutral-200 p-6 sm:p-8">
                    <div className="flex items-center justify-between mb-6 pb-4 border-b border-neutral-100">
                      <div>
                        <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 block">
                          Checkpoint Ledger
                        </span>
                        <h4 className="text-base font-medium text-neutral-950 mt-1">
                          Transit History & Milestones
                        </h4>
                      </div>
                      <Truck className="w-4 h-4 text-neutral-400" />
                    </div>

                    <div className="relative pl-6 space-y-6 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-neutral-200">
                      {activeOrder.timeline.map((event, idx) => (
                        <div key={idx} className="relative">
                          {/* Dot marker */}
                          <div
                            className={`absolute -left-[29px] top-1 w-4 h-4 rounded-full border-2 bg-white flex items-center justify-center ${
                              event.active
                                ? "border-neutral-950 ring-4 ring-neutral-100"
                                : event.completed
                                ? "border-neutral-600 bg-neutral-900"
                                : "border-neutral-300"
                            }`}
                          >
                            {event.completed && !event.active && (
                              <div className="w-1.5 h-1.5 rounded-full bg-white" />
                            )}
                            {event.active && (
                              <div className="w-1.5 h-1.5 rounded-full bg-neutral-950" />
                            )}
                          </div>

                          <div className="space-y-1">
                            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                              <h5
                                className={`text-xs sm:text-sm font-medium ${
                                  event.active
                                    ? "text-neutral-950 font-semibold"
                                    : "text-neutral-800"
                                }`}
                              >
                                {event.title}
                              </h5>
                              <span className="font-mono text-[10px] text-neutral-400">
                                {event.time}
                              </span>
                            </div>
                            <div className="flex items-center gap-1.5 text-xs text-neutral-500 font-light">
                              <MapPin className="w-3 h-3 text-neutral-400 shrink-0" />
                              <span>{event.location}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Right: Package Manifest */}
                  <div className="lg:col-span-5 bg-white border border-neutral-200 p-6 sm:p-8 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-6 pb-4 border-b border-neutral-100">
                        <div>
                          <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 block">
                            Package Manifest
                          </span>
                          <h4 className="text-base font-medium text-neutral-950 mt-1">
                            Consignment Items
                          </h4>
                        </div>
                        <Package className="w-4 h-4 text-neutral-400" />
                      </div>

                      <div className="divide-y divide-neutral-100">
                        {activeOrder.items.map((item) => (
                          <div key={item.id} className="py-4 first:pt-0 last:pb-0 flex items-start justify-between gap-4">
                            <div>
                              <h5 className="text-xs sm:text-sm font-medium text-neutral-900">
                                {item.name}
                              </h5>
                              <p className="text-[11px] text-neutral-500 font-light mt-0.5">
                                Variant: {item.variant}
                              </p>
                              <div className="flex items-center gap-3 font-mono text-[10px] text-neutral-400 mt-1.5">
                                <span>Size: {item.size}</span>
                                <span>•</span>
                                <span>Qty: {item.quantity}</span>
                              </div>
                            </div>
                            <span className="font-mono text-xs text-neutral-900 font-medium">
                              {item.price}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="mt-8 pt-4 border-t border-neutral-100 space-y-3">
                      <div className="flex items-center justify-between text-xs text-neutral-500">
                        <span>Courier Signature</span>
                        <span className="font-mono text-neutral-800">Required</span>
                      </div>
                      <div className="flex items-center justify-between text-xs text-neutral-500">
                        <span>Packaging Standard</span>
                        <span className="font-mono text-neutral-800">Archival Soles Box</span>
                      </div>
                      <Link
                        href="/shipping-and-returns"
                        className="inline-flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-wider text-neutral-900 hover:text-neutral-600 transition-colors pt-2"
                      >
                        <span>Need to return or exchange? Review return terms</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* Client Support Assistance CTA */}
        <section className="py-16 border-t border-neutral-200/80 bg-neutral-100/50">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-8">
                <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-neutral-400 font-semibold mb-2 block">
                  Concierge Support Desk
                </span>
                <h3 className="text-2xl sm:text-3xl font-light text-neutral-950 mb-3">
                  Encountering courier delays or routing discrepancies?
                </h3>
                <p className="text-xs sm:text-sm text-neutral-600 font-light leading-relaxed max-w-2xl">
                  Our European client team maintains direct escalations with DHL Express
                  logistics stations to re-route parcels, arrange hold-for-pickup, or update
                  delivery authorization.
                </p>
              </div>

              <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3">
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-neutral-900 text-white text-xs font-mono uppercase tracking-widest hover:bg-neutral-800 transition-colors text-center"
                >
                  <Mail className="w-4 h-4" />
                  Contact Concierge
                </Link>
                <Link
                  href="/faq"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 border border-neutral-300 text-neutral-800 text-xs font-mono uppercase tracking-widest hover:bg-white transition-colors text-center"
                >
                  <HelpCircle className="w-4 h-4" />
                  Frequently Asked Questions
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
