"use client";
import { api } from "@/trpc/react";
import { newDate } from "@/lib/utils";

export default function TestingPage() {
  const queryParams = {
    status: undefined,
    startDate: newDate(new Date("2025-09-20")),
    endDate: newDate(new Date("2025-09-30")),
  }

  const { data, isLoading } = api.resource.getAllBorrowingTransactions.useQuery(queryParams);

  if (isLoading) return <div className="mt-4 text-xl">Loading...</div>;

  return (
    <div className="mt-4 space-y-4">
      <div className="text-2xl font-bold">Available Resources on {queryParams.toString()}</div>
      {data?.map((item) => (
        <div
          key={item.id}
          className="rounded-2xl border p-4 shadow-sm bg-white"
        >
          {JSON.stringify(item)}
        </div>
      ))}
    </div>
  );
}
