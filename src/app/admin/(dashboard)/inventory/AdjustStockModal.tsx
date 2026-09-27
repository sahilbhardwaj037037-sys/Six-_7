"use client";

import { useState, useTransition } from "react";
import { updateInventoryQuantity } from "@/lib/actions/admin-inventory";

interface AdjustStockModalProps {
  variantId: string;
  productName: string;
  sku: string;
  size: string;
  color: string;
  currentQuantity: number;
  reserved: number;
}

export function AdjustStockModal({
  variantId,
  productName,
  sku,
  size,
  color,
  currentQuantity,
  reserved,
}: AdjustStockModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [quantity, setQuantity] = useState(currentQuantity);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleOpen = () => {
    setQuantity(currentQuantity);
    setError(null);
    setIsOpen(true);
  };

  const handleClose = () => {
    if (isPending) return;
    setError(null);
    setIsOpen(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    startTransition(async () => {
      const res = await updateInventoryQuantity(variantId, Number(quantity));
      if (res?.success) {
        setIsOpen(false);
      } else {
        setError(res?.error || "Failed to update inventory quantity.");
      }
    });
  };

  return (
    <>
      <button
        type="button"
        onClick={handleOpen}
        className="text-xs font-medium text-gray-700 bg-white hover:bg-gray-50 border border-gray-300 rounded px-2.5 py-1.5 shadow-sm transition-colors"
      >
        Adjust
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 space-y-4 text-left">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-lg font-semibold text-gray-900">Adjust Stock</h3>
              <button
                type="button"
                onClick={handleClose}
                disabled={isPending}
                className="text-gray-400 hover:text-gray-500 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="bg-gray-50 rounded p-3 text-xs space-y-1.5 text-gray-600">
              <div>
                <strong className="text-gray-800">Product:</strong> {productName}
              </div>
              <div>
                <strong className="text-gray-800">SKU:</strong> {sku}
              </div>
              <div>
                <strong className="text-gray-800">Size / Color:</strong> {size} / {color}
              </div>
              <div className="flex items-center justify-between pt-1 border-t border-gray-200 mt-2">
                <span>
                  Current Stock: <strong className="text-gray-900">{currentQuantity}</strong>
                </span>
                <span>
                  Reserved: <strong className="text-gray-900">{reserved}</strong>
                </span>
              </div>
            </div>

            {error && (
              <div className="p-3 text-xs text-red-800 bg-red-50 border border-red-200 rounded">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor={`qty-${variantId}`} className="block text-xs font-medium text-gray-700 mb-1">
                  New Quantity
                </label>
                <input
                  id={`qty-${variantId}`}
                  type="number"
                  step="1"
                  min={reserved}
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value === "" ? 0 : Number(e.target.value))}
                  disabled={isPending}
                  required
                  className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                />
                <p className="text-[11px] text-gray-500 mt-1">
                  Must be at least {reserved} to cover reserved stock.
                </p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={handleClose}
                  disabled={isPending}
                  className="text-xs font-medium text-gray-700 bg-white hover:bg-gray-50 border border-gray-300 rounded px-3 py-2 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="text-xs font-medium text-white bg-black hover:bg-gray-800 rounded px-4 py-2 transition-colors disabled:opacity-50"
                >
                  {isPending ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
