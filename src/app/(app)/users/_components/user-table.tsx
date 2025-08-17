"use client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { UserPlus } from "lucide-react";
import { toast } from "sonner";
import { columns } from "./columns";
import { DataTable } from "@/components/table/data-table";
import { api } from "@/trpc/react";
import { DataTableSkeleton } from "@/components/table/data-table-skeleton";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  departmentOrOrganization: string;
  createdAt: Date;
  isActive: boolean;
}

export function UserTable() {
  const { data, isLoading, isError } = api.auth.getAllFaculty.useQuery();

  const safeData: User[] =
    data?.map((u) => ({
      id: u.id,
      name: u.name ?? "Unknown",
      email: u.email,
      role: u.role.replace(/_/g, " "),
      departmentOrOrganization: u.departmentOrOrganization ?? "N/A",
      createdAt: u.createdAt,
      isActive: u.isActive,
    })) ?? [];

  const formatRole = (role: string): string => {
    return role
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Users</h2>
          <p className="text-muted-foreground">
            Manage system users and their permissions
          </p>
        </div>
      </div>
      {!isLoading && data ? (
        <DataTable
          columns={columns}
          data={safeData}
          searchKey="name"
          searchPlaceholder="Search users..."
        />
      ) : (
        <DataTableSkeleton />
      )}
    </div>
  );
}
