// src/app/(auth)/forgot-password/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/trpc/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const router = useRouter();

  const requestReset = api.auth.requestPasswordReset.useMutation({
    onSuccess: () => {
      setSubmitted(true);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await requestReset.mutateAsync({ email });
  };

  if (submitted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white px-4">
        <div className="w-full max-w-md overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg">
          {/* Header */}
          <div className="bg-[#8A350E] px-6 py-5 text-white">
            <div className="flex items-center">
              <span className="mr-3 text-xl">✉️</span>
              <div>
                <h1 className="text-xl font-bold">Check Your Email</h1>
                <p className="text-sm text-[#fcd9c5]">Password reset link sent</p>
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="space-y-6 p-8">
            <p className="text-gray-800">
              If an account exists with{" "}
              <span className="font-semibold text-[#8A350E]">{email}</span>, you
              will receive a password reset link shortly.
            </p>

            <div className="rounded-lg border border-gray-200 bg-[#fef7f5] p-4">
              <p className="text-sm text-[#8A350E]">Next Steps</p>
              <ol className="mt-2 space-y-1 text-sm text-gray-700">
                <li>1. Check your email inbox</li>
                <li>2. Click the reset link in the email</li>
                <li>3. Set your new password</li>
              </ol>
            </div>

            <div className="flex flex-col gap-3">
              <Button
                onClick={() => router.push("/login")}
                className="w-full rounded-lg bg-[#8A350E] px-4 py-2.5 text-white shadow-md hover:bg-[#6d2a0b]"
              >
                Back to Login
              </Button>

              <button
                onClick={() => setSubmitted(false)}
                className="text-sm text-gray-600 hover:text-gray-900 hover:underline"
              >
                Try another email
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 bg-gray-50 px-6 py-4 text-center text-xs text-gray-500">
            Scheduling and Resource Management System
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg">
        {/* Header */}
        <div className="bg-[#8A350E] px-6 py-5 text-white">
          <div className="flex items-center">
            <span className="mr-3 text-xl">🔐</span>
            <div>
              <h1 className="text-xl font-bold">Forgot Password?</h1>
              <p className="text-sm text-[#fcd9c5]">Reset your account password</p>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="space-y-6 p-8">
          <p className="text-gray-800">
            No worries! Enter your email address and we'll send you a link to
            reset your password.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-[#8A350E] focus:outline-none focus:ring-2 focus:ring-[#8A350E]/20"
              />
            </div>

            {requestReset.error && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
                {requestReset.error.message}
              </div>
            )}

            <Button
              type="submit"
              disabled={requestReset.isPending}
              className="w-full rounded-lg bg-[#8A350E] px-4 py-2.5 text-white shadow-md hover:bg-[#6d2a0b] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {requestReset.isPending ? "Sending..." : "Send Reset Link"}
            </Button>
          </form>

          <div className="text-center">
            <Link
              href="/login"
              className="text-sm text-gray-600 hover:text-gray-900 hover:underline"
            >
              ← Back to Login
            </Link>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 bg-gray-50 px-6 py-4 text-center text-xs text-gray-500">
          Scheduling and Resource Management System
        </div>
      </div>
    </div>
  );
}