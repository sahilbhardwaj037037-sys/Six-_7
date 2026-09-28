"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useCart } from "@/context/CartContext";
import { addAddress } from "@/lib/actions/address";
import { createPendingOrder } from "@/lib/actions/checkout";
import { createStripeCheckoutSession } from "@/lib/actions/stripe";
import type { Address } from "@/generated/prisma/client";
import {
  MapPin,
  Check,
  Plus,
  ShoppingBag,
  ArrowRight,
  ArrowLeft,
  AlertTriangle,
  Loader2,
  CheckCircle2,
  CreditCard,
} from "lucide-react";

interface CheckoutClientProps {
  initialAddresses: Address[];
  userEmail: string;
}

function formatPrice(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function CheckoutClient({
  initialAddresses,
  userEmail,
}: CheckoutClientProps) {
  const router = useRouter();
  const { items, totalItems, subtotal, isHydrated, clearCart } = useCart();

  const [addresses, setAddresses] = useState<Address[]>(initialAddresses);
  const [selectedAddressId, setSelectedAddressId] = useState<string>(
    initialAddresses.find((a) => a.isDefault)?.id || initialAddresses[0]?.id || ""
  );

  const [showNewAddressForm, setShowNewAddressForm] = useState(
    initialAddresses.length === 0
  );
  const [isSubmittingAddress, setIsSubmittingAddress] = useState(false);
  const [addressError, setAddressError] = useState<string | null>(null);

  // Order submission & payment states
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [isRedirectingToStripe, setIsRedirectingToStripe] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [stripeError, setStripeError] = useState<string | null>(null);

  const [createdOrder, setCreatedOrder] = useState<{
    orderId: string;
    orderNumber: string;
    total: number;
  } | null>(null);

  const [newAddress, setNewAddress] = useState({
    fullName: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "India",
    isDefault: false,
  });

  useEffect(() => {
    setAddresses(initialAddresses);
    if (!selectedAddressId && initialAddresses.length > 0) {
      const defaultAddr = initialAddresses.find((a) => a.isDefault);
      setSelectedAddressId(defaultAddr ? defaultAddr.id : initialAddresses[0].id);
    }
  }, [initialAddresses, selectedAddressId]);

  const handleCreateAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddressError(null);
    setIsSubmittingAddress(true);

    try {
      const res = await addAddress(newAddress);
      if (res.error) {
        setAddressError(res.error);
        setIsSubmittingAddress(false);
        return;
      }

      setNewAddress({
        fullName: "",
        phone: "",
        addressLine1: "",
        addressLine2: "",
        city: "",
        state: "",
        postalCode: "",
        country: "India",
        isDefault: false,
      });
      setShowNewAddressForm(false);
      router.refresh();
    } catch {
      setAddressError("Failed to save address. Please try again.");
    } finally {
      setIsSubmittingAddress(false);
    }
  };

  const handlePlaceOrder = async () => {
    if (isPlacingOrder || isRedirectingToStripe) return;
    if (!selectedAddressId) {
      setCheckoutError("Please select or add a shipping address.");
      return;
    }

    setCheckoutError(null);
    setStripeError(null);
    setIsPlacingOrder(true);

    try {
      // Step 2: Create Pending Order and reserve stock
      const res = await createPendingOrder(selectedAddressId);
      if (res.error) {
        setCheckoutError(res.error);
        setIsPlacingOrder(false);
        return;
      }

      if (res.success && res.orderId && res.orderNumber) {
        clearCart();
        const orderData = {
          orderId: res.orderId,
          orderNumber: res.orderNumber,
          total: res.total ?? subtotal,
        };
        setCreatedOrder(orderData);
        setIsPlacingOrder(false);

        // Step 3: Trigger Stripe Checkout Session creation and redirect
        setIsRedirectingToStripe(true);
        const stripeRes = await createStripeCheckoutSession(res.orderId);
        if (stripeRes.error) {
          setStripeError(stripeRes.error);
          setIsRedirectingToStripe(false);
        } else if (stripeRes.sessionUrl) {
          window.location.href = stripeRes.sessionUrl;
        }
      }
    } catch {
      setCheckoutError("Failed to create order. Please try again.");
      setIsPlacingOrder(false);
      setIsRedirectingToStripe(false);
    }
  };

  const handleProceedToPayment = async () => {
    if (!createdOrder?.orderId || isRedirectingToStripe) return;

    setStripeError(null);
    setIsRedirectingToStripe(true);

    try {
      const res = await createStripeCheckoutSession(createdOrder.orderId);
      if (res.error) {
        setStripeError(res.error);
        setIsRedirectingToStripe(false);
      } else if (res.sessionUrl) {
        window.location.href = res.sessionUrl;
      }
    } catch {
      setStripeError("Unable to redirect to payment. Please try again.");
      setIsRedirectingToStripe(false);
    }
  };

  const hasArchivedItems = items.some((item) => item.isArchived);

  return (
    <div className="min-h-screen flex flex-col bg-[#FBFBFB] text-[#111111]">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        {/* Navigation & Header */}
        <div className="border-b border-neutral-200 pb-6 mb-8 sm:mb-12 flex flex-col sm:flex-row sm:items-baseline justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-light tracking-tight text-neutral-950 uppercase font-mono">
              Checkout
            </h1>
            <p className="text-xs text-neutral-500 font-mono mt-1">
              Signed in as {userEmail}
            </p>
          </div>
          {!createdOrder && (
            <Link
              href="/cart"
              className="inline-flex items-center gap-1.5 text-xs font-mono text-neutral-600 hover:text-neutral-950 uppercase tracking-wider transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to Bag
            </Link>
          )}
        </div>

        {/* Order Confirmation Screen */}
        {createdOrder ? (
          <div className="max-w-2xl mx-auto bg-white border border-neutral-200 p-8 sm:p-12 text-center space-y-6">
            <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center mx-auto text-emerald-600">
              <CheckCircle2 className="w-6 h-6" />
            </div>

            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-sm border border-emerald-200">
                Order Placed · Payment Pending
              </span>
              <h2 className="text-2xl font-light tracking-tight text-neutral-950 uppercase font-mono mt-4">
                {createdOrder.orderNumber}
              </h2>
              <p className="text-xs text-neutral-500 font-mono mt-2">
                Order created and warehouse inventory reserved. Complete payment to finalize.
              </p>
            </div>

            <div className="py-4 border-y border-neutral-100 flex justify-between items-center text-xs font-mono">
              <span className="text-neutral-500 uppercase">Authoritative Total</span>
              <span className="text-base font-semibold text-neutral-950">
                {formatPrice(createdOrder.total)}
              </span>
            </div>

            {stripeError && (
              <div className="p-4 border border-red-300 bg-red-50 rounded-sm text-left flex items-start gap-3 text-red-900">
                <AlertTriangle className="w-5 h-5 flex-shrink-0 text-red-600 mt-0.5" />
                <div className="text-xs font-mono">
                  <p className="font-semibold uppercase tracking-wider">Payment Initialization Error</p>
                  <p className="mt-1 text-red-800 leading-relaxed">{stripeError}</p>
                </div>
              </div>
            )}

            <div className="p-4 bg-neutral-50 border border-neutral-200 rounded-sm text-left space-y-2">
              <p className="text-xs font-mono text-neutral-700 font-medium uppercase tracking-wider flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-neutral-900" />
                Stripe Test Mode Payment
              </p>
              <p className="text-xs text-neutral-600 font-mono leading-relaxed">
                You will be redirected to Stripe’s secure hosted checkout. Use any Stripe test card to complete payment. Your order and inventory reservation will remain <strong>PENDING</strong> until payment webhook confirmation in Step 4.
              </p>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
              <button
                type="button"
                onClick={handleProceedToPayment}
                disabled={isRedirectingToStripe}
                className="px-8 py-3.5 bg-neutral-950 text-white text-xs font-mono uppercase tracking-widest hover:bg-neutral-800 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
              >
                {isRedirectingToStripe ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Redirecting to Stripe...
                  </>
                ) : (
                  <>
                    Pay {formatPrice(createdOrder.total)} with Stripe
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
              <Link
                href="/shop"
                className="px-8 py-3.5 border border-neutral-200 text-neutral-700 text-xs font-mono uppercase tracking-widest hover:text-neutral-950 transition-colors flex items-center justify-center"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        ) : !isHydrated ? (
          <div className="py-24 text-center">
            <div className="text-xs font-mono text-neutral-400 uppercase tracking-widest animate-pulse">
              Loading Checkout Details...
            </div>
          </div>
        ) : items.length === 0 ? (
          /* Empty Bag State */
          <div className="text-center py-20 border border-dashed border-neutral-200 bg-white p-8 sm:p-12">
            <ShoppingBag className="w-12 h-12 mx-auto text-neutral-300 mb-4 stroke-1" />
            <h2 className="text-lg font-mono uppercase tracking-wider text-neutral-900 mb-2">
              Your Bag is Empty
            </h2>
            <p className="text-xs text-neutral-500 font-mono mb-8 max-w-sm mx-auto">
              You do not have any items in your bag to checkout. Please explore the collection to add items.
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center justify-center px-8 py-3 bg-neutral-950 text-white text-xs font-mono uppercase tracking-widest hover:bg-neutral-800 transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          /* Main Checkout Two-Column Grid */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
            {/* Left Column: Delivery Address Selection & Form (7 cols) */}
            <div className="lg:col-span-7 space-y-8">
              {checkoutError && (
                <div className="p-4 border border-red-300 bg-red-50 rounded-sm flex items-start gap-3 text-red-900">
                  <AlertTriangle className="w-5 h-5 flex-shrink-0 text-red-600 mt-0.5" />
                  <div className="text-xs font-mono">
                    <p className="font-semibold uppercase tracking-wider">
                      Unable to Complete Checkout
                    </p>
                    <p className="mt-1 text-red-800 leading-relaxed">
                      {checkoutError}
                    </p>
                  </div>
                </div>
              )}

              {hasArchivedItems && (
                <div className="p-4 border border-amber-300 bg-amber-50 rounded-sm flex items-start gap-3 text-amber-900">
                  <AlertTriangle className="w-5 h-5 flex-shrink-0 text-amber-600 mt-0.5" />
                  <div className="text-xs font-mono">
                    <p className="font-semibold uppercase tracking-wider">
                      Unavailable Items Detected
                    </p>
                    <p className="mt-1 text-amber-800 leading-relaxed">
                      One or more items in your bag are currently inactive or archived. Please update your bag before continuing.
                    </p>
                  </div>
                </div>
              )}

              {/* Shipping Address Selection */}
              <div className="bg-white border border-neutral-200 p-6 sm:p-8">
                <div className="flex items-center justify-between pb-4 border-b border-neutral-200 mb-6">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-neutral-900" />
                    <h2 className="text-sm font-mono uppercase tracking-widest text-neutral-950">
                      1. Delivery Address
                    </h2>
                  </div>
                  {addresses.length > 0 && !showNewAddressForm && (
                    <button
                      type="button"
                      onClick={() => setShowNewAddressForm(true)}
                      className="inline-flex items-center gap-1 text-xs font-mono uppercase tracking-wider text-neutral-600 hover:text-neutral-950 transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Add New
                    </button>
                  )}
                </div>

                {addresses.length > 0 && !showNewAddressForm && (
                  <div className="space-y-3">
                    {addresses.map((address) => {
                      const isSelected = selectedAddressId === address.id;
                      return (
                        <div
                          key={address.id}
                          onClick={() => setSelectedAddressId(address.id)}
                          className={`relative p-5 border cursor-pointer transition-all ${
                            isSelected
                              ? "border-neutral-950 bg-neutral-50/50 ring-1 ring-neutral-950"
                              : "border-neutral-200 hover:border-neutral-300 bg-white"
                          }`}
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-sm text-neutral-950">
                                  {address.fullName}
                                </span>
                                {address.isDefault && (
                                  <span className="text-[9px] font-mono bg-neutral-900 text-white px-1.5 py-0.5 uppercase tracking-wider">
                                    Default
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-neutral-600 font-mono">
                                {address.phone}
                              </p>
                              <div className="text-xs text-neutral-600 pt-1 leading-relaxed">
                                <p>{address.addressLine1}</p>
                                {address.addressLine2 && <p>{address.addressLine2}</p>}
                                <p>
                                  {address.city}, {address.state} - {address.postalCode}
                                </p>
                                <p>{address.country}</p>
                              </div>
                            </div>
                            <div
                              className={`w-5 h-5 rounded-full border flex items-center justify-center flex-shrink-0 mt-0.5 ${
                                isSelected
                                  ? "border-neutral-950 bg-neutral-950 text-white"
                                  : "border-neutral-300 bg-white"
                              }`}
                            >
                              {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {showNewAddressForm && (
                  <form onSubmit={handleCreateAddress} className="space-y-4">
                    {addressError && (
                      <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-xs font-mono">
                        {addressError}
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-600 mb-1.5">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={newAddress.fullName}
                          onChange={(e) =>
                            setNewAddress({ ...newAddress, fullName: e.target.value })
                          }
                          className="w-full px-3 py-2 text-sm border border-neutral-200 rounded-none focus:outline-none focus:border-neutral-950 font-sans"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-600 mb-1.5">
                          Phone Number *
                        </label>
                        <input
                          type="tel"
                          required
                          value={newAddress.phone}
                          onChange={(e) =>
                            setNewAddress({ ...newAddress, phone: e.target.value })
                          }
                          className="w-full px-3 py-2 text-sm border border-neutral-200 rounded-none focus:outline-none focus:border-neutral-950 font-sans"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-600 mb-1.5">
                        Address Line 1 *
                      </label>
                      <input
                        type="text"
                        required
                        value={newAddress.addressLine1}
                        onChange={(e) =>
                          setNewAddress({ ...newAddress, addressLine1: e.target.value })
                        }
                        className="w-full px-3 py-2 text-sm border border-neutral-200 rounded-none focus:outline-none focus:border-neutral-950 font-sans"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-600 mb-1.5">
                        Address Line 2 (Optional)
                      </label>
                      <input
                        type="text"
                        value={newAddress.addressLine2}
                        onChange={(e) =>
                          setNewAddress({ ...newAddress, addressLine2: e.target.value })
                        }
                        className="w-full px-3 py-2 text-sm border border-neutral-200 rounded-none focus:outline-none focus:border-neutral-950 font-sans"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-600 mb-1.5">
                          City *
                        </label>
                        <input
                          type="text"
                          required
                          value={newAddress.city}
                          onChange={(e) =>
                            setNewAddress({ ...newAddress, city: e.target.value })
                          }
                          className="w-full px-3 py-2 text-sm border border-neutral-200 rounded-none focus:outline-none focus:border-neutral-950 font-sans"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-600 mb-1.5">
                          State *
                        </label>
                        <input
                          type="text"
                          required
                          value={newAddress.state}
                          onChange={(e) =>
                            setNewAddress({ ...newAddress, state: e.target.value })
                          }
                          className="w-full px-3 py-2 text-sm border border-neutral-200 rounded-none focus:outline-none focus:border-neutral-950 font-sans"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-600 mb-1.5">
                          Postal Code *
                        </label>
                        <input
                          type="text"
                          required
                          value={newAddress.postalCode}
                          onChange={(e) =>
                            setNewAddress({ ...newAddress, postalCode: e.target.value })
                          }
                          className="w-full px-3 py-2 text-sm border border-neutral-200 rounded-none focus:outline-none focus:border-neutral-950 font-sans"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-600 mb-1.5">
                        Country *
                      </label>
                      <input
                        type="text"
                        required
                        value={newAddress.country}
                        onChange={(e) =>
                          setNewAddress({ ...newAddress, country: e.target.value })
                        }
                        className="w-full px-3 py-2 text-sm border border-neutral-200 rounded-none focus:outline-none focus:border-neutral-950 font-sans"
                      />
                    </div>

                    <div className="flex items-center gap-2 pt-2">
                      <input
                        type="checkbox"
                        id="isDefault"
                        checked={newAddress.isDefault}
                        onChange={(e) =>
                          setNewAddress({ ...newAddress, isDefault: e.target.checked })
                        }
                        className="rounded-none border-neutral-300 text-neutral-950 focus:ring-neutral-950"
                      />
                      <label
                        htmlFor="isDefault"
                        className="text-xs font-mono text-neutral-700 cursor-pointer"
                      >
                        Set as default shipping address
                      </label>
                    </div>

                    <div className="flex items-center gap-3 pt-3">
                      <button
                        type="submit"
                        disabled={isSubmittingAddress}
                        className="px-6 py-2.5 bg-neutral-950 text-white text-xs font-mono uppercase tracking-wider hover:bg-neutral-800 disabled:opacity-50 transition-colors flex items-center gap-2"
                      >
                        {isSubmittingAddress && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                        Save Address
                      </button>
                      {addresses.length > 0 && (
                        <button
                          type="button"
                          onClick={() => {
                            setAddressError(null);
                            setShowNewAddressForm(false);
                          }}
                          className="px-4 py-2.5 border border-neutral-200 text-neutral-600 text-xs font-mono uppercase tracking-wider hover:text-neutral-950 transition-colors"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </form>
                )}
              </div>
            </div>

            {/* Right Column: Order Summary & Review (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-white border border-neutral-200 p-6 sm:p-8">
                <div className="flex items-center justify-between pb-4 border-b border-neutral-200 mb-6">
                  <h2 className="text-sm font-mono uppercase tracking-widest text-neutral-950">
                    2. Order Review ({totalItems})
                  </h2>
                  <Link
                    href="/cart"
                    className="text-xs font-mono uppercase tracking-wider text-neutral-500 hover:text-neutral-950 transition-colors"
                  >
                    Edit Bag
                  </Link>
                </div>

                <div className="divide-y divide-neutral-100 max-h-80 overflow-y-auto pr-1">
                  {items.map((item) => (
                    <div key={item.id} className="py-3 flex gap-3 text-xs">
                      <div className="w-14 h-16 bg-neutral-100 relative flex-shrink-0 border border-neutral-200 overflow-hidden">
                        {item.imageUrl ? (
                          <Image
                            src={item.imageUrl}
                            alt={item.name}
                            fill
                            sizes="56px"
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[9px] font-mono text-neutral-400">
                            No Img
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-neutral-900 truncate">
                          {item.name}
                        </p>
                        <p className="text-[11px] text-neutral-500 font-mono mt-0.5">
                          Size: {item.size} {item.colorHex ? `· Color` : ""}
                        </p>
                        <p className="text-[11px] text-neutral-500 font-mono mt-0.5">
                          Qty: {item.quantity} × {formatPrice(item.price)}
                        </p>
                      </div>
                      <div className="text-right font-medium text-neutral-950 font-mono">
                        {formatPrice(item.price * item.quantity)}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-neutral-200 pt-4 mt-4 space-y-2.5 text-xs font-mono">
                  <div className="flex justify-between text-neutral-600">
                    <span>Subtotal</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-neutral-600">
                    <span>Shipping</span>
                    <span className="text-neutral-950">Complimentary</span>
                  </div>
                  <div className="flex justify-between text-neutral-600">
                    <span>Tax</span>
                    <span>Included</span>
                  </div>
                  <div className="flex justify-between text-neutral-600">
                    <span>Discount</span>
                    <span>—</span>
                  </div>
                  <div className="border-t border-neutral-200 pt-3 flex justify-between text-sm font-semibold text-neutral-950">
                    <span className="uppercase tracking-wider">Estimated Total</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                </div>

                <div className="pt-6 border-t border-neutral-200 mt-6">
                  <button
                    type="button"
                    onClick={handlePlaceOrder}
                    disabled={isPlacingOrder || isRedirectingToStripe || !selectedAddressId || hasArchivedItems}
                    className="w-full py-4 px-6 bg-neutral-950 text-white text-xs font-mono uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isPlacingOrder ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Reserving Stock & Placing Order...
                      </>
                    ) : isRedirectingToStripe ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Connecting to Stripe...
                      </>
                    ) : (
                      <>
                        Continue to Stripe Payment
                        <ArrowRight className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                  <p className="text-[10px] font-mono text-neutral-400 text-center mt-2.5 uppercase tracking-wider">
                    Creates pending order & launches Stripe Test Mode checkout
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
