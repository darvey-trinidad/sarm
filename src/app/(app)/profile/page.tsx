import React from "react";
import { type Metadata } from "next";
import BreadcrumbLayout from "@/components/breadcrumb/page-breadcrumb";
import UserProfile from "./_components/user-profile";

export const metadata: Metadata = {
  title: "Profile",
};
const Profile = () => {
  return (
    <div className="flex w-full flex-col space-y-4">
      <BreadcrumbLayout currentPage="Profile" />
      <div className="flex flex-col">
        <h2 className="text-2xl font-bold">User Profile</h2>
        <p className="text-muted-foreground">
          View and manage your personal information.
        </p>
      </div>
      <UserProfile />
    </div>
  );
};

export default Profile;
