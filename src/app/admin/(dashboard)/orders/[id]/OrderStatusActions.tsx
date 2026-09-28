"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  updateOrderStatusAction,
  type AllowedOrderStatus,
} from "@/lib/actions/admin-orders";

interface OrderStatusActionsProps {
  orderId: string;
  currentStatus: string;
  paymentStatus: string;
}

interface ActionConfig {
  targetStatus: AllowedOrderStatus;
  label: string;
  variant: "primary" | "danger";
}

function getActionsForStatus(status: string): ActionConfig[] {
  switch (status) {
    case "PENDING":
      return [{ targetStatus: "CANCELLED", label: "Cancel Order", variant: "danger" }];
    case "PAID":
      return [
        { targetStatus: "PROCESSING", label: "Mark Processing", variant: "primary" },
        { targetStatus: "CANCELLED", label: "Cancel Order", variant: "danger" },
      ];
    case "PROCESSING":
      return [
        { targetStatus: "SHIPPED", label: "Mark Shipped", variant: "primary" },
        { targetStatus: "CANCELLED", label: "Cancel Order", variant: "danger" },
      ];
    case "SHIPPED":
      return [{ targetStatus: "DELIVERED", label: "Mark Delivered", variant: "primary" }];
    case "DELIVERED":
    case "CANCELLED":
    default:
      return [];
  }
}

function getStatusBadge(status: string) {
  switch (status) {
    case "PAID":
      return "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800";
    case "PROCESSING":
      return "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-800";
    case "SHIPPED":
      return "bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/40 dark:text-sky-400 dark:border-sky-800";
    case "DELIVERED":
      return "bg-green-50 text-green-700 border-green-200 dark:bg-green-950/40 dark:text-green-400 dark:border-green-800";
    case "CANCELLED":
      return "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-800";
    case "PENDING":
    default:
      return "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800";
  }
}

export function OrderStatusActions({
  orderId,
  currentStatus,
  paymentStatus,
}: OrderStatusActionsProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [confirmingAction, setConfirmingAction] = useState<ActionConfig | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const availableActions = getActionsForStatus(currentStatus);
  const isTerminal = currentStatus === "DELIVERED" || currentStatus === "CANCELLED";

  const handleExecuteTransition = (action: ActionConfig) => {
    setErrorMessage(null);
    setSuccessMessage(null);

    startTransition(async () => {
      const res = await updateOrderStatusAction(orderId, action.targetStatus);
      if (!res.success) {
        setErrorMessage(res.error || "Failed to update order status.");
        setConfirmingAction(null);
      } else {
        setSuccessMessage(`Order status updated to ${res.newStatus}.`);
        setConfirmingAction(null);
        router.refresh();
      }
    });
  };

  return (
    <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-100 dark:border-neutral-800">
        <div>
          <h2 className="text-base font-semibold text-neutral-900 dark:text-white">
            Order Lifecycle Management
          </h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            Admin controls for progressive fulfillment and terminal cancellation
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span
            className={`text-xs px-2.5 py-1 rounded-full border font-semibold ${getStatusBadge(
              currentStatus
            )}`}
          >
            Order: {currentStatus}
          </span>
          <span
            className={`text-xs px-2.5 py-1 rounded-full border font-semibold ${getStatusBadge(
              paymentStatus
            )}`}
          >
            Payment: {paymentStatus}
          </span>
        </div>
      </div>

      {/* Feedback Messages */}
      {errorMessage && (
        <div className="p-3 text-xs rounded-lg bg-rose-50 text-rose-800 border border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800 flex items-center justify-between">
          <span>{errorMessage}</span>
          <button
            onClick={() => setErrorMessage(null)}
            className="text-rose-600 hover:text-rose-900 font-bold ml-2"
          >
            ✕
          </button>
        </div>
      )}

      {successMessage && (
        <div className="p-3 text-xs rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800 flex items-center justify-between">
          <span>{successMessage}</span>
          <button
            onClick={() => setSuccessMessage(null)}
            className="text-emerald-600 hover:text-emerald-900 font-bold ml-2"
          >
            ✕
          </button>
        </div>
      )}

      {/* Confirmation Step */}
      {confirmingAction ? (
        <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/60 dark:bg-amber-950/20 dark:border-amber-800/60 space-y-3">
          <p className="text-xs sm:text-sm font-medium text-amber-900 dark:text-amber-200">
            Confirm transition to <span className="font-bold underline">{confirmingAction.targetStatus}</span>?
          </p>
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleExecuteTransition(confirmingAction)}
              disabled={isPending}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors border shadow-sm disabled:opacity-50 ${
                confirmingAction.variant === "danger"
                  ? "bg-rose-50 text-rose-700 border-rose-300 hover:bg-rose-100 hover:text-rose-800 focus:outline-none focus:ring-2 focus:ring-rose-500 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800 dark:hover:bg-rose-900/60"
                  : "bg-black text-white border-transparent hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200"
              }`}
            >
              {isPending ? "Updating..." : "Yes, Confirm"}
            </button>
            <button
              onClick={() => setConfirmingAction(null)}
              disabled={isPending}
              className="px-3.5 py-1.5 text-xs font-medium rounded-lg border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            >
              Dismiss
            </button>
          </div>
        </div>
      ) : (
        /* Action Buttons Area */
        <div className="space-y-2">
          {isTerminal ? (
            <p className="text-xs text-neutral-500 dark:text-neutral-400 italic">
              This order is in a terminal state ({currentStatus}). No further status changes are permitted.
            </p>
          ) : (
            <div className="flex flex-wrap items-center gap-3">
              {availableActions.map((action) => (
                <button
                  key={action.targetStatus}
                  onClick={() => setConfirmingAction(action)}
                  disabled={isPending}
                  className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors border shadow-sm disabled:opacity-50 ${
                    action.variant === "danger"
                      ? "bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-800 dark:hover:bg-rose-900/60"
                      : "bg-black text-white border-transparent hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200"
                  }`}
                >
                  {action.label}
                </button>
              ))}

              {currentStatus === "PENDING" && (
                <span className="text-xs text-neutral-500 dark:text-neutral-400 italic">
                  Payment confirmation is managed automatically via Stripe webhook.
                </span>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
