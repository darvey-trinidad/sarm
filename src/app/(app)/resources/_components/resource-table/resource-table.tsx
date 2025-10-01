"use client";
import { useMemo } from "react";
import { DataTable } from "@/components/table/data-table";
import { DataTableSkeleton } from "@/components/table/data-table-skeleton";
import { api } from "@/trpc/react";
import { columns } from "./columns";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Filter, CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { TIME_OPTIONS } from "@/constants/timeslot";
import { newDate } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type ResourceTableProps = {
  requestedDate: Date | null;
  setRequestedDate: (d: Date | null) => void;
  requestedStartTime: string;
  setRequestedStartTime: (s: string) => void;
  requestedEndTime: string;
  setRequestedEndTime: (s: string) => void;
};
export default function ResourceTable({
  requestedDate,
  setRequestedDate,
  requestedStartTime,
  setRequestedStartTime,
  requestedEndTime,
  setRequestedEndTime,
}: ResourceTableProps) {
  const filter = useMemo(
    () => ({
      requestedDate: newDate(requestedDate ?? new Date()),
      requestedStartTime: requestedStartTime ?? "700",
      requestedEndTime: requestedEndTime ?? "2000",
    }),
    [requestedDate, requestedStartTime, requestedEndTime],
  );

  const { data, isLoading } = api.resource.getAllAvailableResources.useQuery({
    requestedDate: filter.requestedDate,
    requestedStartTime: filter.requestedStartTime,
    requestedEndTime: filter.requestedEndTime,
  });

  return (
    <div className="space-y-4">
      {/* Filter Section */}
      <div className="flex flex-row items-center gap-2">
        <Filter className="h-5 w-5" />
        <h3 className="font-semibold">Filters</h3>
      </div>
      <div className="space-y-5">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {/* requestedDate */}
          <div className="space-y-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !requestedDate && "text-muted-foreground",
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {requestedDate
                    ? format(requestedDate, "PPP")
                    : "Pick requested date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  captionLayout="dropdown"
                  selected={requestedDate ?? undefined}
                  onSelect={setRequestedDate}
                  disabled={(date) => {
                    const today = new Date();
                    today.setHours(0, 0, 0, 0); // normalize to midnight
                    return date < today || date < new Date("1900-01-01");
                  }}
                  required={true}
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* requestedStartTime  */}
          <div className="space-y-2">
            <Select
              onValueChange={(value) => setRequestedStartTime(value)}
              value={requestedStartTime.toString()}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select start time" />
              </SelectTrigger>
              <SelectContent>
                {TIME_OPTIONS.map((time) => (
                  <SelectItem key={time.value} value={time.value.toString()}>
                    {time.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* requestedEndTime  */}
          <div className="space-y-2">
            <Select
              onValueChange={(value) => setRequestedEndTime(value)}
              value={requestedEndTime.toString()}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select end time" />
              </SelectTrigger>
              <SelectContent>
                {TIME_OPTIONS.map((time) => (
                  <SelectItem key={time.value} value={time.value.toString()}>
                    {time.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Table */}
      {!isLoading && data ? (
        <DataTable
          columns={columns}
          data={data}
          searchKey="name"
          searchPlaceholder="Search by resource..."
        />
      ) : (
        <DataTableSkeleton />
      )}
    </div>
  );
}
