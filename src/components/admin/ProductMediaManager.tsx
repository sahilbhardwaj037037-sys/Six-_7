"use client";

import { useState, useRef, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  uploadProductMedia,
  deleteProductMedia,
  setMainProductMedia,
} from "@/lib/actions/admin-media";

export interface ProductMediaItem {
  id: string;
  url: string;
  altText: string | null;
  isMain: boolean;
  order: number;
  variantId?: string | null;
  variant?: {
    id: string;
    sku: string;
    color: string;
    size: string;
  } | null;
}

interface ProductMediaManagerProps {
  productId: string;
  variantId?: string;
  media: ProductMediaItem[];
  variants?: {
    id: string;
    sku: string;
    color: string;
    size: string;
  }[];
}

export function ProductMediaManager({
  productId,
  variantId,
  media,
  variants = [],
}: ProductMediaManagerProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [altText, setAltText] = useState("");
  const [targetVariantId, setTargetVariantId] = useState(variantId || "");
  const [isMainChecked, setIsMainChecked] = useState(media.length === 0);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, startUploadTransition] = useTransition();
  const [isMutating, startMutatingTransition] = useTransition();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file (JPEG, PNG, WebP, or GIF).");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image file exceeds the 5MB size limit.");
      return;
    }

    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    if (!altText) {
      setAltText(file.name.replace(/\.[^/.]+$/, ""));
    }
  };

  const handleClearSelection = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setSelectedFile(null);
    setPreviewUrl(null);
    setAltText("");
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleUpload = () => {
    if (!selectedFile) return;
    setError(null);

    const formData = new FormData();
    formData.append("productId", productId);
    if (targetVariantId) {
      formData.append("variantId", targetVariantId);
    }
    formData.append("altText", altText);
    formData.append("isMain", isMainChecked ? "true" : "false");
    formData.append("file", selectedFile);

    startUploadTransition(async () => {
      const res = await uploadProductMedia(formData);
      if (!res.success) {
        setError(res.error || "Failed to upload image.");
      } else {
        handleClearSelection();
        router.refresh();
      }
    });
  };

  const handleDelete = (mediaId: string) => {
    if (!confirm("Are you sure you want to remove this image?")) return;
    setError(null);

    startMutatingTransition(async () => {
      const res = await deleteProductMedia(productId, mediaId);
      if (!res.success) {
        setError(res.error || "Failed to delete image.");
      } else {
        router.refresh();
      }
    });
  };

  const handleSetMain = (mediaId: string) => {
    setError(null);

    startMutatingTransition(async () => {
      const res = await setMainProductMedia(productId, mediaId);
      if (!res.success) {
        setError(res.error || "Failed to set main image.");
      } else {
        router.refresh();
      }
    });
  };

  return (
    <div className="space-y-6">
      {error && (
        <div className="p-3 text-sm text-red-800 bg-red-50 border border-red-200 rounded-sm">
          {error}
        </div>
      )}

      {/* Upload Zone */}
      <div className="border border-dashed border-gray-300 rounded-sm p-6 bg-gray-50 flex flex-col items-center justify-center text-center">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          className="hidden"
          id={`native-file-picker-${productId}-${variantId || "base"}`}
          onChange={handleFileChange}
        />

        {!selectedFile ? (
          <div className="space-y-3">
            <label
              htmlFor={`native-file-picker-${productId}-${variantId || "base"}`}
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-sm text-gray-700 bg-white hover:bg-gray-100 cursor-pointer transition-colors"
            >
              Choose Image from Computer / Gallery
            </label>
            <p className="text-xs text-gray-500">
              Supports JPEG, PNG, WebP, GIF (Max 5MB)
            </p>
          </div>
        ) : (
          <div className="w-full max-w-lg space-y-4 text-left bg-white p-4 rounded-sm border border-gray-200">
            <div className="flex items-center gap-4">
              {previewUrl && (
                <img
                  src={previewUrl}
                  alt="Selected Preview"
                  className="w-20 h-20 object-cover rounded-sm border border-gray-200"
                />
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {selectedFile.name}
                </p>
                <p className="text-xs text-gray-500">
                  {(selectedFile.size / 1024).toFixed(1)} KB
                </p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700">Alt Text</label>
              <input
                type="text"
                value={altText}
                onChange={(e) => setAltText(e.target.value)}
                placeholder="Product description for accessibility"
                className="mt-1 block w-full rounded-sm border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-xs px-2.5 py-1.5 border"
              />
            </div>

            {!variantId && variants.length > 0 && (
              <div>
                <label className="block text-xs font-medium text-gray-700">Attach to Variant (Optional)</label>
                <select
                  value={targetVariantId}
                  onChange={(e) => setTargetVariantId(e.target.value)}
                  className="mt-1 block w-full rounded-sm border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-xs px-2.5 py-1.5 border bg-white"
                >
                  <option value="">All Variants (Product Level)</option>
                  {variants.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.sku} — {v.color} / {v.size}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="flex items-center">
              <input
                type="checkbox"
                id="isMainCheckbox"
                checked={isMainChecked}
                onChange={(e) => setIsMainChecked(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-black focus:ring-black"
              />
              <label htmlFor="isMainCheckbox" className="ml-2 block text-xs font-medium text-gray-700">
                Set as Main Product Image
              </label>
            </div>

            <div className="flex items-center justify-end space-x-3 pt-2 border-t border-gray-100">
              <button
                type="button"
                onClick={handleClearSelection}
                disabled={isUploading}
                className="px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-sm text-gray-700 bg-white hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleUpload}
                disabled={isUploading}
                className="px-4 py-1.5 bg-black text-white text-xs font-medium rounded-sm hover:bg-gray-800 disabled:opacity-50 transition-colors"
              >
                {isUploading ? "Uploading..." : "Save Image"}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Existing Media Gallery */}
      <div>
        <h4 className="text-xs font-semibold text-gray-900 uppercase tracking-wider mb-3">
          Existing Media ({media.length})
        </h4>

        {media.length === 0 ? (
          <p className="text-sm text-gray-500 italic py-4">
            No images uploaded yet. Use the picker above to add photos.
          </p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {media.map((item) => (
              <div
                key={item.id}
                className="group relative border border-gray-200 rounded-sm overflow-hidden bg-gray-50 flex flex-col"
              >
                <div className="aspect-[4/5] relative w-full bg-gray-100 overflow-hidden">
                  <img
                    src={item.url}
                    alt={item.altText || "Product photo"}
                    className="w-full h-full object-cover"
                  />
                  {item.isMain && (
                    <span className="absolute top-2 left-2 bg-black text-white text-[10px] font-mono px-2 py-0.5 rounded-sm uppercase tracking-wider shadow-sm">
                      Main
                    </span>
                  )}
                  {item.variant && (
                    <span className="absolute bottom-2 left-2 bg-white/90 backdrop-blur-sm text-gray-800 text-[10px] font-mono px-1.5 py-0.5 rounded-sm border border-gray-200 shadow-sm truncate max-w-[90%]">
                      {item.variant.sku}
                    </span>
                  )}
                </div>

                <div className="p-2 bg-white flex items-center justify-between border-t border-gray-100 text-xs">
                  {!item.isMain ? (
                    <button
                      type="button"
                      onClick={() => handleSetMain(item.id)}
                      disabled={isMutating}
                      className="text-gray-600 hover:text-black font-medium hover:underline text-[11px]"
                    >
                      Set Main
                    </button>
                  ) : (
                    <span className="text-gray-400 text-[11px]">Primary</span>
                  )}

                  <button
                    type="button"
                    onClick={() => handleDelete(item.id)}
                    disabled={isMutating}
                    className="text-red-600 hover:text-red-800 font-medium hover:underline text-[11px]"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
