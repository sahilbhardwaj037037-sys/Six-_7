"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, ShoppingBag, User, Heart, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const NAV_LINKS = [
  { name: "Home", href: "/" },
  { name: "Shop", href: "/shop" },
  { name: "Men", href: "/men" },
  { name: "Women", href: "/women" },
  { name: "Kids", href: "/kids" },
  { name: "Sports", href: "/sports" },
  { name: "New Arrivals", href: "#new-arrivals" },
  { name: "Best Sellers", href: "#best-sellers" },
  { name: "Offers", href: "#offers" },
];

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-[#FBFBFB]/90 backdrop-blur-md border-b border-neutral-200/80 transition-all">
      {/* Top Banner Announcement */}
      <div className="bg-[#111111] text-[#FBFBFB] text-[11px] font-mono tracking-widest uppercase py-2 px-4 text-center">
        <span>Complimentary Express Delivery on Global Orders Over $300</span>
      </div>

      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Mobile Hamburger */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(true)}
          className="lg:hidden p-2 text-neutral-800 hover:text-black focus:outline-none"
          aria-label="Open mobile navigation menu"
        >
          <Menu className="w-6 h-6 stroke-[1.5]" />
        </button>

        {/* Brand Logo / Wordmark */}
        <Link
          href="/"
          className="flex items-center gap-1 font-mono text-2xl font-bold tracking-tighter text-[#111111] uppercase select-none hover:opacity-85 transition-opacity"
        >
          <span>Six</span>
          <span className="text-neutral-400 font-light">&</span>
          <span>7</span>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden lg:flex items-center gap-7">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-[13px] font-medium tracking-wide uppercase text-neutral-600 hover:text-[#111111] transition-colors"
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Action Affordances (Search, Wishlist, Account, Cart) */}
        <div className="flex items-center gap-3 sm:gap-4">
          <button
            type="button"
            onClick={() => setSearchOpen(!searchOpen)}
            className="p-2 text-neutral-700 hover:text-black transition-colors"
            aria-label="Search collection"
          >
            <Search className="w-5 h-5 stroke-[1.5]" />
          </button>

          <Link
            href="/account"
            className="hidden sm:inline-flex p-2 text-neutral-700 hover:text-black transition-colors"
            aria-label="Account profile"
          >
            <User className="w-5 h-5 stroke-[1.5]" />
          </Link>

          <Link
            href="/wishlist"
            className="hidden sm:inline-flex p-2 text-neutral-700 hover:text-black transition-colors"
            aria-label="Saved items"
          >
            <Heart className="w-5 h-5 stroke-[1.5]" />
          </Link>

          <button
            type="button"
            className="relative p-2 text-neutral-900 hover:text-black transition-colors"
            aria-label="Shopping bag"
          >
            <ShoppingBag className="w-5 h-5 stroke-[1.5]" />
            <span className="absolute top-1 right-1 w-4 h-4 text-[10px] font-mono font-bold bg-[#111111] text-white rounded-full flex items-center justify-center">
              2
            </span>
          </button>
        </div>
      </nav>

      {/* Expandable Search Overlay Affordance */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden bg-white border-b border-neutral-200"
          >
            <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-3">
              <Search className="w-5 h-5 text-neutral-400 stroke-[1.5]" />
              <input
                type="text"
                placeholder="Search models, colorways, collections (e.g. Phantom Low, Bio-Foam)..."
                className="w-full text-sm font-sans bg-transparent focus:outline-none placeholder:text-neutral-400 text-neutral-900"
                autoFocus
              />
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                className="text-xs uppercase tracking-widest text-neutral-500 hover:text-black p-1"
              >
                Close
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Drawer Navigation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black z-50 lg:hidden"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              className="fixed inset-y-0 left-0 w-4/5 max-w-sm bg-[#FBFBFB] z-50 p-6 flex flex-col justify-between border-r border-neutral-200 shadow-2xl lg:hidden"
            >
              <div>
                <div className="flex items-center justify-between pb-6 border-b border-neutral-200">
                  <span className="font-mono text-xl font-bold tracking-tighter uppercase">
                    Six<span className="text-neutral-400 font-light">&</span>7
                  </span>
                  <button
                    type="button"
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-1 text-neutral-600 hover:text-black"
                  >
                    <X className="w-6 h-6 stroke-[1.5]" />
                  </button>
                </div>

                <div className="flex flex-col gap-5 mt-8">
                  {NAV_LINKS.map((link) => (
                    <Link
                      key={link.name}
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-base font-medium tracking-wide uppercase text-neutral-800 hover:text-black transition-colors"
                    >
                      {link.name}
                    </Link>
                  ))}
                </div>
              </div>

              <div className="pt-6 border-t border-neutral-200 flex flex-col gap-4 text-sm text-neutral-600">
                <Link
                  href="/account"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 uppercase text-xs tracking-wider"
                >
                  <User className="w-4 h-4" /> Account & Orders
                </Link>
                <Link
                  href="/wishlist"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 uppercase text-xs tracking-wider"
                >
                  <Heart className="w-4 h-4" /> Wishlist (0)
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
