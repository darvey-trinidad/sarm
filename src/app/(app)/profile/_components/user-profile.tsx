"use client";
import { authClient } from "@/lib/auth-client";
type UserProfileProps = {
  user: {
    name: string;
    role: string;
    email: string;
    departmentOrOrganization: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
  } | null;
};
export default function UserProfile({ user: InitialUser }: UserProfileProps) {
  return (
    <div className="min-h-screen">
      <div className=""></div>
    </div>
  );
}
