"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Search, ShoppingBag, User, Heart, Menu, X, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { MEGA_MENU_DATA, MegaMenuContent } from "@/data/mega-menu-data";
import { MegaMenu } from "./MegaMenu";
import { useCart } from "@/context/CartContext";

const PRIMARY_LINKS = [
  { name: "Home", href: "/" },
  { name: "Shop", href: "/shop", hasMegaMenu: true },
  { name: "Men", href: "/men", hasMegaMenu: true },
  { name: "Women", href: "/women", hasMegaMenu: true },
  { name: "Kids", href: "/kids", hasMegaMenu: true },
  { name: "Sports", href: "/sports", hasMegaMenu: true },
  { name: "New Arrivals", href: "/new-arrivals", hasMegaMenu: true },
  { name: "Best Sellers", href: "/best-sellers", hasMegaMenu: true },
  { name: "Offers", href: "/offers", hasMegaMenu: true },
];

export function Navbar() {
  const { totalItems, isHydrated } = useCart();
  const [activeMenuKey, setActiveMenuKey] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileExpandedSection, setMobileExpandedSection] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = (key: string) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    if (MEGA_MENU_DATA[key]) {
      setActiveMenuKey(key);
    } else {
      setActiveMenuKey(null);
    }
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      setActiveMenuKey(null);
    }, 180);
  };

  const handleMenuClose = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setActiveMenuKey(null);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleMenuClose();
        setSearchOpen(false);
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const activeContent: MegaMenuContent | null = activeMenuKey
    ? MEGA_MENU_DATA[activeMenuKey] || null
    : null;

  return (
    <header
      className="sticky top-0 z-50 bg-[#FBFBFB]/95 backdrop-blur-md border-b border-neutral-200/80 transition-all"
      onMouseLeave={handleMouseLeave}
    >
      {/* Top Banner Announcement */}
      <div className="bg-[#111111] text-[#FBFBFB] text-[11px] font-mono tracking-widest uppercase py-2 px-4 text-center">
        <span>Complimentary Express Delivery on Global Orders Over $300</span>
      </div>

      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between relative">
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
          onClick={handleMenuClose}
          className="flex items-center gap-1 font-mono text-2xl font-bold tracking-tighter text-[#111111] uppercase select-none hover:opacity-85 transition-opacity"
        >
          <span>Six</span>
          <span className="text-neutral-400 font-light">&</span>
          <span>7</span>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden lg:flex items-center gap-6 xl:gap-7 h-full">
          {PRIMARY_LINKS.map((link) => {
            const isActive = activeMenuKey === link.name;
            return (
              <div
                key={link.name}
                className="h-full flex items-center"
                onMouseEnter={() => handleMouseEnter(link.name)}
              >
                <Link
                  href={link.href}
                  className={`relative text-[13px] font-medium tracking-wide uppercase transition-colors py-2 ${
                    isActive ? "text-neutral-950 font-semibold" : "text-neutral-600 hover:text-[#111111]"
                  }`}
                >
                  {link.name}
                  {isActive && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="absolute bottom-0 left-0 right-0 h-[2px] bg-neutral-950"
                      transition={{ duration: 0.15 }}
                    />
                  )}
                </Link>
              </div>
            );
          })}
        </div>

        {/* Action Affordances (Search, Wishlist, Account, Cart) */}
        <div className="flex items-center gap-3 sm:gap-4">
          <button
            type="button"
            onClick={() => {
              setSearchOpen(!searchOpen);
              handleMenuClose();
            }}
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

          <Link
            href="/cart"
            className="relative p-2 text-neutral-900 hover:text-black transition-colors"
            aria-label="Shopping bag"
          >
            <ShoppingBag className="w-5 h-5 stroke-[1.5]" />
            {isHydrated && totalItems > 0 && (
              <span className="absolute top-1 right-1 min-w-4 h-4 px-1 text-[10px] font-mono font-bold bg-[#111111] text-white rounded-full flex items-center justify-center">
                {totalItems > 99 ? "99+" : totalItems}
              </span>
            )}
          </Link>
        </div>
      </nav>

      {/* Desktop Mega-Menu Panel */}
      <AnimatePresence>
        {activeContent && (
          <div
            onMouseEnter={() => {
              if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
              }
            }}
            onMouseLeave={handleMouseLeave}
          >
            <MegaMenu content={activeContent} onClose={handleMenuClose} />
          </div>
        )}
      </AnimatePresence>

      {/* Expandable Search Drawer */}
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

      {/* Mobile Accordion Drawer */}
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
              transition={{ type: "tween", duration: 0.25 }}
              className="fixed inset-y-0 left-0 w-4/5 max-w-sm bg-[#FBFBFB] z-50 p-6 flex flex-col justify-between border-r border-neutral-200 shadow-2xl lg:hidden overflow-y-auto"
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

                {/* Mobile Navigation with Accordions */}
                <div className="flex flex-col divide-y divide-neutral-200/70 mt-6">
                  {PRIMARY_LINKS.map((link) => {
                    const menuData = MEGA_MENU_DATA[link.name];
                    const isExpanded = mobileExpandedSection === link.name;

                    if (!menuData) {
                      return (
                        <div key={link.name} className="py-3">
                          <Link
                            href={link.href}
                            onClick={() => setMobileMenuOpen(false)}
                            className="text-sm font-medium tracking-wide uppercase text-neutral-800 hover:text-black"
                          >
                            {link.name}
                          </Link>
                        </div>
                      );
                    }

                    return (
                      <div key={link.name} className="py-3">
                        <button
                          type="button"
                          onClick={() =>
                            setMobileExpandedSection(isExpanded ? null : link.name)
                          }
                          className="w-full flex items-center justify-between text-left text-sm font-medium tracking-wide uppercase text-neutral-800 hover:text-black"
                        >
                          <span>{link.name}</span>
                          <ChevronDown
                            className={`w-4 h-4 text-neutral-400 transition-transform duration-200 ${
                              isExpanded ? "rotate-180" : ""
                            }`}
                          />
                        </button>

                        <AnimatePresence>
                          {isExpanded && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="overflow-hidden pl-3 pt-3 flex flex-col gap-3"
                            >
                              <Link
                                href={link.href}
                                onClick={() => setMobileMenuOpen(false)}
                                className="text-xs font-mono uppercase tracking-wider text-neutral-900 font-semibold underline underline-offset-4"
                              >
                                View All {link.name}
                              </Link>
                              {menuData.sections.flatMap((sec) => sec.items).map((item, idx) => (
                                <Link
                                  key={idx}
                                  href={item.href}
                                  onClick={() => setMobileMenuOpen(false)}
                                  className="text-xs font-light text-neutral-600 hover:text-black flex items-center justify-between pr-2"
                                >
                                  <span>{item.name}</span>
                                  {item.badge && (
                                    <span className="text-[9px] font-mono uppercase px-1.5 py-0.2 bg-neutral-200 text-neutral-800">
                                      {item.badge}
                                    </span>
                                  )}
                                </Link>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Bottom Drawer Actions */}
              <div className="pt-6 mt-6 border-t border-neutral-200 flex flex-col gap-4 text-sm text-neutral-600">
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
