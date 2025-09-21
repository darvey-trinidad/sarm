"use client";
import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeOff, LoaderCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { PageRoutes } from "@/constants/page-routes";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);

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
        toast.error(error.message || "Sign in failed!");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex min-h-[calc(100vh)]">
        {/* Left Side - Login Form */}
        <div className="flex flex-1 items-center justify-center bg-white p-8">
          <div className="w-full max-w-md space-y-6">
            {/* Logo */}
            <div className="mb-2">
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
                <Label
                  htmlFor="password"
                  className="text-sm font-medium text-gray-700"
                >
                  Password
                </Label>
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

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(checked) =>
                    setRememberMe(checked as boolean)
                  }
                />
                <Label htmlFor="remember" className="text-sm text-gray-600">
                  Remember me
                </Label>
              </div>

              <Button
                type="submit"
                className="w-full rounded-sm bg-amber-800 px-4 py-2 font-medium text-white transition-colors hover:bg-amber-900 disabled:opacity-50"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center">
                    <LoaderCircle className="mr-2 h-4 w-4 animate-spin text-white" />
                    Logging In
                  </span>
                ) : (
                  "Log In"
                )}
              </Button>
            </form>

            {/* Additional Links */}
            <div className="mb-0 text-start">
              <a
                href="#"
                className="text-sm text-amber-700 hover:text-amber-800 hover:underline"
              >
                Forgot your password?
              </a>
            </div>
            <div className="text-start">
              <Link
                href={"/signup"}
                className="text-sm text-amber-700 hover:text-amber-800 hover:underline"
              >
                Don&apos;t have an account?
              </Link>
            </div>
          </div>
        </div>

        {/* Right Side - University Gate Illustration */}
        <div className="relative flex flex-1 items-center justify-center overflow-hidden bg-white">
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
