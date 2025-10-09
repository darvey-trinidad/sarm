"use client";
import { useState, useEffect } from "react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { addDays, startOfWeek } from "date-fns";
import type { InitialClassroomSchedule } from "@/types/clasroom-schedule";
import { api } from "@/trpc/react";
import { TIME_ENTRIES, TIME_MAP } from "@/constants/timeslot";
import { Loader2 } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { getScheduleColor } from "@/constants/schedule-colors";
import PlottingFormDialog from "@/app/(app)/plotting/_components/plot/plotting-form-dialog";
import { Roles } from "@/constants/roles";
import { checkRoomAuthority } from "@/lib/utils";
import { DeptOrOrgValues } from "@/constants/dept-org";
import { ClassroomTypeValues } from "@/constants/classroom-type";
const SLOT_HEIGHT = 45;
const DaysofWeek = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

type PlottingClassroomCalendarViewProps = {
  classroomId: string;
};

export default function PlottingClassroomCalendarView({
  classroomId,
}: PlottingClassroomCalendarViewProps) {
  const [schedules, setSchedules] = useState<InitialClassroomSchedule[]>([]);
  const [selectedItem, setSelectedItem] =
    useState<InitialClassroomSchedule | null>(null);
  const [currentWeek, setCurrentWeek] = useState(() => new Date());
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { data: session } = authClient.useSession();
  const weekStart = startOfWeek(currentWeek, { weekStartsOn: 1 });
  const weekEnd = addDays(weekStart, 5);

  const { data: scheduleData, isLoading } =
    api.classroomSchedule.getWeeklyInitialClassroomSchedule.useQuery({
      classroomId,
    });

  const { data: currentClassroom } = api.classroom.getClassroomById.useQuery({ id: classroomId })

  useEffect(() => {
    setSchedules(scheduleData ?? []);
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

  const getScheduleStyle = (schedule: InitialClassroomSchedule) => {
    const startPos = timeToPosition(schedule.startTime);
    const endPos = timeToPosition(schedule.endTime);
    const height = Math.max(SLOT_HEIGHT, endPos - startPos);
    const color = getScheduleColor(schedule.subject ?? "Unoccupied");

    if (isMobile) {
      const headerHeight = 60;
      const timeColumnWidth = 100;
      const dayWidth = 280;
      const adjustedDay = schedule.day - 1;
      const leftPosition = dayWidth * adjustedDay + timeColumnWidth;

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
      const dayColumnWidth = 100 / 7;
      const leftPosition = schedule.day * dayColumnWidth;
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

  const handleScheduleClick = (schedule: InitialClassroomSchedule) => {
    if (session?.user.role !== Roles.FacilityManager) {
      const authorizedToRoom = checkRoomAuthority(session?.user.departmentOrOrganization ?? DeptOrOrgValues.ITDS,
        currentClassroom?.type ?? ClassroomTypeValues.Lecture);
      if (!authorizedToRoom) return;
    }
    setSelectedItem(schedule);
    setIsDialogOpen(true);
  };

  if (isLoading)
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Loader2 className="text-muted-foreground mx-auto mb-4 h-12 w-12 animate-spin" />
          <h3 className="text-foreground text-lg font-semibold">
            Loading classroom schedule...
          </h3>
          <p className="text-muted-foreground">
            Please wait while we fetch the data.
          </p>
        </div>
      </div>
    );

  return (
    <div className="space-y-4">
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
            {/* Days header */}
            <div className="bg-background sticky top-0 z-20 border-b">
              <div
                className={
                  isMobile
                    ? "relative flex min-w-[1780px]"
                    : "relative grid min-w-[800px] grid-cols-7"
                }
              >
                <div
                  className={`bg-muted/50 border-r p-3 ${isMobile ? "w-[100px]" : ""}`}
                />
                {DaysofWeek.map((day, index) => {
                  const dayDate = addDays(weekStart, index);
                  return (
                    <div
                      key={day}
                      className={`bg-muted/50 border-r p-3 last:border-r-0 ${isMobile ? "w-[280px]" : ""
                        }`}
                    >
                      <div className="py-1 text-sm font-medium">{day}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Time grid + schedules */}
            <div
              className={
                isMobile
                  ? "flex min-w-[1780px]"
                  : "relative grid min-w-[800px] grid-cols-7"
              }
            >
              <div
                className={`bg-muted/20 border-r ${isMobile ? "w-[100px]" : ""}`}
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
                  className={`relative border-r last:border-r-0 ${isMobile ? "w-[280px]" : ""
                    }`}
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
                    key={`${schedule.day}-${schedule.startTime}-${schedule.endTime}-${schedule.section} `}
                    className="absolute cursor-pointer rounded-md border-l-4 p-2 transition-all hover:z-20 hover:shadow-md"
                    style={getScheduleStyle(schedule)}
                    onClick={() => handleScheduleClick(schedule)}
                  >
                    <div className="truncate text-xs font-medium">
                      {schedule.subject && schedule.section
                        ? `${schedule.subject} - ${schedule.section}`
                        : "Unscheduled"}
                    </div>
                    <div className="text-muted-foreground truncate text-xs">
                      {`${TIME_MAP[schedule.startTime]} - ${TIME_MAP[schedule.endTime]}`}
                    </div>
                    {schedule.facultyName && (
                      <div className="text-muted-foreground truncate text-xs">
                        Faculty: {schedule.facultyName}
                      </div>
                    )}
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
      <PlottingFormDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        selectedItem={selectedItem}
        currentUser={session?.user}
      />
    </div>
  );
}
