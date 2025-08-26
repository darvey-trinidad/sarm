"use client";

import { useState, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Info, Filter, ChevronLeft, ChevronRight } from "lucide-react";
import { format, addDays, startOfWeek, addWeeks, subWeeks } from "date-fns";
import type { FinalClassroomSchedule } from "@/types/clasroom-schedule";
import { api } from "@/trpc/react";
import { date } from "better-auth";
import { da } from "date-fns/locale";

//6:00 to 24:00
const timeSlots = Array.from({ length: 25 }, (_, i) => {
  const hour = i + 6;
  const displayHour = hour > 24 ? hour - 24 : hour;
  return {
    time: `${displayHour.toString().padStart(2, "0")}:00`,
    minutes: hour * 60,
  };
});

const DaysofWeek = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

interface ClassroomCalendarViewProps {
  classroomId: string;
  buildingName?: string;
  roomName?: string;
}

export default function ClassroomCalendarView({
  classroomId,
  buildingName,
  roomName = "Room",
}: ClassroomCalendarViewProps) {
  const [schedules, setSchedules] = useState<FinalClassroomSchedule[]>([]);
  const [setSelecteditems, setSelectedItems] = useState<
    FinalClassroomSchedule[]
  >([]);
  const [currentWeek, setCurrentWeek] = useState(() => new Date());
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const weekStart = startOfWeek(currentWeek, { weekStartsOn: 1 });
  const weekEnd = addDays(weekStart, 5);

  // Fetch schedule data
  const {
    data: scheduleData,
    isLoading,
    isError,
    refetch,
  } = api.classroomSchedule.getWeeklyClassroomSchedule.useQuery({
    classroomId: classroomId,
    startDate: weekStart,
    endDate: weekEnd,
  });

  useEffect(() => {
    if (scheduleData) {
      setSchedules(scheduleData);
    } else {
      setSchedules([]);
    }
  }, [scheduleData]);

  // Time position calculation
  const timeToPosition = (minutes: number) => {
    const startMinutes = 6 * 60; // 6:00 AM
    const relativeMinutes = minutes - startMinutes;
    return Math.max(0, (relativeMinutes / 60) * 60); // 60px per hour
  };

  // Get day of week from date
  const getDayOfWeek = (date: Date) => {
    return (date.getDay() + 6) % 7; // Convert to Monday = 0
  };

  // Get schedule color based on source
  const getScheduleColor = (source: string) => {
    switch (source) {
      case "Vacancy":
        return "#10b981"; // green
      case "Borrowing":
        return "#f59e0b"; // orange
      case "Unoccupied":
        return "#6b7280"; // gray
      default:
        return "#3b82f6"; // blue for classes
    }
  };

  // Calculate schedule block position and height
  const getScheduleStyle = (schedule: FinalClassroomSchedule) => {
    const startPos = timeToPosition(schedule.startTime);
    const endPos = timeToPosition(schedule.endTime);
    const height = Math.max(30, endPos - startPos); // Minimum 30px height
    //const dayOfWeek = getDayOfWeek(schedule.date);

    // Account for grid structure: time column (1/7) + day columns (6/7)
    const timeColumnWidth = 100 / 7; // ~14.28%
    const dayColumnWidth = 100 / 7; // ~14.28%
    const leftPosition =
      timeColumnWidth + getDayOfWeek(schedule.date) * dayColumnWidth;

    const color = getScheduleColor(schedule.source);

    return {
      top: `${startPos}px`,
      height: `${height}px`,
      left: `${leftPosition}%`,
      width: `${dayColumnWidth - 0.5}%`, // Slightly smaller to show borders
      backgroundColor: `${color}20`, // Add transparency
      borderLeftColor: color,
      zIndex: 10,
    };
  };

  // Handle schedule item click
  const handleScheduleClick = (schedule: FinalClassroomSchedule) => {
    setSelectedItems([schedule]);
    setIsDialogOpen(true);
  };

  // Week navigation
  const goToPreviousWeek = () => {
    setCurrentWeek((prev) => subWeeks(prev, 1));
  };

  const goToNextWeek = () => {
    setCurrentWeek((prev) => addWeeks(prev, 1));
  };

  const goToCurrentWeek = () => {
    setCurrentWeek(new Date());
  };

  if (isError) {
    return <p>Failed to load schedule.</p>;
  }

  return (
    <div className="space-y-4">
      {/* Header with navigation */}
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-2xl font-bold">
            {buildingName} - {roomName}
          </h2>
          <p className="text-muted-foreground">Classroom Schedule</p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={goToPreviousWeek}>
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <div className="bg-muted rounded-md px-3 py-1 text-sm font-medium">
            {format(weekStart, "MMM d")} - {format(weekEnd, "MMM d, yyyy")}
          </div>

          <Button variant="outline" size="sm" onClick={goToNextWeek}>
            <ChevronRight className="h-4 w-4" />
          </Button>

          <Button variant="outline" size="sm" onClick={goToCurrentWeek}>
            Today
          </Button>

          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" />
            Filters
          </Button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="bg-background rounded-lg border">
        <ScrollArea className="h-[600px]">
          <div className="relative">
            {/* Calendar Header */}
            <div className="bg-background sticky top-0 z-20 border-b">
              <div className="grid min-w-[800px] grid-cols-7">
                {/* Empty cell for time column */}
                <div className="bg-muted/50 border-r p-3"></div>

                {/* Day headers */}
                {DaysofWeek.map((day: string, index: number) => {
                  const dayDate = addDays(weekStart, index);
                  return (
                    <div
                      key={day}
                      className="bg-muted/50 border-r p-3 last:border-r-0"
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

            {/* Calendar Body */}
            <div className="relative grid min-w-[800px] grid-cols-7">
              {/* Time slots */}
              <div className="bg-muted/20 border-r">
                {timeSlots.map((slot) => (
                  <div
                    key={slot.time}
                    className="h-[60px] border-b px-2 py-1 text-right text-xs"
                  >
                    {slot.time}
                  </div>
                ))}
              </div>

              {/* Day columns */}
              {Array.from({ length: 6 }).map((_, dayIndex) => (
                <div
                  key={dayIndex}
                  className="relative border-r last:border-r-0"
                >
                  {timeSlots.map((slot, timeIndex) => (
                    <div
                      key={`${dayIndex}-${timeIndex}`}
                      className="h-[60px] border-b"
                    ></div>
                  ))}
                </div>
              ))}

              {/* Schedule blocks */}
              {!loading &&
                schedules.map((schedule) => (
                  <div
                    key={
                      schedule.id || `${schedule.date}-${schedule.startTime}`
                    }
                    className="absolute cursor-pointer rounded-md border-l-4 p-2 transition-all hover:z-20 hover:shadow-md"
                    style={getScheduleStyle(schedule)}
                    onClick={() => handleScheduleClick(schedule)}
                  >
                    <div className="truncate text-xs font-medium">
                      {schedule.source === "Initial Schedule"
                        ? `${schedule.subject} - ${schedule.section}`
                        : schedule.source}
                    </div>
                    <div className="text-muted-foreground truncate text-xs">
                      {`${schedule.startTime} - ${schedule.endTime}`}
                    </div>
                    {schedule.facultyId && (
                      <div className="text-muted-foreground truncate text-xs">
                        Faculty: {schedule.facultyId}
                      </div>
                    )}
                  </div>
                ))}

              {/* Loading overlay */}
              {loading && (
                <div className="bg-background/50 absolute inset-0 z-30 flex items-center justify-center">
                  <div className="text-center">
                    <div className="border-primary mx-auto mb-2 h-8 w-8 animate-spin rounded-full border-b-2"></div>
                    <p className="text-muted-foreground text-sm">
                      Loading schedule...
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
