"use client";
import type React from "react";
import { useState, useEffect, Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, LoaderCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { PageRoutes } from "@/constants/page-routes";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

// Separate component for the logic that uses useSearchParams
function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    if (searchParams.get("resetSuccess") === "true") {
      toast.success("Password reset successful! Please login with your new password.");
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await authClient.signIn.email(
        {
          email,
          password,
          callbackURL: PageRoutes.DASHBOARD,
        },
        {
          onSuccess: () => {
            toast.success("Sign in successful!");
          },
        },
      );

      if (error) {
        // Check if error is related to unverified email
        const errorMessage = error.message?.toLowerCase() ?? "";
        const isUnverifiedEmail =
          errorMessage.includes("verify") ||
          errorMessage.includes("verification") ||
          errorMessage.includes("not verified");

        if (isUnverifiedEmail) {
          // Auto-send verification email
          try {
            await authClient.sendVerificationEmail({
              email,
              callbackURL: PageRoutes.DASHBOARD,
            });

            toast.info("Please verify your email.\nWe've sent a new verification link to your email address.");

            // Redirect to verification page
            router.push(`/verify-email?email=${encodeURIComponent(email)}`);
          } catch (resendError) {
            toast.error("Failed to resend verification email. Please try again.");
          }
        } else {
          toast.error(error.message ?? "Sign in failed!");
        }
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md space-y-6">
      {/* Logo */}
      <div className="mb-2 ml-[-10px]">
        <Image
          src="/LOGO-DARK.png"
          alt="Bulacan State University Logo"
          width={100}
          height={100}
          className="object-contain"
        />
      </div>

      {/* Welcome Text */}
      <div>
        <h2 className="text-4xl font-bold text-amber-800">
          Welcome back!
        </h2>
        <p className="text-sm text-gray-600">Sign in to your account</p>
      </div>

      {/* Login Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1">
          <Label
            htmlFor="email"
            className="text-sm font-medium text-gray-700"
          >
            Email
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="your.email@bulsu.edu"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-amber-500 focus:outline-none"
            required
          />
        </div>

        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <Label
              htmlFor="password"
              className="text-sm font-medium text-gray-700"
            >
              Password
            </Label>
            <Link
              href="/forgot-password"
              className="text-xs text-amber-700 hover:text-amber-800 hover:underline"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 pr-10 focus:border-transparent focus:ring-2 focus:ring-amber-500 focus:outline-none"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        <div className="pt-2">
          <Button
            type="submit"
            className="w-full rounded-md bg-amber-800 px-4 py-2.5 font-medium text-white transition-colors hover:bg-amber-900 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <LoaderCircle className="mr-2 h-4 w-4 animate-spin text-white" />
                Logging In
              </span>
            ) : (
              "Log In"
            )}
          </Button>
        </div>
      </form>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-white px-4 text-gray-500">or</span>
        </div>
      </div>

      {/* Sign Up Section */}
      <div className="space-y-3">
        <p className="text-center text-sm text-gray-600">
          Don&apos;t have an account?
        </p>
        <Link href="/signup" className="block">
          <Button
            type="button"
            variant="outline"
            className="w-full rounded-md border-2 border-amber-800 bg-white px-4 py-2.5 font-medium text-amber-800 transition-colors hover:bg-amber-50"
          >
            Create Account
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex min-h-[calc(100vh)]">
        {/* Left Side - Login Form */}
        <div className="flex flex-1 items-center justify-center bg-white p-8">
          <Suspense fallback={<div>Loading...</div>}>
            <LoginForm />
          </Suspense>
        </div>

        {/* Right Side - University Gate Illustration */}
        <div className="relative hidden flex-1 items-center justify-center overflow-hidden bg-white lg:flex">
          <div className="max-w-1xl absolute h-full w-full">
            <Image
              src="/login-page-gate.png"
              alt="Bulacan State University Sarmiento Campus Gate"
              fill
              className="scale-110 object-contain"
              priority
            />
          </div>
        </div>
      </div>
    </div>
  );
}