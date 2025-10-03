"use client";
import { DataTable } from "@/components/table/data-table";
import { DataTableSkeleton } from "@/components/table/data-table-skeleton";
import { api } from "@/trpc/react";
import { columns } from "./columns";
export default function RoomTable() {
  const { data, isLoading } = api.classroom.getAllClassrooms.useQuery();

  return (
    <div className="space-y-4">
      {!isLoading && data ? (
        <DataTable
          columns={columns}
          data={data}
          searchKey="name"
          searchPlaceholder="Search by classroom..."
        />
      ) : (
        <DataTableSkeleton />
      )}
    </div>
  );
}
