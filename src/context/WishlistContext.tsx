"use client";

import React, { createContext, useContext, useEffect, useState, useMemo } from "react";

export interface WishlistItem {
  productId: string;
  slug: string;
  name: string;
  imageUrl: string;
  price: number;
  originalPrice?: number;
  badge?: string;
}

export type AddWishlistItemInput = WishlistItem;

interface WishlistContextType {
  items: WishlistItem[];
  isInWishlist: (productId: string) => boolean;
  toggleWishlist: (item: AddWishlistItemInput) => void;
  addToWishlist: (item: AddWishlistItemInput) => void;
  removeFromWishlist: (productId: string) => void;
  clearWishlist: () => void;
  totalWishlistItems: number;
  isHydrated: boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

const STORAGE_KEY = "six7_wishlist_state_v1";

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  // Hydrate wishlist from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setItems(parsed);
        }
      }
    } catch {
      // Fallback gracefully if storage is disabled or corrupt
    } finally {
      setIsHydrated(true);
    }
  }, []);

  // Save to localStorage when items update
  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Ignore quota or private-browsing errors
    }
  }, [items, isHydrated]);

  const isInWishlist = (productId: string) => {
    return items.some((item) => item.productId === productId);
  };

  const addToWishlist = (item: AddWishlistItemInput) => {
    setItems((prev) => {
      if (prev.some((existing) => existing.productId === item.productId)) {
        return prev;
      }
      return [item, ...prev];
    });
  };

  const removeFromWishlist = (productId: string) => {
    setItems((prev) => prev.filter((item) => item.productId !== productId));
  };

  const toggleWishlist = (item: AddWishlistItemInput) => {
    setItems((prev) => {
      const exists = prev.some((existing) => existing.productId === item.productId);
      if (exists) {
        return prev.filter((existing) => existing.productId !== item.productId);
      }
      return [item, ...prev];
    });
  };

  const clearWishlist = () => {
    setItems([]);
  };

  const totalWishlistItems = useMemo(() => items.length, [items]);

  return (
    <WishlistContext.Provider
      value={{
        items,
        isInWishlist,
        toggleWishlist,
        addToWishlist,
        removeFromWishlist,
        clearWishlist,
        totalWishlistItems,
        isHydrated,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist(): WishlistContextType {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
}
