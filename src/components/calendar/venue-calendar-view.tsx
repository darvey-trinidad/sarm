"use client";

import { useState, useEffect } from "react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import { format, addDays, startOfWeek, addWeeks, subWeeks } from "date-fns";
import { TIME_ENTRIES, TIME_MAP } from "@/constants/timeslot";
import { newDate } from "@/lib/utils";
import { toTimeInt } from "@/lib/utils";
import { api } from "@/trpc/react";
import { ReservationStatus } from "@/constants/reservation-status";
import Link from "next/link";
const SLOT_HEIGHT = 45;
const DaysofWeek = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

type VenueCalendarViewProps = {
  venueId: string;
  venueName: string;
  venueCapacity: number;
};

export default function VenueCalendarView({
  venueId,
  venueName,
  venueCapacity,
}: VenueCalendarViewProps) {
  const [currentWeek, setCurrentWeek] = useState(() => new Date());
  const [isMobile, setIsMobile] = useState(false);

  const weekStart = startOfWeek(currentWeek, { weekStartsOn: 1 });
  const weekEnd = addDays(weekStart, 5);

  const {
    data: reservations,
    isLoading,
    isError,
  } = api.venue.getAllVenueReservationsForCalendarView.useQuery({
    venueId,
    status: ReservationStatus.Approved,
    startDate: newDate(weekStart),
    endDate: newDate(weekEnd),
  });

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const timeToIndex = (time: number) =>
    TIME_ENTRIES.findIndex(([key]) => key === time);

  const timeToPosition = (time: number) => {
    const index = timeToIndex(time);
    return index >= 0 ? index * SLOT_HEIGHT : 0;
  };

  const getDayOfWeek = (date: Date) => (date.getDay() + 6) % 7;

  type VenueReservation = NonNullable<typeof reservations>[number];

  const getReservationStyle = (res: VenueReservation) => {
    const startPos = timeToPosition(res.startTime);
    const endPos = timeToPosition(res.endTime);
    const height = Math.max(SLOT_HEIGHT, endPos - startPos);

    const color = "#3b82f6"; // blue for reservations

    if (isMobile) {
      const headerHeight = 60;
      const dayOfWeek = getDayOfWeek(new Date(res.date));

      const timeColumnWidth = 100;
      const dayWidth = 280;

      const leftPosition = dayWidth * dayOfWeek + timeColumnWidth;

      return {
        top: `${startPos + headerHeight}px`,
        height: `${height}px`,
        left: `${leftPosition}px`,
        width: `${dayWidth - 8}px`,
        backgroundColor: `${color}20`,
        borderLeftColor: color,
        zIndex: 10,
      };
    } else {
      const timeColumnWidth = 100 / 7;
      const dayColumnWidth = 100 / 7;
      const leftPosition =
        timeColumnWidth + getDayOfWeek(new Date(res.date)) * dayColumnWidth;

      return {
        top: `${startPos}px`,
        height: `${height}px`,
        left: `${leftPosition}%`,
        width: `${dayColumnWidth - 0.5}%`,
        backgroundColor: `${color}20`,
        borderLeftColor: color,
        zIndex: 10,
      };
    }
  };

  const navigateWeek = (direction: "prev" | "next") => {
    setCurrentWeek(
      direction === "prev"
        ? subWeeks(currentWeek, 1)
        : addWeeks(currentWeek, 1),
    );
  };

  const goToCurrentWeek = () => setCurrentWeek(new Date());

  if (isError) return <p>Failed to load reservations.</p>;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex flex-row items-center gap-4">
          <Link href="/schedule">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center bg-transparent"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>

          <div className="flex flex-col">
            <h1 className="text-3xl font-bold tracking-tight">{venueName}</h1>
            <p className="text-muted-foreground">
              Capacity - <strong>({venueCapacity})</strong>
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigateWeek("prev")}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <div className="bg-muted rounded-md px-3 py-1 text-xs font-medium sm:text-sm">
            {format(weekStart, "MMM d")} -{" "}
            {isMobile
              ? format(weekEnd, "MMM d")
              : format(weekEnd, "MMM d, yyyy")}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => navigateWeek("next")}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>

          <Button variant="outline" size="sm" onClick={goToCurrentWeek}>
            Today
          </Button>
        </div>
      </div>

      {/* Calendar */}
      <div className="bg-background rounded-lg border">
        <ScrollArea className="h-[75vh]">
          {isMobile ? (
            <>
              <ScrollBar orientation="horizontal" />
              <ScrollBar orientation="vertical" />
            </>
          ) : (
            <ScrollBar orientation="vertical" />
          )}
          <div className="relative">
            {/* Header */}
            <div className="bg-background sticky top-0 z-20 border-b">
              <div
                className={
                  isMobile
                    ? "relative flex min-w-[1780px]"
                    : "relative grid min-w-[800px] grid-cols-7"
                }
              >
                <div
                  className={`bg-muted/50 border-r p-3 ${isMobile ? "w-[100px] flex-shrink-0" : ""}`}
                />
                {DaysofWeek.map((day, index) => {
                  const dayDate = addDays(weekStart, index);
                  return (
                    <div
                      key={day}
                      className={`bg-muted/50 border-r p-3 last:border-r-0 ${isMobile ? "w-[280px] flex-shrink-2" : ""
                        }`}
                    >
                      <div className="text-sm font-medium">{day}</div>
                      <div className="text-muted-foreground text-xs">
                        {format(dayDate, "MMM d")}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Body */}
            <div
              className={
                isMobile
                  ? "flex min-w-[1780px]"
                  : "relative grid min-w-[800px] grid-cols-7"
              }
            >
              <div
                className={`bg-muted/20 border-r ${isMobile ? "w-[100px] flex-shrink-0 bg-white" : ""}`}
              >
                {TIME_ENTRIES.map(([value, label]) => (
                  <div
                    key={value}
                    className="h-[45px] border-b px-2 py-1 text-right text-xs"
                  >
                    {label}
                  </div>
                ))}
              </div>

              {Array.from({ length: 6 }).map((_, dayIndex) => (
                <div
                  key={dayIndex}
                  className={`relative border-r last:border-r-0 ${isMobile ? "w-[280px] flex-shrink-0" : ""}`}
                >
                  {TIME_ENTRIES.map(([value]) => (
                    <div
                      key={`${dayIndex}-${value}`}
                      className="h-[45px] border-b"
                    />
                  ))}
                </div>
              ))}

              {!isLoading &&
                reservations?.map((schedule) => (
                  <div
                    key={`${schedule.venueReservationId}-${schedule.date}`}
                    className="absolute cursor-pointer rounded-md border-l-4 p-2 transition-all hover:z-20 hover:shadow-md"
                    style={getReservationStyle(schedule)}
                  >
                    <div className="truncate text-xs font-medium">
                      {schedule.purpose}
                    </div>
                    <div className="text-muted-foreground truncate text-xs">
                      {`${TIME_MAP[toTimeInt(schedule.startTime)]} - ${TIME_MAP[toTimeInt(schedule.endTime)]}`}
                    </div>
                    <div className="text-muted-foreground truncate text-xs">
                      Reserved by: {schedule.reserverName}
                    </div>
                  </div>
                ))}

              {isLoading && (
                <div className="bg-background/50 absolute inset-0 z-30 flex items-center justify-center">
                  <div className="text-center">
                    <div className="border-primary mx-auto mb-2 h-8 w-8 animate-spin rounded-full border-b-2" />
                    <p className="text-muted-foreground text-sm">
                      Loading reservations...
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </ScrollArea>
      </div>

      {isMobile && (
        <div className="text-muted-foreground text-center text-xs">
          Scroll horizontally to view different days
        </div>
      )}
    </div>
  );
}
