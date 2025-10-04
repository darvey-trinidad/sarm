"use client";
import { Skeleton } from "@/components/ui/skeleton";
export default function CurrentScheduleSkeleton() {
  return (
    <div className="md:grid-row-2 lg:grid-row-3 grid grid-cols-1 gap-4">
      <Skeleton className="h-26 w-full" />
      <Skeleton className="h-26 w-full" />
      <Skeleton className="h-26 w-full" />
    </div>
  );
}
