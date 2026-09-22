"use client";

import React, { createContext, useContext, useEffect, useState, useMemo, useRef } from "react";
import { useSession } from "next-auth/react";
import {
  getUserCart,
  syncGuestCart,
  addCartItem,
  updateCartItemQuantity,
  removeCartItem,
  clearUserCart,
} from "@/lib/actions/cart";

export interface CartItem {
  id: string; // Composite key for guest, variantId for DB-backed items
  variantId?: string;
  productId: string;
  slug: string;
  name: string;
  imageUrl: string;
  price: number;
  size: string;
  colorIndex: number;
  colorHex?: string;
  quantity: number;
}

export interface AddItemInput {
  productId: string;
  slug: string;
  name: string;
  imageUrl: string;
  price: number;
  size: string;
  colorIndex: number;
  colorHex?: string;
  quantity?: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: AddItemInput) => Promise<{ success: boolean; error?: string }>;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
  isHydrated: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const STORAGE_KEY = "six7_cart_state_v1";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { status } = useSession();
  const [items, setItems] = useState<CartItem[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  // Synchronous mirror of state to avoid stale closure traps during rapid interactions
  const itemsRef = useRef<CartItem[]>([]);
  itemsRef.current = items;

  // Track operation sequence per variant/key to ignore out-of-order/stale rollbacks
  const variantVersionsRef = useRef<Map<string, number>>(new Map());

  // Per-variant promise chain to enforce strict sequential execution of server mutations
  const variantQueuesRef = useRef<Map<string, Promise<void>>>(new Map());

  // Global clear barrier promise to sequence clearUserCart relative to all variant mutations
  const clearBarrierRef = useRef<Promise<void>>(Promise.resolve());

  // Prevent duplicate sync attempts during identical auth sessions
  const syncAttemptedRef = useRef(false);

  // Helper to enqueue server mutations sequentially per variant/key, respecting the clear barrier
  const enqueueVariantMutation = <T = void>(key: string, task: () => Promise<T>): Promise<T> => {
    const previousPromise = variantQueuesRef.current.get(key) || Promise.resolve();
    const currentBarrier = clearBarrierRef.current;

    const taskPromise = Promise.all([previousPromise, currentBarrier]).then(task);

    const queueTrackingPromise = taskPromise
      .catch((err) => {
        console.error(`[Cart Queue Error] for item ${key}:`, err);
      })
      .finally(() => {
        if (variantQueuesRef.current.get(key) === queueTrackingPromise) {
          variantQueuesRef.current.delete(key);
        }
      });

    variantQueuesRef.current.set(key, queueTrackingPromise as Promise<void>);

    return taskPromise;
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

        // 1. Sync Guest LocalStorage to DB if items exist
        try {
          const stored = localStorage.getItem(STORAGE_KEY);
          if (stored) {
            const parsed = JSON.parse(stored);
            if (Array.isArray(parsed) && parsed.length > 0) {
              const guestPayload = parsed.map((item: CartItem) => ({
                productId: item.productId,
                size: item.size,
                colorHex: item.colorHex,
                colorIndex: item.colorIndex,
                quantity: item.quantity,
              }));

              const syncRes = await syncGuestCart(guestPayload);
              if (syncRes.error) {
                guestSyncSuccess = false;
              }
            }
          }
        } catch {
          guestSyncSuccess = false;
        }

        if (isCancelled) return;

        // 2. Fetch Authoritative DB Cart
        const dbRes = await getUserCart();

        if (isCancelled) return;

        if (dbRes.success && dbRes.items) {
          itemsRef.current = dbRes.items;
          setItems(dbRes.items);

          // 3. Clear storage only if both sync and load succeeded
          if (guestSyncSuccess) {
            localStorage.removeItem(STORAGE_KEY);
          }
        }

        setIsHydrated(true);
      };

      performSyncAndLoad();
    } else if (status === "unauthenticated") {
      syncAttemptedRef.current = false;

      // Rehydrate guest state from localStorage on mount or logout
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
      // Ignore quota or private-browsing errors
    }
  }, [items, isHydrated, status]);

  const addItem = async (input: AddItemInput): Promise<{ success: boolean; error?: string }> => {
    const qty = input.quantity && input.quantity > 0 ? input.quantity : 1;
    const guestId = `${input.productId}-${input.size}-${input.colorIndex}`;

    // Match existing item by guestId or matching composite product/variant keys
    const existingIndex = itemsRef.current.findIndex(
      (item) =>
        item.id === guestId ||
        (item.productId === input.productId &&
          item.size === input.size &&
          item.colorHex === input.colorHex)
    );

    const snapshot = [...itemsRef.current];
    let updated: CartItem[];
    let targetKey = guestId;

    if (existingIndex > -1) {
      const existing = itemsRef.current[existingIndex];
      targetKey = existing.variantId || existing.id;
      updated = itemsRef.current.map((item, index) =>
        index === existingIndex ? { ...item, quantity: item.quantity + qty } : item
      );
    } else {
      const newItem: CartItem = {
        id: guestId,
        productId: input.productId,
        slug: input.slug,
        name: input.name,
        imageUrl: input.imageUrl,
        price: input.price,
        size: input.size,
        colorIndex: input.colorIndex,
        colorHex: input.colorHex,
        quantity: qty,
      };
      updated = [...itemsRef.current, newItem];
    }

    // Advance version ticket for target item
    const currentVersion = (variantVersionsRef.current.get(targetKey) || 0) + 1;
    variantVersionsRef.current.set(targetKey, currentVersion);

    // Optimistic Update
    itemsRef.current = updated;
    setItems(updated);

    if (status === "authenticated") {
      return enqueueVariantMutation(targetKey, async () => {
        try {
          const res = await addCartItem({
            productId: input.productId,
            size: input.size,
            colorHex: input.colorHex,
            colorIndex: input.colorIndex,
            quantity: qty,
          });

          if (res.error) {
            // Revert only if no newer action touched this specific item
            if (variantVersionsRef.current.get(targetKey) === currentVersion) {
              itemsRef.current = snapshot;
              setItems(snapshot);
            }
            return { success: false, error: res.error };
          }

          // Fetch canonical data but TARGET ONLY this specific item to prevent
          // overwriting concurrent mutations on other variants
          try {
            const refreshed = await getUserCart();
            if (refreshed.success && refreshed.items) {
              const canonicalItem = refreshed.items.find(
                (dbItem) =>
                  dbItem.productId === input.productId &&
                  dbItem.size === input.size &&
                  (!input.colorHex || dbItem.colorHex === input.colorHex)
              );

              if (canonicalItem && variantVersionsRef.current.get(targetKey) === currentVersion) {
                // Update targetKey map tracking to canonical variantId
                if (canonicalItem.id !== targetKey) {
                  variantVersionsRef.current.set(canonicalItem.id, currentVersion);
                }

                const merged = itemsRef.current.map((item) => {
                  if (
                    item.id === targetKey ||
                    (item.productId === input.productId &&
                      item.size === input.size &&
                      item.colorHex === input.colorHex)
                  ) {
                    return {
                      ...item,
                      id: canonicalItem.id,
                      variantId: canonicalItem.id,
                      price: canonicalItem.price,
                      imageUrl: canonicalItem.imageUrl || item.imageUrl,
                      name: canonicalItem.name || item.name,
                    };
                  }
                  return item;
                });

                itemsRef.current = merged;
                setItems(merged);
              }
            }
          } catch (refreshErr) {
            console.error("[Cart Refresh Error]:", refreshErr);
          }

          return { success: true };
        } catch (err) {
          if (variantVersionsRef.current.get(targetKey) === currentVersion) {
            itemsRef.current = snapshot;
            setItems(snapshot);
          }
          return { success: false, error: "Failed to add item to cart." };
        }
      });
    }

    return { success: true };
  };

  const removeItem = (id: string) => {
    const targetItem = itemsRef.current.find((item) => item.id === id || item.variantId === id);
    if (!targetItem) return;

    const targetKey = targetItem.variantId || targetItem.id;
    const snapshot = [...itemsRef.current];

    // Advance version ticket
    const currentVersion = (variantVersionsRef.current.get(targetKey) || 0) + 1;
    variantVersionsRef.current.set(targetKey, currentVersion);

    // Optimistic Update
    const updated = itemsRef.current.filter((item) => item.id !== id && item.variantId !== id);
    itemsRef.current = updated;
    setItems(updated);

    if (status === "authenticated") {
      enqueueVariantMutation(targetKey, async () => {
        const res = await removeCartItem(targetKey);
        if (res.error && variantVersionsRef.current.get(targetKey) === currentVersion) {
          itemsRef.current = snapshot;
          setItems(snapshot);
        }
      });
    }
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id);
      return;
    }

    const targetItem = itemsRef.current.find((item) => item.id === id || item.variantId === id);
    if (!targetItem) return;

    const targetKey = targetItem.variantId || targetItem.id;
    const snapshot = [...itemsRef.current];

    // Advance version ticket
    const currentVersion = (variantVersionsRef.current.get(targetKey) || 0) + 1;
    variantVersionsRef.current.set(targetKey, currentVersion);

    // Optimistic Update
    const updated = itemsRef.current.map((item) =>
      item.id === id || item.variantId === id ? { ...item, quantity } : item
    );
    itemsRef.current = updated;
    setItems(updated);

    if (status === "authenticated") {
      enqueueVariantMutation(targetKey, async () => {
        const res = await updateCartItemQuantity(targetKey, quantity);
        if (res.error && variantVersionsRef.current.get(targetKey) === currentVersion) {
          itemsRef.current = snapshot;
          setItems(snapshot);
        }
      });
    }
  };

  const clearCart = async () => {
    const snapshot = [...itemsRef.current];
    if (snapshot.length === 0) return;

    // Invalidate versions for all active items
    const clearToken = Date.now();
    for (const item of snapshot) {
      const key = item.variantId || item.id;
      variantVersionsRef.current.set(key, clearToken);
    }

    // Optimistic Update
    itemsRef.current = [];
    setItems([]);

    if (status === "authenticated") {
      const pendingMutations = Array.from(variantQueuesRef.current.values());
      const previousBarrier = clearBarrierRef.current;

      const currentBarrier = (async () => {
        // Wait for prior barriers and queued mutations to resolve
        await Promise.allSettled([previousBarrier, ...pendingMutations]);

        const res = await clearUserCart();
        if (res.error) {
          // Restore items that haven't received a newer mutation
          const current = itemsRef.current;
          const currentIds = new Set(current.map((i) => i.variantId || i.id));
          const toReinsert = snapshot.filter((item) => {
            const key = item.variantId || item.id;
            return !currentIds.has(key) && variantVersionsRef.current.get(key) === clearToken;
          });
          const restored = [...toReinsert, ...current];
          itemsRef.current = restored;
          setItems(restored);
        }
      })();

      clearBarrierRef.current = currentBarrier;
      await currentBarrier;
    }
  };

  const totalItems = useMemo(
    () => items.reduce((acc, item) => acc + item.quantity, 0),
    [items]
  );

  const subtotal = useMemo(
    () => items.reduce((acc, item) => acc + item.price * item.quantity, 0),
    [items]
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalItems,
        subtotal,
        isHydrated,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextType {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
