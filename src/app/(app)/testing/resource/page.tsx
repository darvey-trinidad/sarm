"use client";
import { api } from "@/trpc/react";
import { newDate } from "@/lib/utils";

export default function TestingPage() {
  const { data, isLoading } = api.resource.getAllAvailableResources.useQuery({
    requestedDate: newDate(new Date("2025-09-25")),
    requestedStartTime: "1500",
    requestedEndTime: "1600"
  });

  if (isLoading) return <div className="mt-4 text-xl">Loading...</div>;

  return (
    <div className="mt-4 space-y-4">
      {data?.map((item) => (
        <div
          key={item.id}
          className="rounded-2xl border p-4 shadow-sm bg-white"
        >
          <h2 className="text-lg font-semibold">{item.name}</h2>
          <p className="text-sm text-gray-600">{item.description}</p>
          <div className="mt-2 flex gap-4 text-sm">
            <span>Category: <span className="font-medium">{item.category}</span></span>
            <span>Total Stock: <span className="font-medium">{item.stock}</span></span>
            <span>Available: <span className="font-medium text-green-600">{item.available}</span></span>
          </div>
        </div>
      ))}
    </div>
  );
}
