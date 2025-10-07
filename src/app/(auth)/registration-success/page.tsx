import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export default async function RegistrationSuccessPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // If user is already fully verified and active, redirect to dashboard
  if (session?.user.emailVerified && session?.user.isActive) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex min-h-[calc(100vh)] items-center justify-center p-8">
        <div className="w-full max-w-2xl space-y-6">
          {/* Success Icon */}
          <div className="flex justify-center">
            <div className="rounded-full bg-green-100 p-6">
              <svg
                className="h-12 w-12 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>

          {/* Main Message */}
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-bold text-amber-800">
              Registration Successful!
            </h1>
            <p className="text-lg text-gray-600">
              Your account has been created
            </p>
            {session?.user.email && (
              <p className="font-semibold text-amber-800">
                {session.user.email}
              </p>
            )}
          </div>

          {/* Steps Card */}
          <div className="rounded-lg border-2 border-amber-200 bg-white p-6 space-y-5">
            <div className="text-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">
                Before you can access your account
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Please complete the following steps:
              </p>
            </div>

            {/* Step 1 */}
            <div className="flex items-start space-x-4 p-4 rounded-lg bg-amber-50 border border-amber-200">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-amber-800 text-white font-bold">
                  1
                </div>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800 mb-1">
                  Verify Your Email Address
                </h3>
                <p className="text-sm text-gray-600 mb-2">
                  We've sent a verification link to your email. Click the link to verify your email address.
                </p>
                <div className="flex items-center text-xs text-amber-700">
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span>Link expires in 24 hours</span>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex items-start space-x-4 p-4 rounded-lg bg-blue-50 border border-blue-200">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white font-bold">
                  2
                </div>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800 mb-1">
                  Wait for Admin Approval
                </h3>
                <p className="text-sm text-gray-600 mb-2">
                  After email verification, an administrator will review and activate your account.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex items-start space-x-4 p-4 rounded-lg bg-green-50 border border-green-200">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-600 text-white font-bold">
                  3
                </div>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800 mb-1">
                  Start Using SARM
                </h3>
                <p className="text-sm text-gray-600">
                  Once approved, you'll receive an email notification and can sign in to access the system.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}