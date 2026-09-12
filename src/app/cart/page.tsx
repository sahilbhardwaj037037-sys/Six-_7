"use client";

import Link from "next/link";
import Image from "next/image";
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, ShieldCheck, ArrowLeft } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useCart } from "@/context/CartContext";

export default function CartPage() {
  const { items, removeItem, updateQuantity, totalItems, subtotal, isHydrated } = useCart();

  if (!isHydrated) {
    return (
      <div className="min-h-screen flex flex-col bg-[#FBFBFB] text-[#111111]">
        <Navbar />
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-16 flex items-center justify-center">
          <div className="text-xs font-mono text-neutral-400 uppercase tracking-widest animate-pulse">
            Loading Bag...
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FBFBFB] text-[#111111]">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        {/* Page Header */}
        <div className="border-b border-neutral-200 pb-6 mb-8 sm:mb-12 flex flex-col sm:flex-row sm:items-baseline justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-light tracking-tight text-neutral-950 uppercase font-mono">
              Shopping Bag
            </h1>
            <p className="text-xs text-neutral-500 font-mono mt-1">
              {totalItems} {totalItems === 1 ? "Item" : "Items"} selected
            </p>
          </div>
          <Link
            href="/shop"
            className="inline-flex items-center gap-1.5 text-xs font-mono text-neutral-600 hover:text-neutral-950 uppercase tracking-wider transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Continue Shopping</span>
          </Link>
        </div>

        {items.length === 0 ? (
          /* Empty Bag State */
          <div className="max-w-md mx-auto py-16 sm:py-24 text-center">
            <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="w-7 h-7 text-neutral-400 stroke-[1.2]" />
            </div>
            <h2 className="text-lg font-light tracking-tight text-neutral-900 uppercase font-mono mb-2">
              Your Bag is Empty
            </h2>
            <p className="text-xs text-neutral-500 font-mono mb-8 leading-relaxed">
              Explore our architectural footwear collections, handcrafted releases, and performance silhouettes.
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-neutral-950 hover:bg-neutral-800 text-white text-xs font-mono uppercase tracking-widest transition-all"
            >
              <span>Explore Collection</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        ) : (
          /* Populated Bag Layout */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* Items List */}
            <div className="lg:col-span-8 space-y-6">
              <div className="border-t border-neutral-200 divide-y divide-neutral-200">
                {items.map((item) => (
                  <div key={item.id} className="py-6 sm:py-8 flex flex-col sm:flex-row gap-5 sm:gap-6">
                    {/* Item Thumbnail */}
                    <Link
                      href={`/product/${item.slug}`}
                      className="relative w-full sm:w-32 h-44 sm:h-36 bg-neutral-100 shrink-0 overflow-hidden group"
                    >
                      <Image
                        src={item.imageUrl}
                        alt={item.name}
                        fill
                        sizes="(max-width: 640px) 100vw, 128px"
                        className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                      />
                    </Link>

                    {/* Item Details */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div className="flex justify-between items-start gap-4">
                        <div>
                          <Link
                            href={`/product/${item.slug}`}
                            className="text-sm font-medium text-neutral-950 hover:text-neutral-600 transition-colors uppercase tracking-wide"
                          >
                            {item.name}
                          </Link>
                          <div className="mt-2 flex flex-wrap items-center gap-3 text-xs font-mono text-neutral-500">
                            <span>Size: <strong className="text-neutral-900 font-medium">{item.size}</strong></span>
                            <span>&bull;</span>
                            <span className="flex items-center gap-1.5">
                              Color:
                              {item.colorHex && (
                                <span
                                  className="inline-block w-3 h-3 rounded-full border border-neutral-300"
                                  style={{ backgroundColor: item.colorHex }}
                                />
                              )}
                              <span className="text-neutral-900 font-medium">Option {item.colorIndex + 1}</span>
                            </span>
                          </div>
                        </div>

                        {/* Line Item Total */}
                        <div className="text-sm font-mono font-medium text-neutral-950">
                          ${(item.price * item.quantity).toFixed(2)}
                        </div>
                      </div>

                      {/* Quantity Stepper & Removal */}
                      <div className="mt-6 flex items-center justify-between pt-4 border-t border-neutral-100">
                        <div className="flex items-center border border-neutral-200 bg-white">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-2 text-neutral-600 hover:text-neutral-950 transition-colors disabled:opacity-30 cursor-pointer"
                            aria-label={`Decrease quantity of ${item.name}`}
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="w-8 text-center text-xs font-mono font-medium text-neutral-900">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-2 text-neutral-600 hover:text-neutral-950 transition-colors cursor-pointer"
                            aria-label={`Increase quantity of ${item.name}`}
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="flex items-center gap-4">
                          <span className="text-xs font-mono text-neutral-400">
                            ${item.price} each
                          </span>
                          <button
                            type="button"
                            onClick={() => removeItem(item.id)}
                            className="text-xs font-mono text-neutral-400 hover:text-red-600 transition-colors flex items-center gap-1 cursor-pointer"
                            aria-label={`Remove ${item.name} from bag`}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">Remove</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-4 bg-white border border-neutral-200 p-6 sm:p-8 space-y-6 lg:sticky lg:top-24">
              <h2 className="text-sm font-mono uppercase tracking-widest text-neutral-950 border-b border-neutral-100 pb-4">
                Summary
              </h2>

              <div className="space-y-3 text-xs font-mono">
                <div className="flex justify-between text-neutral-600">
                  <span>Subtotal</span>
                  <span className="text-neutral-950 font-medium">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-neutral-600">
                  <span>Estimated Delivery</span>
                  <span className="text-emerald-700 font-medium uppercase text-[11px]">Complimentary</span>
                </div>
                <div className="flex justify-between text-neutral-600">
                  <span>Taxes</span>
                  <span className="text-neutral-400">Calculated at checkout</span>
                </div>

                <div className="pt-4 border-t border-neutral-100 flex justify-between text-sm font-mono text-neutral-950 font-medium">
                  <span>Total</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  disabled
                  className="w-full py-4 bg-neutral-950 text-white text-xs font-mono uppercase tracking-widest flex items-center justify-center gap-2 opacity-90 cursor-not-allowed"
                >
                  <span>Checkout Available Soon</span>
                </button>
                <p className="mt-2 text-center text-[10px] font-mono text-neutral-400">
                  Customer account & payment checkout flow in active development.
                </p>
              </div>

              {/* Guarantees */}
              <div className="pt-4 border-t border-neutral-100 space-y-2 text-[11px] font-mono text-neutral-500">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-neutral-800 shrink-0" />
                  <span>Verified authentic Six&7 footwear</span>
                </div>
                <p>&bull; Complimentary carbon-neutral domestic shipping</p>
                <p>&bull; 30-day effortless return privilege</p>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
