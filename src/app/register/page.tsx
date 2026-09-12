"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, RegisterInput } from "@/lib/validations/auth";
import { registerUser } from "@/lib/actions/auth";

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterInput) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await registerUser(data);

      if (response.error) {
        setError(response.error);
        setIsLoading(false);
        return;
      }

      // If registration was successful, log them in immediately
      const result = await signIn("credentials", {
        redirect: false,
        email: data.email,
        password: data.password,
      });

      if (result?.error) {
        setError("Account created, but automatic sign-in failed. Please log in.");
        setIsLoading(false);
      } else {
        router.push("/account");
        router.refresh();
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-10rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-10">
        <div className="text-center">
          <h1 className="text-3xl font-mono font-bold tracking-tighter uppercase text-[#111111]">Create Account</h1>
          <p className="mt-3 text-sm text-neutral-600">
            Join Six&7 for exclusive drops and faster checkout
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {error && (
            <div className="p-4 bg-neutral-100 border border-neutral-200 text-neutral-900 text-sm text-center">
              {error}
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
                autoComplete="name"
                className="block w-full border border-neutral-300 px-4 py-3 text-sm focus:border-black focus:ring-1 focus:ring-black outline-none transition-colors bg-transparent placeholder:text-neutral-400"
                placeholder="Jane Doe"
              />
              {errors.name && (
                <p className="mt-1.5 text-xs text-red-600">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label className="block text-[11px] font-mono text-neutral-900 uppercase tracking-widest mb-2">
                Email
              </label>
              <input
                {...register("email")}
                type="email"
                autoComplete="email"
                className="block w-full border border-neutral-300 px-4 py-3 text-sm focus:border-black focus:ring-1 focus:ring-black outline-none transition-colors bg-transparent placeholder:text-neutral-400"
                placeholder="Email address"
              />
              {errors.email && (
                <p className="mt-1.5 text-xs text-red-600">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="block text-[11px] font-mono text-neutral-900 uppercase tracking-widest mb-2">
                Password
              </label>
              <input
                {...register("password")}
                type="password"
                autoComplete="new-password"
                className="block w-full border border-neutral-300 px-4 py-3 text-sm focus:border-black focus:ring-1 focus:ring-black outline-none transition-colors bg-transparent placeholder:text-neutral-400"
                placeholder="Minimum 6 characters"
              />
              {errors.password && (
                <p className="mt-1.5 text-xs text-red-600">{errors.password.message}</p>
              )}
            </div>

            <div>
              <label className="block text-[11px] font-mono text-neutral-900 uppercase tracking-widest mb-2">
                Confirm Password
              </label>
              <input
                {...register("confirmPassword")}
                type="password"
                autoComplete="new-password"
                className="block w-full border border-neutral-300 px-4 py-3 text-sm focus:border-black focus:ring-1 focus:ring-black outline-none transition-colors bg-transparent placeholder:text-neutral-400"
                placeholder="Confirm password"
              />
              {errors.confirmPassword && (
                <p className="mt-1.5 text-xs text-red-600">{errors.confirmPassword.message}</p>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#111111] text-white py-4 text-[13px] font-medium tracking-wide uppercase hover:bg-black/85 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <div className="text-center text-sm text-neutral-600 pt-6 border-t border-neutral-200">
          Already have an account?{" "}
          <Link href="/login" className="text-[#111111] font-medium hover:underline underline-offset-4">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
