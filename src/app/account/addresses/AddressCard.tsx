"use client";

import { deleteAddress, setDefaultAddress } from "@/lib/actions/address";
import Link from "next/link";
import { useState } from "react";
import type { Address } from "@/generated/prisma/client";

export default function AddressCard({ address }: { address: Address }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSettingDefault, setIsSettingDefault] = useState(false);

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this address?")) {
      setIsDeleting(true);
      await deleteAddress(address.id);
      setIsDeleting(false);
    }
  };

  const handleSetDefault = async () => {
    setIsSettingDefault(true);
    await setDefaultAddress(address.id);
    setIsSettingDefault(false);
  };

  return (
    <div className="border border-neutral-200 p-8 relative bg-white">
      {address.isDefault && (
        <span className="absolute top-6 right-6 text-[9px] font-mono bg-black text-white px-2 py-1 uppercase tracking-widest">
          Default
        </span>
      )}
      <p className="font-medium text-sm mb-1 text-neutral-900">{address.fullName}</p>
      <div className="text-sm text-neutral-600 space-y-0.5 mb-4">
        <p>{address.addressLine1}</p>
        {address.addressLine2 && <p>{address.addressLine2}</p>}
        <p>{address.city}, {address.state} {address.postalCode}</p>
        <p>{address.country}</p>
        <p className="pt-2">Phone: {address.phone}</p>
      </div>
      
      <div className="mt-6 flex items-center gap-5 text-[11px] font-mono uppercase tracking-widest pt-4 border-t border-neutral-100">
        <Link 
          href={`/account/addresses?action=edit&id=${address.id}`} 
          className="text-neutral-900 hover:text-neutral-500 transition-colors"
        >
          Edit
        </Link>
        <button 
          onClick={handleDelete} 
          disabled={isDeleting}
          className="text-red-600 hover:text-red-400 transition-colors disabled:opacity-50"
        >
          {isDeleting ? "..." : "Delete"}
        </button>
        {!address.isDefault && (
          <button 
            onClick={handleSetDefault} 
            disabled={isSettingDefault}
            className="text-neutral-500 hover:text-black transition-colors ml-auto disabled:opacity-50"
          >
            {isSettingDefault ? "..." : "Set Default"}
          </button>
        )}
      </div>
    </div>
  );
}
