"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart, Trash2, ArrowRight, ShoppingBag, ArrowLeft } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";
import { SHOP_PRODUCTS } from "@/data/mock-products";

export default function WishlistPage() {
  const { items, removeFromWishlist, clearWishlist, totalWishlistItems, isHydrated } = useWishlist();
  const { addItem } = useCart();
  const [movingId, setMovingId] = useState<string | null>(null);

  const handleMoveToCart = async (item: (typeof items)[number]) => {
    if (movingId) return;
    setMovingId(item.productId);

    try {
      const product = SHOP_PRODUCTS.find(
        (p) => p.id === item.productId || p.slug === item.slug
      );
      const defaultColorHex = product?.colorways?.[0];

      const result = await addItem({
        productId: item.productId,
        slug: item.slug,
        name: item.name,
        imageUrl: item.imageUrl,
        price: item.price,
        size: "10", // Canonical DB size for one-click move
        colorIndex: 0,
        colorHex: defaultColorHex,
        quantity: 1,
      });

      if (result.success) {
        removeFromWishlist(item.productId);
      }
    } finally {
      setMovingId(null);
    }
  };

  if (!isHydrated) {
    return (
      <div className="min-h-screen flex flex-col bg-[#FBFBFB] text-[#111111]">
        <Navbar />
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-16 flex items-center justify-center">
          <div className="text-xs font-mono text-neutral-400 uppercase tracking-widest animate-pulse">
            Loading Wishlist...
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
        {/* Header */}
        <div className="border-b border-neutral-200 pb-6 mb-8 sm:mb-12 flex flex-col sm:flex-row sm:items-baseline justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-light tracking-tight text-neutral-950 uppercase font-mono">
              Wishlist
            </h1>
            <p className="text-xs text-neutral-500 font-mono mt-1">
              {totalWishlistItems} {totalWishlistItems === 1 ? "Item" : "Items"} saved
            </p>
          </div>

          <div className="flex items-center gap-6">
            {totalWishlistItems > 0 && (
              <button
                type="button"
                onClick={clearWishlist}
                className="text-xs font-mono text-neutral-500 hover:text-neutral-900 uppercase tracking-wider transition-colors cursor-pointer"
              >
                Clear All
              </button>
            )}
            <Link
              href="/shop"
              className="inline-flex items-center gap-1.5 text-xs font-mono text-neutral-600 hover:text-neutral-950 uppercase tracking-wider transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Continue Shopping
            </Link>
          </div>
        </div>

        {/* Empty State */}
        {items.length === 0 ? (
          <div className="py-20 sm:py-28 text-center max-w-md mx-auto">
            <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center mx-auto mb-6 text-neutral-400">
              <Heart className="w-7 h-7 stroke-[1.2]" />
            </div>
            <h2 className="text-lg font-light uppercase tracking-wide font-mono text-neutral-900 mb-2">
              Your wishlist is empty
            </h2>
            <p className="text-sm text-neutral-500 mb-8 leading-relaxed">
              Explore our architectural footwear editions and save your preferred silhouettes for later.
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-neutral-950 text-white text-xs font-mono tracking-widest uppercase hover:bg-neutral-800 transition-colors"
            >
              <span>Explore Collection</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        ) : (
          /* Wishlist Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
            {items.map((item) => (
              <div
                key={item.productId}
                className="group flex flex-col border border-neutral-200/70 bg-white hover:border-neutral-300 transition-colors overflow-hidden"
              >
                {/* Image */}
                <div className="relative aspect-[4/5] w-full bg-[#F5F5F5] overflow-hidden">
                  <Link href={`/product/${item.slug}`} className="relative block w-full h-full">
                    <Image
                      src={item.imageUrl}
                      alt={item.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                  </Link>

                  {item.badge && (
                    <span className="absolute top-3 left-3 text-[10px] font-mono tracking-widest uppercase bg-white/95 text-neutral-900 px-2 py-0.5 border border-neutral-200 pointer-events-none z-10">
                      {item.badge}
                    </span>
                  )}

                  <button
                    type="button"
                    onClick={() => removeFromWishlist(item.productId)}
                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-neutral-500 hover:text-red-600 hover:bg-white transition-all shadow-sm z-10 cursor-pointer"
                    aria-label={`Remove ${item.name} from wishlist`}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Details */}
                <div className="p-4 flex flex-col flex-1 justify-between gap-4">
                  <div>
                    <Link
                      href={`/product/${item.slug}`}
                      className="block text-sm font-medium text-neutral-900 hover:underline line-clamp-1"
                    >
                      {item.name}
                    </Link>
                    <div className="mt-1 flex items-baseline gap-2 font-mono text-sm">
                      <span className="text-neutral-950">${item.price}</span>
                      {item.originalPrice && item.originalPrice > item.price && (
                        <span className="text-xs text-neutral-400 line-through">
                          ${item.originalPrice}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-neutral-100">
                    <button
                      type="button"
                      disabled={movingId === item.productId}
                      onClick={() => handleMoveToCart(item)}
                      className="w-full py-2.5 px-3 bg-neutral-950 text-white hover:bg-neutral-800 disabled:opacity-50 text-[11px] font-mono tracking-wider uppercase flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>{movingId === item.productId ? "Moving..." : "Move to Bag"}</span>
                    </button>
                    <Link
                      href={`/product/${item.slug}`}
                      className="w-full py-2 px-3 border border-neutral-200 text-neutral-700 hover:border-neutral-900 hover:text-neutral-950 text-[11px] font-mono tracking-wider uppercase flex items-center justify-center transition-colors text-center"
                    >
                      View Silhouette
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
