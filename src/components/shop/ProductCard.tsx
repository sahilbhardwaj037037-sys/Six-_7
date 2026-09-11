"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";
import { ShopProduct } from "@/data/mock-products";

interface ProductCardProps {
  product: ShopProduct;
}

export function ProductCard({ product }: ProductCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false);

  return (
    <div className="group flex flex-col">
      {/* Image Container */}
      <div className="relative aspect-[4/5] w-full bg-[#F5F5F5] overflow-hidden">
        <Link href={`/product/${product.slug}`} className="relative block w-full h-full">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
          />
        </Link>

        {/* Badge */}
        {product.badge && (
          <span className="absolute top-3 left-3 text-[10px] font-mono tracking-widest uppercase bg-white/95 text-neutral-900 px-2 py-0.5 border border-neutral-200 pointer-events-none z-10">
            {product.badge}
          </span>
        )}

        {/* Wishlist Button */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            setIsWishlisted(!isWishlisted);
          }}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-neutral-800 hover:text-black hover:bg-white transition-all shadow-sm z-10"
          aria-label={`Save ${product.name} to wishlist`}
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              isWishlisted ? "fill-neutral-900 text-neutral-900" : "text-neutral-600"
            }`}
          />
        </button>
      </div>

      {/* Product Details */}
      <div className="pt-4 flex flex-col flex-1 justify-between">
        <div>
          <div className="flex justify-between items-start gap-2">
            <p className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider">
              {product.category}
            </p>
            {/* Colorway Swatches */}
            <div className="flex items-center gap-1.5 mt-0.5">
              {product.colorways.map((color, idx) => (
                <span
                  key={idx}
                  className="w-2.5 h-2.5 rounded-full border border-neutral-300"
                  style={{ backgroundColor: color }}
                  title={`Colorway option ${idx + 1}`}
                />
              ))}
            </div>
          </div>

          <Link href={`/product/${product.slug}`}>
            <h3 className="text-sm font-medium text-neutral-900 mt-1 uppercase tracking-tight group-hover:text-neutral-500 transition-colors">
              {product.name}
            </h3>
          </Link>
        </div>

        {/* Price Row */}
        <div className="flex items-center gap-2 mt-2">
          <span className="font-mono text-sm text-neutral-950 font-medium">
            ${product.price}
          </span>
          {product.originalPrice && (
            <span className="font-mono text-xs text-neutral-400 line-through">
              ${product.originalPrice}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
