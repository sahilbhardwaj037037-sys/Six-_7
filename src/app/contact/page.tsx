"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  HelpCircle,
  Mail,
  MapPin,
  MessageSquare,
  Send,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

interface FormState {
  fullName: string;
  email: string;
  orderNumber: string;
  category: string;
  message: string;
}

const INITIAL_FORM: FormState = {
  fullName: "",
  email: "",
  orderNumber: "",
  category: "order",
  message: "",
};

const INQUIRY_CATEGORIES = [
  { id: "order", label: "Order Status & Tracking" },
  { id: "sizing", label: "Sizing & Fit Advisory" },
  { id: "returns", label: "Returns & Exchanges" },
  { id: "restoration", label: "Sole Restoration Program" },
  { id: "press", label: "Press & Editorial Inquiry" },
  { id: "general", label: "General Atelier Inquiries" },
];

const CONTACT_CHANNELS = [
  {
    title: "Client Care Concierge",
    email: "concierge@sixand7.com",
    description:
      "For sizing recommendations, existing order assistance, and worldwide shipping tracking.",
    turnaround: "Response within 12-24 business hours",
  },
  {
    title: "Press & Architectural Studio",
    email: "studio@sixand7.com",
    description:
      "Editorial requests, high-res catalog lookbooks, and collaborative design projects.",
    turnaround: "Response within 2-3 business days",
  },
  {
    title: "Wholesale & Stockists",
    email: "partners@sixand7.com",
    description:
      "Boutique distribution inquiries and global retail partnership applications.",
    turnaround: "Response within 3 business days",
  },
];

const LOCATIONS = [
  {
    city: "Copenhagen Atelier",
    country: "Denmark",
    address: "Bredgade 42, 1260 København K",
    hours: "Mon – Fri: 10:00 – 18:00 CET",
    badge: "Design Studio & Archive",
  },
  {
    city: "Tuscany Cordwaining Guild",
    country: "Italy",
    address: "Via dell'Artigianato 18, 50056 Montelupo Fiorentino",
    hours: "By Appointment Only",
    badge: "Finishing Workshop",
  },
];

