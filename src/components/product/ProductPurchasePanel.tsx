"use client";

import { useState, useMemo } from "react";
import { Heart, Check, Ruler } from "lucide-react";
import { ShopProduct } from "@/data/mock-products";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";

interface ProductPurchasePanelProps {
  product: ShopProduct & {
    availableSizes?: { size: string; available: boolean; colorHex: string | null }[];
  };
}

export function ProductPurchasePanel({ product }: ProductPurchasePanelProps) {
  const { addItem } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [sizeError, setSizeError] = useState(false);
  const wishlisted = isInWishlist(product.id);
  const [isAdded, setIsAdded] = useState(false);
  const [showSizeGuide, setShowSizeGuide] = useState(false);

  const handleAddToBag = () => {
    if (!selectedSize) {
      setSizeError(true);
      return;
    }
    setSizeError(false);
    addItem({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      imageUrl: product.imageUrl,
      price: product.price,
      size: selectedSize,
      colorIndex: selectedColorIndex,
      colorHex: product.colorways?.[selectedColorIndex],
      quantity: 1,
    });
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
    }, 2200);
  };

  // Dynamically filter actual DB sizes based on the selected colorway
  const currentSizes = useMemo(() => {
    if (!product.availableSizes) return [];
    const selectedColorHex = product.colorways?.[selectedColorIndex];
    
    return product.availableSizes.filter(s => 
      !selectedColorHex || s.colorHex === selectedColorHex
    );
  }, [product.availableSizes, product.colorways, selectedColorIndex]);

  return (
    <div className="flex flex-col space-y-7">
      {/* Colorway Selection */}
      {product.colorways && product.colorways.length > 0 && (
        <div className="space-y-2.5">
          <div className="flex justify-between text-xs tracking-wider uppercase font-mono">
            <span className="text-neutral-500">Color Palette</span>
            <span className="text-neutral-900 font-medium">Option {selectedColorIndex + 1} of {product.colorways.length}</span>
          </div>
          <div className="flex items-center gap-3">
            {product.colorways.map((hex, idx) => {
              const isSelected = idx === selectedColorIndex;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setSelectedColorIndex(idx);
                    setSelectedSize(null); // Reset size error/selection on color change
                    setSizeError(false);
                  }}
                  aria-label={`Select color option ${idx + 1}`}
                  className={`w-7 h-7 rounded-full transition-all relative flex items-center justify-center ${
                    isSelected ? "ring-2 ring-neutral-950 ring-offset-2 scale-105" : "hover:opacity-80 border border-neutral-300"
                  }`}
                  style={{ backgroundColor: hex }}
                >
                  {isSelected && (
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        hex.toLowerCase() === "#ffffff" || hex.toLowerCase() === "#fafafa" || hex.toLowerCase() === "#f5f5f7"
                          ? "bg-neutral-900"
                          : "bg-white"
                      }`}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Size Selection */}
      <div className="space-y-3">
        <div className="flex justify-between items-center text-xs tracking-wider uppercase font-mono">
          <span className={sizeError ? "text-red-600 font-semibold" : "text-neutral-500"}>
            {sizeError ? "Please Select a Size" : "Select Size"}
          </span>
          <button
            type="button"
            onClick={() => setShowSizeGuide(!showSizeGuide)}
            className="flex items-center gap-1.5 text-neutral-800 hover:text-neutral-500 underline underline-offset-4 cursor-pointer transition-colors"
          >
            <Ruler className="w-3.5 h-3.5" />
            <span>Size Guide</span>
          </button>
        </div>

        {showSizeGuide && (
          <div className="p-3 bg-neutral-50 border border-neutral-200 text-xs text-neutral-600 font-mono space-y-1">
            <p className="font-semibold text-neutral-900 uppercase">Sizing Advice</p>
            <p>Fits true to size. For wider feet or half-sizes, we recommend sizing up to the nearest full EU size.</p>
          </div>
        )}

        <div className="grid grid-cols-4 gap-2">
          {currentSizes.length > 0 ? (
            currentSizes.map((sizeObj) => {
              const isSelected = selectedSize === sizeObj.size;
              const isAvailable = sizeObj.available;

              return (
                <button
                  key={sizeObj.size}
                  type="button"
                  disabled={!isAvailable}
                  onClick={() => {
                    setSelectedSize(sizeObj.size);
                    if (sizeError) setSizeError(false);
                  }}
                  className={`py-3 text-center border text-xs font-mono uppercase transition-all ${
                    !isAvailable
                      ? "border-neutral-200 bg-neutral-100 text-neutral-400 cursor-not-allowed line-through"
                      : isSelected
                      ? "border-neutral-950 bg-neutral-950 text-white font-medium shadow-sm"
                      : "border-neutral-200 bg-white text-neutral-900 hover:border-neutral-400"
                  }`}
                >
                  <div className="text-sm font-medium">{sizeObj.size}</div>
                </button>
              );
            })
          ) : (
            <div className="col-span-4 py-4 text-center text-xs text-neutral-500 font-mono border border-dashed border-neutral-200">
              No sizes available for this option.
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={handleAddToBag}
          className={`flex-1 py-4 text-xs font-mono uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 ${
            isAdded
              ? "bg-neutral-800 text-white"
              : "bg-neutral-950 hover:bg-neutral-800 text-white cursor-pointer active:scale-[0.99]"
          }`}
        >
          {isAdded ? (
            <>
              <Check className="w-4 h-4 text-emerald-400" />
              <span>Added to Bag</span>
            </>
          ) : (
            <span>Add to Bag &bull; ${product.price}</span>
          )}
        </button>

        <button
          type="button"
          onClick={() =>
            toggleWishlist({
              productId: product.id,
              slug: product.slug,
              name: product.name,
              imageUrl: product.imageUrl,
              price: product.price,
              originalPrice: product.originalPrice,
              badge: product.badge,
            })
          }
          aria-label={wishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
          className="w-14 h-14 border border-neutral-300 flex items-center justify-center hover:border-neutral-950 transition-colors bg-white shrink-0 cursor-pointer"
        >
          <Heart
            className={`w-5 h-5 transition-colors ${
              wishlisted ? "fill-neutral-950 text-neutral-950" : "text-neutral-700"
            }`}
          />
        </button>
      </div>

      {/* Trust & Guarantee Micro-copy */}
      <div className="pt-2 border-t border-neutral-100 text-[11px] font-mono text-neutral-500 space-y-1">
        <p>&bull; Complimentary carbon-neutral shipping on domestic orders.</p>
        <p>&bull; 30-day effortless return and exchange privilege.</p>
      </div>
    </div>
  );
}
