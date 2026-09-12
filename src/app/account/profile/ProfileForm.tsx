"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { profileSchema, ProfileInput } from "@/lib/validations/auth";
import { updateProfile } from "@/lib/actions/auth";
import { useRouter } from "next/navigation";

export default function ProfileForm({ 
  initialName, 
  email 
}: { 
  initialName: string; 
  email: string 
}) {
  const router = useRouter();
  const [status, setStatus] = useState<{ type: "success" | "error" | null; message: string | null }>({ type: null, message: null });
  
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ProfileInput>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: initialName },
  });

  const onSubmit = async (data: ProfileInput) => {
    setStatus({ type: null, message: null });
    
    const result = await updateProfile(data);
    
    if (result?.error) {
      setStatus({ type: "error", message: result.error });
    } else {
      setStatus({ type: "success", message: "Profile updated successfully." });
      router.refresh();
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {status.message && (
        <div className={`p-4 border text-sm text-center ${
          status.type === "success" 
            ? "bg-green-50 border-green-200 text-green-900" 
            : "bg-neutral-100 border-neutral-200 text-neutral-900"
        }`}>
          {status.message}
        </div>
      )}

      <div className="space-y-5">
        <div>
          <label className="block text-[11px] font-mono text-neutral-900 uppercase tracking-widest mb-2">
            Full Name
          </label>
          <input
            {...register("name")}
            type="text"
            className="block w-full border border-neutral-300 px-4 py-3 text-sm focus:border-black focus:ring-1 focus:ring-black outline-none transition-colors bg-transparent placeholder:text-neutral-400"
          />
          {errors.name && (
            <p className="mt-1.5 text-xs text-red-600">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label className="block text-[11px] font-mono text-neutral-400 uppercase tracking-widest mb-2 flex items-center justify-between">
            <span>Email</span>
            <span className="text-[9px]">Cannot be changed</span>
          </label>
          <input
            type="email"
            value={email}
            disabled
            className="block w-full border border-neutral-200 px-4 py-3 text-sm bg-neutral-50 text-neutral-500 cursor-not-allowed"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-[#111111] text-white py-4 text-[13px] font-medium tracking-wide uppercase hover:bg-black/85 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-4"
      >
        {isSubmitting ? "Saving..." : "Save Changes"}
      </button>
    </form>
  );
}
