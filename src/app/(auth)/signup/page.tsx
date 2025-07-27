"use client";
import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ROLES_OPTIONS, type Roles } from "@/constants/roles";
import { DEPARTMENT_OR_ORGANIZATION_OPTIONS } from "@/constants/dept-org";

import { api } from "@/trpc/react";

export default function SignUpPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("");
  const [departmentOrOrganization, setDepartmentOrOrganization] = useState("");

  const { mutate: signUpMutation, isError, isSuccess, error } = api.auth.signUp.useMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    signUpMutation({
      email,
      name,
      password,
      role: role as Roles,
      departmentOrOrganization,
    });
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
                Create your account
              </h2>
              <p className="text-sm text-gray-600">
                Just a few quick things to get started.
              </p>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name Field */}
              <div className="space-y-1">
                <Label
                  htmlFor="name"
                  className="text-sm font-medium text-gray-700"
                >
                  Name
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Juan Dela Cruz"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  required
                />
              </div>

              {/* Email Field */}
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

              {/* Password Field */}
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

              {/* Confirm Password Field */}
              <div className="space-y-1">
                <Label
                  htmlFor="confirmPassword"
                  className="text-sm font-medium text-gray-700"
                >
                  Confirm Password
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
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

              {/* Roles Selection */}
              <div className="space-y-1">
                <Label
                  htmlFor="role"
                  className="text-sm font-medium text-gray-700"
                >
                  Role
                </Label>
                <Select value={role} onValueChange={setRole}>
                  <SelectTrigger className="w-full border-gray-300">
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    {ROLES_OPTIONS.map((role) => (
                      <SelectItem key={role.value} value={role.value}>
                        {role.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {/* Department or Organization Selection */}
              <div className="space-y-1">
                <Label
                  htmlFor="role"
                  className="text-sm font-medium text-gray-700"
                >
                  Department or Organization
                </Label>
                <Select value={departmentOrOrganization} onValueChange={setDepartmentOrOrganization}>
                  <SelectTrigger className="w-full border-gray-300">
                    <SelectValue placeholder="Select a department or organization" />
                  </SelectTrigger>
                  <SelectContent>
                    {DEPARTMENT_OR_ORGANIZATION_OPTIONS.map((department) => (
                      <SelectItem key={department.value} value={department.value}>
                        {department.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button
                type="submit"
                className="w-full rounded-sm bg-amber-800 px-4 py-2 font-medium text-white transition-colors hover:bg-amber-900"
              >
                Sign Up
              </Button>
            </form>

            {/* Additional Links */}
            <div className="text-start">
              <Link
                href={"/login"}
                className="text-sm text-amber-700 hover:text-amber-800 hover:underline"
              >
                Already have an account?
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
