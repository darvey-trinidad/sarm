// src/app/(auth)/reset-password/page.tsx
"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { api } from "@/trpc/react";
import { Button } from "@/components/ui/button";

// Separate component for the logic that uses useSearchParams
function ResetPasswordForm() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [token, setToken] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const tokenParam = searchParams.get("token");
    const errorParam = searchParams.get("error");

    if (errorParam === "INVALID_TOKEN") {
      setError("This reset link is invalid or has expired. Please request a new one.");
      setTimeout(() => {
        router.push("/forgot-password");
      }, 3000);
      return;
    }

    if (!tokenParam) {
      setError("No reset token found. Please request a new password reset.");
      setTimeout(() => {
        router.push("/forgot-password");
      }, 3000);
      return;
    }

    setToken(tokenParam);
  }, [searchParams, router]);

  const resetPassword = api.auth.resetPassword.useMutation({
    onSuccess: () => {
      router.push("/login?resetSuccess=true");
    },
    onError: (error) => {
      setError(error.message);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (!token) {
      setError("Invalid reset token");
      return;
    }

    await resetPassword.mutateAsync({
      newPassword,
      token,
    });
  };

  if (!token && !error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#8A350E] border-r-transparent"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (error && !token) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        <div className="w-full max-w-md overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg">
          {/* Header */}
          <div className="bg-red-600 px-6 py-5 text-white">
            <div className="flex items-center">
              <span className="mr-3 text-xl">❌</span>
              <div>
                <h1 className="text-xl font-bold">Invalid Reset Link</h1>
                <p className="text-sm text-red-100">Link expired or invalid</p>
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="space-y-6 p-8">
            <p className="text-gray-800">{error}</p>
            <p className="text-sm text-gray-500">Redirecting to password reset request...</p>
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
            <span className="mr-3 text-xl">🔑</span>
            <div>
              <h1 className="text-xl font-bold">Reset Password</h1>
              <p className="text-sm text-[#fcd9c5]">Create a new password for your account</p>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="space-y-6 p-8">
          <p className="text-gray-800">
            Enter your new password below. Make sure it&apos;s at least 8 characters long.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="newPassword"
                className="block text-sm font-medium text-gray-700"
              >
                New Password
              </label>
              <div className="relative mt-1">
                <input
                  id="newPassword"
                  type={showPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  minLength={8}
                  placeholder="Enter new password"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 pr-10 text-sm focus:border-[#8A350E] focus:outline-none focus:ring-2 focus:ring-[#8A350E]/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? (
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700"
              >
                Confirm New Password
              </label>
              <input
                id="confirmPassword"
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={8}
                placeholder="Confirm new password"
                className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-[#8A350E] focus:outline-none focus:ring-2 focus:ring-[#8A350E]/20"
              />
            </div>

            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
                {error}
              </div>
            )}

            <div className="rounded-lg border border-gray-200 bg-[#fef7f5] p-4">
              <p className="text-sm text-[#8A350E]">Password Requirements</p>
              <ul className="mt-2 space-y-1 text-xs text-gray-700">
                <li>• At least 8 characters long</li>
                <li>• Maximum 128 characters</li>
              </ul>
            </div>

            <Button
              type="submit"
              disabled={resetPassword.isPending}
              className="w-full rounded-lg bg-[#8A350E] px-4 py-2.5 text-white shadow-md hover:bg-[#6d2a0b] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {resetPassword.isPending ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  Resetting Password...
                </span>
              ) : (
                "Reset Password"
              )}
            </Button>
          </form>

          <div className="text-center">
            <button
              onClick={() => router.push("/login")}
              className="text-sm text-gray-600 hover:text-gray-900 hover:underline"
            >
              ← Back to Login
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

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#8A350E] border-r-transparent"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <ResetPasswordForm />
    </Suspense>
  );
}