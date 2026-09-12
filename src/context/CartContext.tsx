"use client";

import React, { createContext, useContext, useEffect, useState, useMemo } from "react";

export interface CartItem {
  id: string; // Composite key: `${productId}-${size}-${colorIndex}`
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
  addItem: (item: AddItemInput) => void;
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
  const [items, setItems] = useState<CartItem[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  // Hydrate cart from localStorage on mount
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

  const addItem = (input: AddItemInput) => {
    const qty = input.quantity && input.quantity > 0 ? input.quantity : 1;
    const itemId = `${input.productId}-${input.size}-${input.colorIndex}`;

    setItems((prevItems) => {
      const existingIndex = prevItems.findIndex((item) => item.id === itemId);
      if (existingIndex > -1) {
        return prevItems.map((item, index) => {
          if (index === existingIndex) {
            return { ...item, quantity: item.quantity + qty };
          }
          return item;
        });
      }
      return [
        ...prevItems,
        {
          id: itemId,
          productId: input.productId,
          slug: input.slug,
          name: input.name,
          imageUrl: input.imageUrl,
          price: input.price,
          size: input.size,
          colorIndex: input.colorIndex,
          colorHex: input.colorHex,
          quantity: qty,
        },
      ];
    });
  };

  const removeItem = (id: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id);
      return;
    }
    setItems((prevItems) =>
      prevItems.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalItems = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items]
  );

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
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
