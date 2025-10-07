"use client";
import React from "react";
import BreadcrumbLayout from "@/components/breadcrumb/page-breadcrumb";
import UserProfile from "./_components/user-profile";
import { authClient } from "@/lib/auth-client";

const Profile = () => {
  const { data: userProfile } = authClient.useSession();

  return (
    <div className="flex w-full flex-col space-y-4">
      <BreadcrumbLayout currentPage="Profile" />
    </div>
  );
};

export default Profile;
