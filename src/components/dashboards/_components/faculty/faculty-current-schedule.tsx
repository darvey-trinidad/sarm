"use client";
import { useMemo, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { formatISODate, newDate, toTimeInt } from "@/lib/utils";
import { api } from "@/trpc/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CurrentScheduleSkeleton } from "../skeletons/received-room-skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Building2,
  MapPin,
  Calendar,
  BookOpen,
  School,
  Clock,
  DoorOpen,
} from "lucide-react";
import { TIME_MAP } from "@/constants/timeslot";
import { Button } from "@/components/ui/button";
import ScheduleMarkVacantDialog from "../schedule-mark-vacant-dialog";
import type { FinalClassroomSchedule } from "@/types/clasroom-schedule";
import { toast } from "sonner";
import { NoScheduleFound } from "../no-data-mesage/dahsboard-nothing-found";
export default function FacultyCurrentSchedule() {
  const { data: session } = authClient.useSession();
  // Memoize the query input
  const queryInput = useMemo(() => {
    return {
      facultyId: session?.user.id ?? "",
      date: newDate(new Date()),
    };
  }, [session?.user.id]);

  const { data: facultySchedule, isLoading } =
    api.classroomSchedule.getProfessorSchedulesForDate.useQuery(queryInput);

  const [selectedSchedule, setSelectedSchedule] =
    useState<FinalClassroomSchedule | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { mutate: createClassroomVacancy } =
    api.classroomSchedule.createClassroomVacancy.useMutation();

  // Handler passed to the dialog
  const handleConfirm = async (
    classroomId: string,
    startTime: string,
    endTime: string,
    date: Date,
  ) => {
    await createClassroomVacancy(
      {
        classroomId,
        startTime,
        endTime,
        date,
      },
      {
        onSuccess: () => {
          toast.success("Vacancy marked as available");
        },
        onError: () => {
          toast.error("Failed to mark as available");
        },
      },
    );
  };

  return (
    <Card className="w-full p-6">
      <h3 className="text-xl font-medium">Current Schedules</h3>

      <ScrollArea className="h-[300px]">
        <div className="space-y-4">
          {isLoading ? (
            <CurrentScheduleSkeleton />
          ) : facultySchedule?.length === 0 ? (
            <NoScheduleFound />
          ) : (
            facultySchedule?.map((schedule) => (
              <div key={schedule.id} className="grid-row-2 grid">
                <Card className="border-border gap-2 transition-shadow hover:shadow-md">
                  <CardHeader>
                    <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-2">
                          <div className="bg-primary/10 flex h-12 w-12 items-center justify-center rounded-lg">
                            <School className="text-primary h-6 w-6" />
                          </div>
                          <div>
                            <CardTitle className="text-lg">
                              {schedule.section}
                            </CardTitle>
                            <div className="text-muted-foreground flex items-center gap-1 text-sm">
                              <BookOpen className="h-3.5 w-3.5" />
                              <span>{schedule.subject}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedSchedule(schedule);
                          setIsDialogOpen(true);
                        }}
                      >
                        <DoorOpen className="h-4 w-4" />
                        <span>Mark as Vacant</span>
                      </Button>
                    </div>
                  </CardHeader>

                  <CardContent>
                    <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                      <div className="bg-muted/50 flex items-center gap-2 rounded-lg p-3">
                        <Building2 className="text-muted-foreground h-4 w-4" />
                        <div className="flex flex-col">
                          <span className="text-muted-foreground text-xs">
                            Building
                          </span>
                          <span className="font-medium">
                            {schedule.buildingName}
                          </span>
                        </div>
                      </div>

                      <div className="bg-muted/50 flex items-center gap-2 rounded-lg p-3">
                        <MapPin className="text-muted-foreground h-4 w-4" />
                        <div className="flex flex-col">
                          <span className="text-muted-foreground text-xs">
                            Classroom
                          </span>
                          <span className="font-medium">
                            Room {schedule.classroomName}
                          </span>
                        </div>
                      </div>

                      <div className="bg-muted/50 flex items-center gap-2 rounded-lg p-3">
                        <Calendar className="text-muted-foreground h-4 w-4" />
                        <div className="flex flex-col">
                          <span className="text-muted-foreground text-xs">
                            Date
                          </span>
                          <span className="font-medium">
                            {formatISODate(schedule.date)}
                          </span>
                        </div>
                      </div>

                      <div className="bg-muted/50 flex items-center gap-2 rounded-lg p-3">
                        <Clock className="text-muted-foreground h-4 w-4" />
                        <div className="flex flex-col">
                          <span className="text-muted-foreground text-xs">
                            Time
                          </span>
                          <span className="font-medium">
                            {`${TIME_MAP[toTimeInt(schedule.startTime)]}`} {""}{" "}
                            -{""}
                            {`${TIME_MAP[toTimeInt(schedule.endTime)]}`}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))
          )}
        </div>
      </ScrollArea>
      {/* Dialog */}
      {selectedSchedule && (
        <ScheduleMarkVacantDialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          selectedSchedule={selectedSchedule}
          onConfirm={handleConfirm}
        />
      )}
    </Card>
  );
}
