"use client";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

function VerificationContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  return (
    <div className="w-full max-w-md space-y-6">

      {/* Email Icon */}
      <div className="flex justify-center">
        <div className="rounded-full bg-amber-100 p-6">
          <svg
            className="h-12 w-12 text-amber-800"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
        </div>
      </div>

      {/* Message */}
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-amber-800">Check Your Email</h2>
        <p className="text-gray-600">
          We've sent a verification link to
        </p>
        {email && (
          <p className="font-semibold text-amber-800">{email}</p>
        )}
      </div>

      <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 space-y-3">
        <p className="text-sm text-gray-700">
          <strong>What to do next:</strong>
        </p>
        <ol className="list-decimal list-inside space-y-1 text-sm text-gray-600">
          <li>Open your email inbox</li>
          <li>Click the verification link</li>
          <li>You'll be automatically signed in</li>
        </ol>
      </div>

      <div className="text-center text-xs text-gray-500 space-y-1">
        <p>Didn't receive the email? Check your spam folder.</p>
        <p>The link will expire in 24 hours.</p>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex min-h-[calc(100vh)] items-center justify-center p-8">
        <Suspense fallback={<div>Loading...</div>}>
          <VerificationContent />
        </Suspense>
      </div>
    </div>
  );
}