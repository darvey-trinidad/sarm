import { PageRoutes } from "@/constants/page-routes";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function AccountPendingPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // If no session or account is active, redirect
  if (!session) {
    redirect(PageRoutes.LOGIN);
  }

  if (session.user.isActive) {
    redirect(PageRoutes.DASHBOARD);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex min-h-[calc(100vh)] items-center justify-center p-8">
        <div className="w-full max-w-md space-y-6">

          {/* Clock Icon */}
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
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>

          {/* Message */}
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold text-amber-800">
              Account Pending Activation
            </h2>
            <p className="text-gray-600">
              Your account <span className="font-medium text-amber-800">{session.user.email}</span> is currently inactive...
            </p>
          </div>

          {/* Information Box */}
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 space-y-3">
            <p className="text-sm font-semibold text-gray-700">
              What happens next?
            </p>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start">
                <span className="mr-2 mt-0.5">•</span>
                <span>
                  Your account is currently under review by the administrator
                </span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 mt-0.5">•</span>
                <span>
                  You will receive an email notification once your account is activated
                </span>
              </li>
            </ul>
          </div>

          {/* Footer Note */}
          <div className="text-center text-xs text-gray-500">
            <p>
              Thank you for your patience. You may login as soon as your
              account is ready.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}