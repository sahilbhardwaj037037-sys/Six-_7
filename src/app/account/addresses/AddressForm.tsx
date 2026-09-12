"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { addressSchema, AddressInput } from "@/lib/validations/address";
import { addAddress, updateAddress } from "@/lib/actions/address";
import { useRouter } from "next/navigation";
import type { Address } from "@/generated/prisma/client";

export default function AddressForm({ address }: { address?: Address | null }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<AddressInput>({
    resolver: zodResolver(addressSchema),
    defaultValues: address ? {
      fullName: address.fullName,
      phone: address.phone,
      addressLine1: address.addressLine1,
      addressLine2: address.addressLine2 || "",
      city: address.city,
      state: address.state,
      postalCode: address.postalCode,
      country: address.country,
      isDefault: address.isDefault,
    } : { isDefault: false, country: "United States" },
  });

  const onSubmit = async (data: AddressInput) => {
    setError(null);
    const result = address
      ? await updateAddress(address.id, data)
      : await addAddress(data);

    if (result?.error) {
      setError(result.error);
    } else {
      router.push("/account/addresses");
      router.refresh();
    }
  };

  const inputClass = "block w-full border border-neutral-300 px-4 py-3 text-sm focus:border-black focus:ring-1 focus:ring-black outline-none transition-colors bg-transparent placeholder:text-neutral-400";
  const labelClass = "block text-[11px] font-mono text-neutral-900 uppercase tracking-widest mb-2";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {error && (
        <div className="p-4 border bg-neutral-100 border-neutral-200 text-sm text-center text-neutral-900">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className={labelClass}>Full Name</label>
          <input {...register("fullName")} type="text" className={inputClass} />
          {errors.fullName && <p className="mt-1 text-xs text-red-600">{errors.fullName.message}</p>}
        </div>
        <div>
          <label className={labelClass}>Phone Number</label>
          <input {...register("phone")} type="text" className={inputClass} />
          {errors.phone && <p className="mt-1 text-xs text-red-600">{errors.phone.message}</p>}
        </div>
      </div>

      <div>
        <label className={labelClass}>Address Line 1</label>
        <input {...register("addressLine1")} type="text" className={inputClass} placeholder="Street address, P.O. box, etc." />
        {errors.addressLine1 && <p className="mt-1 text-xs text-red-600">{errors.addressLine1.message}</p>}
      </div>

      <div>
        <label className={labelClass}>Address Line 2 <span className="text-neutral-400 normal-case">(Optional)</span></label>
        <input {...register("addressLine2")} type="text" className={inputClass} placeholder="Apartment, suite, unit, etc." />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div>
          <label className={labelClass}>City</label>
          <input {...register("city")} type="text" className={inputClass} />
          {errors.city && <p className="mt-1 text-xs text-red-600">{errors.city.message}</p>}
        </div>
        <div>
          <label className={labelClass}>State / Province</label>
          <input {...register("state")} type="text" className={inputClass} />
          {errors.state && <p className="mt-1 text-xs text-red-600">{errors.state.message}</p>}
        </div>
        <div>
          <label className={labelClass}>Postal Code</label>
          <input {...register("postalCode")} type="text" className={inputClass} />
          {errors.postalCode && <p className="mt-1 text-xs text-red-600">{errors.postalCode.message}</p>}
        </div>
      </div>

      <div>
        <label className={labelClass}>Country</label>
        <input {...register("country")} type="text" className={inputClass} />
        {errors.country && <p className="mt-1 text-xs text-red-600">{errors.country.message}</p>}
      </div>

      <div className="flex items-center gap-3 pt-2">
        <input {...register("isDefault")} type="checkbox" id="isDefault" className="w-4 h-4 accent-black" />
        <label htmlFor="isDefault" className="text-sm text-neutral-600 cursor-pointer">
          Set as my default shipping address
        </label>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-[#111111] text-white py-4 text-[13px] font-medium tracking-wide uppercase hover:bg-black/85 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-4"
      >
        {isSubmitting ? "Saving..." : "Save Address"}
      </button>
    </form>
  );
}
