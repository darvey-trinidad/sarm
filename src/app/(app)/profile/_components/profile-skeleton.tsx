"use client";
import { Skeleton } from "@/components/ui/skeleton";

export function ProfileSkeleton() {
  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex flex-col gap-4">
        <Skeleton className="h-60 w-60 rounded-full" />
        <Skeleton className="h-4 w-15" />
        <Skeleton className="h-4 w-15" />
      </div>

      <div className="flex flex-col gap-4">
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    </div>
  );
}
