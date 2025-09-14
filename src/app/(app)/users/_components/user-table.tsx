"use client";
import { columns } from "./columns";
import { DataTable } from "@/components/table/data-table";
import { api } from "@/trpc/react";
import { DataTableSkeleton } from "@/components/table/data-table-skeleton";

export function UserTable() {
  const { data, isLoading, isError } = api.auth.getAllUsers.useQuery();

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
          data={data}
          searchKey="name"
          searchPlaceholder="Search users..."
        />
      ) : (
        <DataTableSkeleton />
      )}
    </div>
  );
}
