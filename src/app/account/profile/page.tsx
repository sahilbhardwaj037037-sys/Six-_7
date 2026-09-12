import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import ProfileForm from "./ProfileForm";
import { prisma } from "@/lib/prisma";

export default async function ProfilePage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const dbUser = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (!dbUser) {
    redirect("/login");
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16 min-h-[calc(100vh-10rem)]">
      <div className="mb-8">
        <Link href="/account" className="text-xs font-mono uppercase tracking-widest text-neutral-500 hover:text-black transition-colors">
          ← BACK TO ACCOUNT
        </Link>
      </div>
      
      <div className="mb-10 pb-6 border-b border-neutral-200">
        <h1 className="text-3xl font-mono font-bold tracking-tighter uppercase text-[#111111]">
          Edit Profile
        </h1>
        <p className="mt-2 text-sm text-neutral-600">
          Manage your personal information
        </p>
      </div>

      <ProfileForm 
        initialName={dbUser.name || ""} 
        email={dbUser.email || ""} 
      />
    </div>
  );
}
