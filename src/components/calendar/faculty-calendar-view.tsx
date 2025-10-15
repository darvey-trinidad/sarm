"use client";

import { useState, useEffect } from "react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Filter, ChevronLeft, ChevronRight, ArrowLeft } from "lucide-react";
import { format, addDays, startOfWeek, addWeeks, subWeeks } from "date-fns";
import type { FinalClassroomSchedule } from "@/types/clasroom-schedule";
import { api } from "@/trpc/react";
import { TIME_ENTRIES, TIME_MAP } from "@/constants/timeslot";
import { checkRoomAuthority, newDate } from "@/lib/utils";
import { authClient } from "@/lib/auth-client";
import ScheduleActionDialog from "./schedule-action-dialog";
import { useScheduleActions } from "@/hooks/use-schedule-action";
import { getScheduleColor } from "@/constants/schedule-colors";
import { SCHEDULE_SOURCE } from "@/constants/schedule";
import { CLASSROOM_TYPE_LABELS, type ClassroomType } from "@/constants/classroom-type";
import Link from "next/link";
import { Roles } from "@/constants/roles";
import { DeptOrOrgValues } from "@/constants/dept-org";
import { PageRoutes } from "@/constants/page-routes";
const SLOT_HEIGHT = 45;
const DaysofWeek = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export default function FacultyCalendarView() {
  const [schedules, setSchedules] = useState<FinalClassroomSchedule[]>([]);
  const [selectedItem, setSelectedItem] =
    useState<FinalClassroomSchedule | null>(null);
  const [currentWeek, setCurrentWeek] = useState(() => new Date());
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const weekStart = startOfWeek(currentWeek, { weekStartsOn: 1 });
  const weekEnd = addDays(weekStart, 5);
  const { data: session } = authClient.useSession();

  const { markAsVacant, claimSlot, cancelBorrowing, requestToBorrow } =
    useScheduleActions({
      onRefresh: () => void refetch(),
    });

  const {
    data: scheduleData,
    isLoading,
    isError,
    refetch,
  } = api.classroomSchedule.getWeeklyFacultySchedule.useQuery({
    facultyId: session?.user.id ?? "",
    startDate: newDate(weekStart),
    endDate: newDate(weekEnd),
  }, {
    enabled: !!session?.user.id
  });

  useEffect(() => {
    if (scheduleData) setSchedules(scheduleData);
    else setSchedules([]);
  }, [scheduleData]);

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

  const getScheduleStyle = (schedule: FinalClassroomSchedule) => {
    const startPos = timeToPosition(schedule.startTime);
    const endPos = timeToPosition(schedule.endTime);
    const height = Math.max(SLOT_HEIGHT, endPos - startPos);
    const color = getScheduleColor(schedule.source);

    if (isMobile) {
      const headerHeight = 60;
      const dayOfWeek = getDayOfWeek(schedule.date);

      // width handling
      const timeColumnWidth = 100;
      const dayWidth = 280;

      // horizontal position
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
        timeColumnWidth + getDayOfWeek(schedule.date) * dayColumnWidth;
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

  const handleScheduleClick = (schedule: FinalClassroomSchedule) => {
    if (schedule.source !== SCHEDULE_SOURCE.InitialSchedule && schedule.source !== SCHEDULE_SOURCE.Borrowing) return

    const now = new Date();
    const dateToday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
    );
    const schedDate = new Date(
      schedule.date.getFullYear(),
      schedule.date.getMonth(),
      schedule.date.getDate(),
    );

    const schedIsPast =
      schedDate < dateToday ||
      (schedDate.getTime() === dateToday.getTime() &&
        schedule.endTime <
        now.getHours() * 100 + (now.getMinutes() * 100) / 60);

    if (schedIsPast) return;

    if (session?.user.role !== Roles.FacilityManager &&
      session?.user.role !== Roles.DepartmentHead &&
      session?.user.role !== Roles.Faculty &&
      session?.user.role !== Roles.PEInstructor
    ) return

    setSelectedItem(schedule);
    setIsDialogOpen(true);
  };

  const navigateWeek = (direction: "prev" | "next") => {
    setCurrentWeek(
      direction === "prev"
        ? subWeeks(currentWeek, 1)
        : addWeeks(currentWeek, 1),
    );
  };

  const goToCurrentWeek = () => setCurrentWeek(new Date());

  if (isError) return <p>Failed to load schedule.</p>;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex flex-row items-center gap-4">
          <Link href={PageRoutes.DASHBOARD}>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center bg-transparent"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>

          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              My Classes
            </h1>
            <p className="text-muted-foreground">
              View your classes or mark them as vacant here
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
                schedules.map((schedule) => (
                  <div
                    key={`${schedule.date.toISOString()}-${schedule.startTime}`}
                    className="absolute cursor-pointer rounded-md border-l-4 p-2 transition-all hover:z-20 hover:shadow-md"
                    style={getScheduleStyle(schedule)}
                    onClick={() => handleScheduleClick(schedule)}
                  >
                    {schedule.source === SCHEDULE_SOURCE.Borrowing && (
                      <div className="truncate text-xs font-medium">
                        Borrowed Time
                      </div>
                    )}
                    <div className="truncate text-xs font-medium">
                      {schedule.source === "Initial Schedule" || schedule.source === "Borrowing"
                        ? `${schedule.subject} - ${schedule.section}`
                        : "Free Time"}
                    </div>
                    <div className="text-muted-foreground truncate text-xs">
                      {`${TIME_MAP[schedule.startTime]} - ${TIME_MAP[schedule.endTime]}`}
                    </div>
                  </div>
                ))}

              {isLoading && (
                <div className="bg-background/50 absolute inset-0 z-30 flex items-center justify-center">
                  <div className="text-center">
                    <div className="border-primary mx-auto mb-2 h-8 w-8 animate-spin rounded-full border-b-2" />
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

      {isMobile && (
        <div className="text-muted-foreground text-center text-xs">
          Scroll horizontally to view different days
        </div>
      )}

      <ScheduleActionDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        selectedItem={selectedItem}
        currentUser={session?.user}
        onMarkVacant={markAsVacant}
        onClaimSlot={claimSlot}
        onCancelBorrowing={cancelBorrowing}
        onRequestToBorrow={requestToBorrow}
      />
    </div>
  );
}
