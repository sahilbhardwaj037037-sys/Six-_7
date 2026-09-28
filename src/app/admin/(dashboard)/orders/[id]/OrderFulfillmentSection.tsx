"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { upsertShipmentAction } from "@/lib/actions/admin-fulfillment";

interface ShipmentData {
  id: string;
  carrier: string | null;
  trackingNumber: string | null;
  trackingUrl: string | null;
  shippedAt: Date | string | null;
  deliveredAt: Date | string | null;
}

interface OrderFulfillmentSectionProps {
  orderId: string;
  orderStatus: string;
  shipment: ShipmentData | null;
}

export function OrderFulfillmentSection({
  orderId,
  orderStatus,
  shipment,
}: OrderFulfillmentSectionProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [carrier, setCarrier] = useState(shipment?.carrier || "");
  const [trackingNumber, setTrackingNumber] = useState(shipment?.trackingNumber || "");
  const [trackingUrl, setTrackingUrl] = useState(shipment?.trackingUrl || "");

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const canEditShipment = orderStatus === "PROCESSING" || orderStatus === "SHIPPED";

  const handleSaveShipment = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    startTransition(async () => {
      const res = await upsertShipmentAction({
        orderId,
        carrier,
        trackingNumber,
        trackingUrl,
      });

      if (!res.success) {
        setErrorMessage(res.error || "Failed to save shipment information.");
      } else {
        setSuccessMessage("Shipment information saved successfully.");
        router.refresh();
      }
    });
  };

  return (
    <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 sm:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-100 dark:border-neutral-800">
        <div>
          <h2 className="text-base font-semibold text-neutral-900 dark:text-white">
            Fulfillment & Shipment Details
          </h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            Carrier assignments, tracking numbers, and delivery confirmation
          </p>
        </div>

        <div>
          {orderStatus === "CANCELLED" ? (
            <span className="text-xs px-2.5 py-1 rounded-full border font-semibold bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-800">
              Fulfillment Cancelled
            </span>
          ) : orderStatus === "DELIVERED" ? (
            <span className="text-xs px-2.5 py-1 rounded-full border font-semibold bg-green-50 text-green-700 border-green-200 dark:bg-green-950/40 dark:text-green-400 dark:border-green-800">
              Delivered
            </span>
          ) : orderStatus === "SHIPPED" ? (
            <span className="text-xs px-2.5 py-1 rounded-full border font-semibold bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/40 dark:text-sky-400 dark:border-sky-800">
              In Transit
            </span>
          ) : orderStatus === "PROCESSING" ? (
            <span className="text-xs px-2.5 py-1 rounded-full border font-semibold bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-800">
              {shipment?.trackingNumber ? "Fulfillment Prepared" : "Awaiting Fulfillment"}
            </span>
          ) : (
            <span className="text-xs px-2.5 py-1 rounded-full border font-semibold bg-neutral-100 text-neutral-600 border-neutral-200 dark:bg-neutral-800 dark:text-neutral-400 dark:border-neutral-700">
              Awaiting Processing
            </span>
          )}
        </div>
      </div>

      {/* Messages */}
      {errorMessage && (
        <div className="p-3 text-xs rounded-lg bg-rose-50 text-rose-800 border border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800 flex items-center justify-between">
          <span>{errorMessage}</span>
          <button onClick={() => setErrorMessage(null)} className="text-rose-600 hover:text-rose-900 font-bold ml-2">
            ✕
          </button>
        </div>
      )}

      {successMessage && (
        <div className="p-3 text-xs rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800 flex items-center justify-between">
          <span>{successMessage}</span>
          <button onClick={() => setSuccessMessage(null)} className="text-emerald-600 hover:text-emerald-900 font-bold ml-2">
            ✕
          </button>
        </div>
      )}

      {/* Status Views */}
      {orderStatus === "CANCELLED" ? (
        <p className="text-xs text-neutral-500 dark:text-neutral-400 italic">
          This order was cancelled. Fulfillment is not applicable.
        </p>
      ) : orderStatus === "DELIVERED" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="space-y-1">
            <span className="text-neutral-400 dark:text-neutral-500 font-medium">Carrier</span>
            <p className="font-semibold text-neutral-900 dark:text-white">{shipment?.carrier || "N/A"}</p>
          </div>
          <div className="space-y-1">
            <span className="text-neutral-400 dark:text-neutral-500 font-medium">Tracking Number</span>
            <div className="flex items-center gap-2">
              <span className="font-mono font-semibold text-neutral-900 dark:text-white">
                {shipment?.trackingNumber || "N/A"}
              </span>
              {shipment?.trackingUrl && (
                <a
                  href={shipment.trackingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 hover:underline font-semibold"
                >
                  Track Shipment ↗
                </a>
              )}
            </div>
          </div>
          {shipment?.shippedAt && (
            <div className="space-y-1">
              <span className="text-neutral-400 dark:text-neutral-500 font-medium">Shipped At</span>
              <p className="text-neutral-900 dark:text-white">
                {new Date(shipment.shippedAt).toLocaleString("en-IN")}
              </p>
            </div>
          )}
          {shipment?.deliveredAt && (
            <div className="space-y-1">
              <span className="text-neutral-400 dark:text-neutral-500 font-medium">Delivered At</span>
              <p className="text-neutral-900 dark:text-white">
                {new Date(shipment.deliveredAt).toLocaleString("en-IN")}
              </p>
            </div>
          )}
        </div>
      ) : canEditShipment ? (
        <form onSubmit={handleSaveShipment} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-medium text-neutral-700 dark:text-neutral-300">
                Shipping Carrier
              </label>
              <input
                type="text"
                value={carrier}
                onChange={(e) => setCarrier(e.target.value)}
                placeholder="e.g. Blue Dart, Delhivery, DTDC, FedEx"
                disabled={isPending}
                className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-neutral-700 dark:text-neutral-300">
                Tracking Number
              </label>
              <input
                type="text"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                placeholder="e.g. BD-982348123"
                disabled={isPending}
                className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white font-mono focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
              />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-neutral-700 dark:text-neutral-300">
                Tracking Portal URL (Optional)
              </label>
              {shipment?.trackingUrl && (
                <a
                  href={shipment.trackingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-0.5"
                >
                  Track Shipment ↗
                </a>
              )}
            </div>
            <input
              type="url"
              value={trackingUrl}
              onChange={(e) => setTrackingUrl(e.target.value)}
              placeholder="https://track.courier.com/tracking?id=..."
              disabled={isPending}
              className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <p className="text-[11px] text-neutral-500 dark:text-neutral-400 italic">
              Saving fulfillment details records shipping data without changing the order status.
            </p>
            <button
              type="submit"
              disabled={isPending}
              className="px-4 py-2 text-xs font-semibold text-white bg-black hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200 rounded-lg transition-colors disabled:opacity-50"
            >
              {isPending ? "Saving..." : "Save Shipment Information"}
            </button>
          </div>
        </form>
      ) : (
        <div className="space-y-2">
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            Order is currently {orderStatus}. Shipping details can be recorded once the order is moved to <span className="font-semibold text-neutral-800 dark:text-neutral-200">PROCESSING</span>.
          </p>
          {shipment?.carrier && (
            <div className="p-3 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50 text-xs">
              <span className="font-medium text-neutral-900 dark:text-white">{shipment.carrier}</span> - {shipment.trackingNumber || "No tracking #"}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
