import { Skeleton } from "@/components/ui/skeleton";
export const ReceivedRoomSkeleton = () => {
  return (
    <div className="md:grid-row-2 lg:grid-row-3 grid grid-cols-1 gap-4">
      <Skeleton className="h-26 w-full" />
      <Skeleton className="h-26 w-full" />
      <Skeleton className="h-26 w-full" />
    </div>
  );
};

export const CurrentScheduleSkeleton = () => {
  return (
    <div className="md:grid-row-2 lg:grid-row-3 grid grid-cols-1 gap-4">
      <Skeleton className="h-26 w-full" />
      <Skeleton className="h-26 w-full" />
      <Skeleton className="h-26 w-full" />
    </div>
  );
};

export const AvailableRoomSkeleton = () => {
  return (
    <div className="gap-4 space-y-6">
      <div className="flex items-center justify-between">
        <Skeleton className="h-10 w-[250px]" />
        <Skeleton className="h-10 w-[70px]" />
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Skeleton className="h-56 w-full" />
        <Skeleton className="h-56 w-full" />
        <Skeleton className="h-56 w-full" />
      </div>
    </div>
  );
};

export const ChartSkeleton = () => {
  return <Skeleton className="h-42 w-full" />;
};
