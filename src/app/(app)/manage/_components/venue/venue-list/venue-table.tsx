"use client";
import { DataTable } from "@/components/table/data-table";
import { DataTableSkeleton } from "@/components/table/data-table-skeleton";
import { columns } from "./columns";
import { api } from "@/trpc/react";
export default function VenueTable() {
  const { data, isLoading } = api.venue.getAllVenues.useQuery();
  return (
    <div className="space-y-4">
      {!isLoading && data ? (
        <DataTable
          columns={columns}
          data={data}
          searchKey="name"
          searchPlaceholder="Search by venue..."
        />
      ) : (
        <DataTableSkeleton />
      )}
    </div>
  );
}
