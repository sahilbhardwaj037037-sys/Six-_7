import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import AddressForm from "./AddressForm";
import AddressCard from "./AddressCard";

// Next.js 15+ compatible typing for searchParams
type Props = { searchParams: Promise<{ action?: string, id?: string }> };

export default async function AddressesPage(props: Props) {
  const searchParams = await props.searchParams;
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const addresses = await prisma.address.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  const { action, id } = searchParams;
  
  const isAdding = action === "add";
  const isEditing = action === "edit" && id;
  const addressToEdit = isEditing ? addresses.find((a) => a.id === id) : null;

  if (isAdding || (isEditing && addressToEdit)) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 min-h-[calc(100vh-10rem)]">
        <div className="mb-8">
          <Link href="/account/addresses" className="text-xs font-mono uppercase tracking-widest text-neutral-500 hover:text-black transition-colors">
            ← BACK TO ADDRESSES
          </Link>
        </div>
        <div className="mb-10 pb-6 border-b border-neutral-200">
          <h1 className="text-3xl font-mono font-bold tracking-tighter uppercase text-[#111111]">
            {isEditing ? "Edit Address" : "Add Address"}
          </h1>
        </div>
        <AddressForm address={addressToEdit} />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 min-h-[calc(100vh-10rem)]">
      <div className="mb-8">
        <Link href="/account" className="text-xs font-mono uppercase tracking-widest text-neutral-500 hover:text-black transition-colors">
          ← BACK TO ACCOUNT
        </Link>
      </div>
      
      <div className="mb-10 pb-6 border-b border-neutral-200 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-mono font-bold tracking-tighter uppercase text-[#111111]">
            Saved Addresses
          </h1>
          <p className="mt-2 text-sm text-neutral-600">
            Manage your shipping and billing addresses for a faster checkout.
          </p>
        </div>
        <Link 
          href="/account/addresses?action=add" 
          className="text-xs font-mono tracking-widest uppercase border border-[#111111] bg-[#111111] text-white px-6 py-3 hover:bg-black/85 transition-colors text-center shrink-0"
        >
          Add New Address
        </Link>
      </div>

      {addresses.length === 0 ? (
        <div className="border border-neutral-200 py-20 text-center bg-neutral-50 flex flex-col items-center">
          <p className="text-sm text-neutral-500 mb-6">You haven't saved any addresses yet.</p>
          <Link 
            href="/account/addresses?action=add" 
            className="text-xs font-mono tracking-widest uppercase underline underline-offset-4 text-[#111111] hover:text-neutral-500 transition-colors"
          >
            Add your first address
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {addresses.map((address) => (
            <AddressCard key={address.id} address={address} />
          ))}
        </div>
      )}
    </div>
  );
}
