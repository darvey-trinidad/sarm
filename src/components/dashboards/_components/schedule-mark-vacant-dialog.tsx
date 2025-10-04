"use client";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { formatISODate, toTimeInt } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { DoorOpen, Clock, Building, Calendar, MapPin } from "lucide-react";
import { type FinalClassroomSchedule } from "@/types/clasroom-schedule";
import { TIME_MAP } from "@/constants/timeslot";
type ScheduleMarkVacantDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedSchedule: FinalClassroomSchedule;
  onConfirm: (
    scheduleId: string,
    startTime: string,
    endTime: string,
    date: Date,
  ) => Promise<void>;
};

export default function ScheduleMarkVacantDialog({
  open,
  onOpenChange,
  selectedSchedule,
  onConfirm,
}: ScheduleMarkVacantDialogProps) {
  const [submitting, setSubmitting] = useState(false);

  // time state
  const [startTime, setStartTime] = useState<string>();
  const [endTime, setEndTime] = useState<string>();
  const [error, setError] = useState<string | null>(null);

  const handleConfirm = async () => {
    if (!selectedSchedule?.id) return;

    // validate
    if (!startTime || !endTime) {
      setError("Both start and end times are required.");
      return;
    }
    if (Number(startTime) >= Number(endTime)) {
      setError("End time must be later than start time.");
      return;
    }

    setError(null);
    setSubmitting(true);
    try {
      await onConfirm(
        selectedSchedule.classroomId,
        startTime,
        endTime,
        selectedSchedule.date,
      );
      onOpenChange(false);
    } catch (err) {
      console.error("Failed to mark as vacant:", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-xl border border-gray-200 shadow-md sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-bold">
            <DoorOpen className="text-primary h-5 w-5" />
            Mark Schedule as Vacant
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            This will free up the classroom schedule and make it available for
            borrowing.
          </DialogDescription>
        </DialogHeader>

        {selectedSchedule ? (
          <div className="space-y-4">
            {/* Subject and Section */}

            <h3 className="font-semibold">
              {selectedSchedule.subject} - {selectedSchedule.section}
            </h3>

            {/* Details */}
            <div className="text-muted-foreground grid grid-cols-1 space-y-2 text-sm sm:grid-cols-2">
              <div className="flex items-center gap-2">
                <Building className="h-4 w-4" />
                <span className="text-black">
                  {selectedSchedule.buildingName}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span className="text-black">
                  Room {selectedSchedule.classroomName}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span className="text-black">
                  {formatISODate(selectedSchedule.date)}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span className="text-black">
                  {`${TIME_MAP[toTimeInt(selectedSchedule.startTime)]}`} -{" "}
                  {`${TIME_MAP[toTimeInt(selectedSchedule.endTime)]}`}
                </span>
              </div>
            </div>

            <Separator />

            {/* Time Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Adjust Time Range</label>
              <div className="flex items-center gap-3">
                <div className="flex flex-1 flex-col">
                  <span className="text-muted-foreground text-xs">
                    Start Time
                  </span>
                  {/* Start Time */}
                  <Select
                    value={startTime}
                    onValueChange={(value) => setStartTime(value)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select start time" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(TIME_MAP)
                        .filter(([timeInt]) => {
                          const t = toTimeInt(Number(timeInt));
                          return (
                            t >= selectedSchedule.startTime &&
                            t < selectedSchedule.endTime
                          );
                        })
                        .map(([timeInt, label]) => (
                          <SelectItem key={timeInt} value={timeInt}>
                            {label}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex flex-1 flex-col">
                  <span className="text-muted-foreground text-xs">
                    End Time
                  </span>
                  {/* End Time */}
                  <Select
                    value={endTime}
                    onValueChange={(value) => setEndTime(value)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select end time" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(TIME_MAP)
                        .filter(([timeInt]) => {
                          const t = toTimeInt(Number(timeInt));
                          return (
                            t > selectedSchedule.startTime &&
                            t <= selectedSchedule.endTime
                          );
                        })
                        .map(([timeInt, label]) => (
                          <SelectItem key={timeInt} value={timeInt}>
                            {label}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
            </div>
          </div>
        ) : (
          <p className="text-muted-foreground mt-4 text-center text-sm italic">
            No schedule selected
          </p>
        )}

        <DialogFooter className="mt-6 flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={submitting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={!selectedSchedule || submitting}
          >
            {submitting ? "Marking..." : "Mark as Vacant"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
