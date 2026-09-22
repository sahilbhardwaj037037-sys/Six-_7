"use client";

import React, { createContext, useContext, useEffect, useState, useMemo, useRef } from "react";
import { useSession } from "next-auth/react";
import {
  getUserWishlist,
  syncGuestWishlist,
  addWishlistItem,
  removeWishlistItem,
  clearUserWishlist,
} from "@/lib/actions/wishlist";

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
  const { status } = useSession();
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  // Synchronous mirror of state to avoid stale closures in rapid user clicks
  const itemsRef = useRef<WishlistItem[]>([]);
  itemsRef.current = items;

  // Track operation sequence per product to safely ignore out-of-order/stale rollbacks
  const productVersionsRef = useRef<Map<string, number>>(new Map());

  // Per-product promise chain to enforce strict sequential execution of server mutations
  const productQueuesRef = useRef<Map<string, Promise<void>>>(new Map());

  // Global clear barrier promise to sequence clearUserWishlist relative to all product mutations
  const clearBarrierRef = useRef<Promise<void>>(Promise.resolve());

  // Prevent duplicate sync calls during identical auth sessions
  const syncAttemptedRef = useRef(false);

  // Helper to enqueue server mutations sequentially per productId, respecting the clear barrier
  const enqueueProductMutation = (productId: string, task: () => Promise<void>) => {
    const previousPromise = productQueuesRef.current.get(productId) || Promise.resolve();
    const currentBarrier = clearBarrierRef.current;

    // Both the product's prior mutations AND any active clear barrier must resolve before executing
    const nextPromise = Promise.all([previousPromise, currentBarrier])
      .then(task)
      .catch((err) => {
        console.error(`[Wishlist Queue Error] for product ${productId}:`, err);
      })
      .finally(() => {
        // Clean up map entry when this tail promise finishes
        if (productQueuesRef.current.get(productId) === nextPromise) {
          productQueuesRef.current.delete(productId);
        }
      });

    productQueuesRef.current.set(productId, nextPromise);
  };

  // 1. Auth & Hydration Sync with Cancellation Guard
  useEffect(() => {
    let isCancelled = false;

    if (status === "loading") return;

    if (status === "authenticated") {
      if (syncAttemptedRef.current) return;
      syncAttemptedRef.current = true;

      const performSyncAndLoad = async () => {
        let guestSyncSuccess = true;

        try {
          const stored = localStorage.getItem(STORAGE_KEY);
          if (stored) {
            const parsed = JSON.parse(stored);
            if (Array.isArray(parsed) && parsed.length > 0) {
              const productIds = parsed.map((item: WishlistItem) => item.productId);
              const syncRes = await syncGuestWishlist(productIds);
              if (syncRes.error) guestSyncSuccess = false;
            }
          }
        } catch {
          guestSyncSuccess = false;
        }

        if (isCancelled) return;

        const dbRes = await getUserWishlist();

        if (isCancelled) return;

        if (dbRes.success && dbRes.items) {
          itemsRef.current = dbRes.items;
          setItems(dbRes.items);

          if (guestSyncSuccess) {
            localStorage.removeItem(STORAGE_KEY);
          }
        }

        setIsHydrated(true);
      };

      performSyncAndLoad();
    } else if (status === "unauthenticated") {
      syncAttemptedRef.current = false;

      // Rehydrate guest state from localStorage upon logout or initial guest load
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) {
            itemsRef.current = parsed;
            setItems(parsed);
          } else {
            itemsRef.current = [];
            setItems([]);
          }
        } else {
          itemsRef.current = [];
          setItems([]);
        }
      } catch {
        itemsRef.current = [];
        setItems([]);
      } finally {
        if (!isCancelled) {
          setIsHydrated(true);
        }
      }
    }

    return () => {
      isCancelled = true;
    };
  }, [status]);

  // 2. Persistent Guest Storage Effect
  useEffect(() => {
    if (!isHydrated || status !== "unauthenticated") return;

    try {
      if (items.length === 0) {
        localStorage.removeItem(STORAGE_KEY);
      } else {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
      }
    } catch {
      // Ignore storage errors in restricted contexts
    }
  }, [items, isHydrated, status]);

  const isInWishlist = (productId: string) => {
    return items.some((item) => item.productId === productId);
  };

  const addToWishlist = async (item: AddWishlistItemInput) => {
    // Check synchronously against ref
    if (itemsRef.current.some((existing) => existing.productId === item.productId)) {
      return;
    }

    // Advance version ticket for this item
    const currentVersion = (productVersionsRef.current.get(item.productId) || 0) + 1;
    productVersionsRef.current.set(item.productId, currentVersion);

    // Optimistic Update
    const updated = [item, ...itemsRef.current];
    itemsRef.current = updated;
    setItems(updated);

    if (status === "authenticated") {
      enqueueProductMutation(item.productId, async () => {
        const res = await addWishlistItem(item.productId);
        // Discard rollback if another action already occurred on this product
        if (res.error && productVersionsRef.current.get(item.productId) === currentVersion) {
          const reverted = itemsRef.current.filter((i) => i.productId !== item.productId);
          itemsRef.current = reverted;
          setItems(reverted);
        }
      });
    }
  };

  const removeFromWishlist = async (productId: string) => {
    const itemToRestore = itemsRef.current.find((i) => i.productId === productId);
    if (!itemToRestore) return;

    // Advance version ticket
    const currentVersion = (productVersionsRef.current.get(productId) || 0) + 1;
    productVersionsRef.current.set(productId, currentVersion);

    // Optimistic Update
    const updated = itemsRef.current.filter((item) => item.productId !== productId);
    itemsRef.current = updated;
    setItems(updated);

    if (status === "authenticated") {
      enqueueProductMutation(productId, async () => {
        const res = await removeWishlistItem(productId);
        // Discard rollback if user triggered a subsequent operation
        if (res.error && productVersionsRef.current.get(productId) === currentVersion) {
          const reverted = itemsRef.current.some((i) => i.productId === productId)
            ? itemsRef.current
            : [itemToRestore, ...itemsRef.current];
          itemsRef.current = reverted;
          setItems(reverted);
        }
      });
    }
  };

  const toggleWishlist = async (item: AddWishlistItemInput) => {
    // Evaluate existence against synchronous ref
    const isRemoving = itemsRef.current.some((existing) => existing.productId === item.productId);

    // Advance version ticket
    const currentVersion = (productVersionsRef.current.get(item.productId) || 0) + 1;
    productVersionsRef.current.set(item.productId, currentVersion);

    // Optimistic Update
    const updated = isRemoving
      ? itemsRef.current.filter((existing) => existing.productId !== item.productId)
      : [item, ...itemsRef.current];
    itemsRef.current = updated;
    setItems(updated);

    if (status === "authenticated") {
      enqueueProductMutation(item.productId, async () => {
        const res = isRemoving
          ? await removeWishlistItem(item.productId)
          : await addWishlistItem(item.productId);

        // Safe rollback only if no newer mutation overtook this one
        if (res.error && productVersionsRef.current.get(item.productId) === currentVersion) {
          const reverted = isRemoving
            ? (itemsRef.current.some((i) => i.productId === item.productId) ? itemsRef.current : [item, ...itemsRef.current])
            : itemsRef.current.filter((i) => i.productId !== item.productId);
          itemsRef.current = reverted;
          setItems(reverted);
        }
      });
    }
  };

  const clearWishlist = async () => {
    const snapshot = [...itemsRef.current];
    if (snapshot.length === 0) return;

    // Invalidate all active item versions
    const clearToken = Date.now();
    for (const item of snapshot) {
      productVersionsRef.current.set(item.productId, clearToken);
    }

    // Optimistic Update
    itemsRef.current = [];
    setItems([]);

    if (status === "authenticated") {
      // Snapshot any currently in-flight product mutation promises and previous clear barrier
      const pendingProductMutations = Array.from(productQueuesRef.current.values());
      const previousBarrier = clearBarrierRef.current;

      // Construct and establish the new clear barrier immediately
      const currentBarrier = (async () => {
        // Wait for prior clear barriers AND prior product mutations to completely settle
        await Promise.allSettled([previousBarrier, ...pendingProductMutations]);

        const res = await clearUserWishlist();
        if (res.error) {
          // Roll back any item that hasn't received a newer mutation since clear was initiated
          const reverted = itemsRef.current;
          const currentIds = new Set(reverted.map((i) => i.productId));
          const itemsToReinsert = snapshot.filter(
            (item) => !currentIds.has(item.productId) && productVersionsRef.current.get(item.productId) === clearToken
          );
          const finalRestored = [...itemsToReinsert, ...reverted];
          itemsRef.current = finalRestored;
          setItems(finalRestored);
        }
      })();

      // Update the barrier ref; subsequent enqueueProductMutation calls will await this barrier
      clearBarrierRef.current = currentBarrier;
      await currentBarrier;
    }
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