export default function ContactPage() {
  const [formData, setFormData] = useState<FormState>(INITIAL_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate editorial API submission
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setFormData(INITIAL_FORM);
    }, 600);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#FBFBFB] text-neutral-900">
      <Navbar />

      <main className="flex-1">
        {/* Header */}
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
                    Direct Atelier Contact
                  </span>
                </div>
                <h1 className="text-3xl sm:text-5xl font-light uppercase tracking-tight text-neutral-950">
                  Client Care & Studio Inquiries
                </h1>
                <p className="text-neutral-500 text-xs sm:text-sm font-light mt-3 leading-relaxed">
                  Our Copenhagen and Tuscan client teams are available for sizing consultations, order inquiries, and studio correspondence.
                </p>
              </div>

              <div className="flex items-center gap-2 font-mono text-xs text-neutral-500 uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                <span>Concierge Desk Active</span>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content: Channels & Form */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
            {/* Left Column: Contact Channels & Locations */}
            <div className="lg:col-span-5 space-y-12">
              <div>
                <span className="font-mono text-xs uppercase tracking-[0.25em] text-neutral-400 block mb-4">
                  01 // Direct Correspondence
                </span>
                <div className="space-y-6">
                  {CONTACT_CHANNELS.map((channel, idx) => (
                    <div
                      key={idx}
                      className="bg-white border border-neutral-200 p-6 flex flex-col justify-between"
                    >
                      <div>
                        <h2 className="text-sm font-medium uppercase tracking-wider text-neutral-950 mb-1">
                          {channel.title}
                        </h2>
                        <a
                          href={`mailto:${channel.email}`}
                          className="font-mono text-xs text-neutral-900 underline underline-offset-4 hover:text-neutral-600 transition-colors"
                        >
                          {channel.email}
                        </a>
                        <p className="text-xs text-neutral-500 font-light mt-3 leading-relaxed">
                          {channel.description}
                        </p>
                      </div>
                      <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center gap-2 text-[10px] font-mono text-neutral-400 uppercase tracking-wider">
                        <Clock className="w-3 h-3" />
                        <span>{channel.turnaround}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Locations */}
              <div>
                <span className="font-mono text-xs uppercase tracking-[0.25em] text-neutral-400 block mb-4">
                  02 // Atelier Hubs
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {LOCATIONS.map((loc, idx) => (
                    <div
                      key={idx}
                      className="bg-white border border-neutral-200 p-5 flex flex-col justify-between"
                    >
                      <div>
                        <div className="font-mono text-[9px] uppercase tracking-widest text-neutral-500 mb-1">
                          {loc.badge}
                        </div>
                        <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-950 mb-1">
                          {loc.city}
                        </h3>
                        <p className="text-xs text-neutral-500 font-light leading-relaxed">
                          {loc.address}
                        </p>
                      </div>
                      <div className="mt-4 pt-2 border-t border-neutral-100 text-[10px] font-mono text-neutral-400">
                        {loc.hours}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Dispatch Transmission Form */}
            <div className="lg:col-span-7">
              <div className="bg-white border border-neutral-200 p-8 sm:p-10">
                <div className="mb-8 pb-6 border-b border-neutral-100">
                  <span className="font-mono text-xs uppercase tracking-[0.25em] text-neutral-400 block mb-2">
                    03 // Digital Transmission
                  </span>
                  <h2 className="text-xl sm:text-2xl font-light uppercase tracking-tight text-neutral-950">
                    Send An Inquiry
                  </h2>
                  <p className="text-xs text-neutral-500 font-light mt-1">
                    Fill in the form below and an atelier representative will respond via email.
                  </p>
                </div>

                {isSubmitted ? (
                  <div className="py-12 text-center space-y-4">
                    <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-200">
                      <CheckCircle2 className="w-6 h-6 stroke-[1.5]" />
                    </div>
                    <h3 className="text-lg font-light uppercase tracking-tight text-neutral-950">
                      Inquiry Received
                    </h3>
                    <p className="text-xs text-neutral-500 max-w-md mx-auto leading-relaxed">
                      Thank you for contacting Six&7. Your dispatch has been logged in our queue. A client concierge will review your message and respond within 24 business hours.
                    </p>
                    <div className="pt-4">
                      <button
                        type="button"
                        onClick={() => setIsSubmitted(false)}
                        className="px-6 py-2.5 bg-neutral-900 text-white font-mono text-xs uppercase tracking-widest hover:bg-neutral-800 transition-colors"
                      >
                        Send Another Note
                      </button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Inquiry Type */}
                    <div>
                      <label className="block font-mono text-[11px] uppercase tracking-wider text-neutral-700 mb-2">
                        Inquiry Category *
                      </label>
                      <select
                        value={formData.category}
                        onChange={(e) =>
                          setFormData({ ...formData, category: e.target.value })
                        }
                        className="w-full bg-neutral-50 border border-neutral-200 px-4 py-3 text-xs text-neutral-900 focus:outline-none focus:border-neutral-900 font-sans"
                        required
                      >
                        {INQUIRY_CATEGORIES.map((cat) => (
                          <option key={cat.id} value={cat.id}>
                            {cat.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Name and Email */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block font-mono text-[11px] uppercase tracking-wider text-neutral-700 mb-2">
                          Your Name *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Maya Lin"
                          value={formData.fullName}
                          onChange={(e) =>
                            setFormData({ ...formData, fullName: e.target.value })
                          }
                          className="w-full bg-neutral-50 border border-neutral-200 px-4 py-3 text-xs text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-900 font-sans"
                        />
                      </div>

                      <div>
                        <label className="block font-mono text-[11px] uppercase tracking-wider text-neutral-700 mb-2">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          required
                          placeholder="client@domain.com"
                          value={formData.email}
                          onChange={(e) =>
                            setFormData({ ...formData, email: e.target.value })
                          }
                          className="w-full bg-neutral-50 border border-neutral-200 px-4 py-3 text-xs text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-900 font-sans"
                        />
                      </div>
                    </div>

                    {/* Order Reference */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="block font-mono text-[11px] uppercase tracking-wider text-neutral-700">
                          Order Reference
                        </label>
                        <span className="font-mono text-[10px] text-neutral-400 uppercase">
                          Optional
                        </span>
                      </div>
                      <input
                        type="text"
                        placeholder="e.g. SX7-89241"
                        value={formData.orderNumber}
                        onChange={(e) =>
                          setFormData({ ...formData, orderNumber: e.target.value })
                        }
                        className="w-full bg-neutral-50 border border-neutral-200 px-4 py-3 text-xs text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-900 font-sans"
                      />
                    </div>

                    {/* Message Area */}
                    <div>
                      <label className="block font-mono text-[11px] uppercase tracking-wider text-neutral-700 mb-2">
                        Message / Inquiry Details *
                      </label>
                      <textarea
                        required
                        rows={5}
                        placeholder="Please include model names, specific sizing questions, or order details..."
                        value={formData.message}
                        onChange={(e) =>
                          setFormData({ ...formData, message: e.target.value })
                        }
                        className="w-full bg-neutral-50 border border-neutral-200 p-4 text-xs text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-900 font-sans resize-y"
                      />
                    </div>

                    {/* Submit Button */}
                    <div>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-neutral-950 text-white py-4 px-6 font-mono text-xs uppercase tracking-widest hover:bg-neutral-800 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
                      >
                        {isSubmitting ? (
                          <span>Transmitting Inquiry...</span>
                        ) : (
                          <>
                            <span>Transmit Inquiry to Concierge</span>
                            <Send className="w-3.5 h-3.5" />
                          </>
                        )}
                      </button>
                    </div>

                    <p className="text-[11px] font-mono text-neutral-400 text-center">
                      Secure atelier dispatch // All personal data processed under strict privacy guidelines.
                    </p>
                  </form>
                )}
              </div>

              {/* FAQ Quick Shortcut */}
              <div className="mt-6 bg-neutral-100 border border-neutral-200 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <HelpCircle className="w-5 h-5 text-neutral-600 stroke-[1.5]" />
                  <div>
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-900">
                      Seeking Immediate Answers?
                    </h3>
                    <p className="text-xs text-neutral-500 font-light">
                      Shipping times, free returns, and fit solutions are detailed in our knowledge base.
                    </p>
                  </div>
                </div>
                <Link
                  href="/faq"
                  className="whitespace-nowrap px-4 py-2 bg-white border border-neutral-300 text-neutral-900 font-mono text-[11px] uppercase tracking-widest hover:border-neutral-900 transition-colors"
                >
                  Visit FAQ
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
