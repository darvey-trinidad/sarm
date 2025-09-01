import React from "react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  CalendarIcon,
  Clock,
  User,
  AlertTriangle,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { type FinalClassroomSchedule } from "@/types/clasroom-schedule";
import { SCHEDULE_SOURCE } from "@/constants/schedule";
import { TIME_OPTIONS, TIME_MAP, type TimeInt } from "@/constants/timeslot";
import { type BetterAuthSession } from "@/lib/auth-client";
import { type BorrowingData } from "@/hooks/use-schedule-action";
import { toTimeInt } from "@/lib/utils";

type UserSession = BetterAuthSession["user"] | undefined;

interface ScheduleActionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedItem: FinalClassroomSchedule | null;
  currentUser: UserSession;
  onMarkVacant: (scheduleId: string, reason: string) => Promise<void>;
  onClaimSlot: (
    scheduleId: string,
    borrowingData: BorrowingData,
  ) => Promise<void>;
  onCancelBorrowing: (scheduleId: string) => Promise<void>;
}
export default function ScheduleActionDialog({
  open,
  onOpenChange,
  selectedItem,
  currentUser,
  onMarkVacant,
  onClaimSlot,
  onCancelBorrowing,
}: ScheduleActionDialogProps) {
  const [loading, setLoading] = useState(false);
  const [vacancyReason, setVacancyReason] = useState("");
  const [borrowingData, setBorrowingData] = useState<BorrowingData>({
    classroomId: selectedItem?.classroomId || "",
    facultyId: currentUser?.id || "",
    date: selectedItem?.date || new Date(),
    startTime: toTimeInt(selectedItem?.startTime),
    endTime: toTimeInt(selectedItem?.endTime),
    subject: "",
    section: "",
  });

  if (!selectedItem) return null;

  // Determine what actions are available
  const isOwnSchedule =
    (currentUser?.role === "faculty" || "department_head") &&
    selectedItem.facultyId === currentUser?.id &&
    selectedItem.source === SCHEDULE_SOURCE.InitialSchedule;

  const isVacantSlot = selectedItem.source === SCHEDULE_SOURCE.Vacancy;
  const isUnoccupiedSlot = selectedItem.source === SCHEDULE_SOURCE.Unoccupied;
  const isBorrowedByUser =
    selectedItem.source === SCHEDULE_SOURCE.Borrowing &&
    selectedItem.facultyId === currentUser?.id;

  const canMarkVacant = isOwnSchedule;
  const canClaim = isVacantSlot || isUnoccupiedSlot;
  const canCancel = isBorrowedByUser;

  // Helper functions
  const formatTime = (timeInt: TimeInt) => {
    return TIME_MAP[timeInt] || `${timeInt}`;
  };

  const getAvailableStartTimes = () => {
    const selectedStartTime = toTimeInt(selectedItem.startTime);
    const selectedEndTime = toTimeInt(selectedItem.endTime);

    return TIME_OPTIONS.filter(
      (option) =>
        option.value >= selectedStartTime && option.value < selectedEndTime,
    );
  };

  const getAvailableEndTimes = () => {
    const selectedStartTime = toTimeInt(selectedItem.startTime);
    const selectedEndTime = toTimeInt(selectedItem.endTime);

    return TIME_OPTIONS.filter(
      (option) =>
        option.value > borrowingData.startTime &&
        option.value <= selectedEndTime,
    );
  };

  const getScheduleTypeInfo = () => {
    switch (selectedItem.source) {
      case SCHEDULE_SOURCE.InitialSchedule:
        return {
          icon: <CalendarIcon className="h-4 w-4" />,
          label: "Scheduled Class",
          color: "bg-green-100 text-green-800",
        };
      case SCHEDULE_SOURCE.Vacancy:
        return {
          icon: <CheckCircle className="h-4 w-4" />,
          label: "Available (Vacant)",
          color: "bg-orange-100 text-orange-800",
        };
      case SCHEDULE_SOURCE.Borrowing:
        return {
          icon: <User className="h-4 w-4" />,
          label: "Borrowed",
          color: "bg-blue-100 text-blue-800",
        };
      case SCHEDULE_SOURCE.Unoccupied:
        return {
          icon: <Clock className="h-4 w-4" />,
          label: "Unoccupied",
          color: "bg-gray-100 text-gray-800",
        };
      default:
        return {
          icon: <Clock className="h-4 w-4" />,
          label: "Unknown",
          color: "bg-gray-100 text-gray-800",
        };
    }
  };

  const handleMarkVacant = async () => {
    if (!selectedItem.id || !vacancyReason.trim()) return;

    setLoading(true);
    try {
      await onMarkVacant(selectedItem.id, vacancyReason);
      onOpenChange(false);
      setVacancyReason("");
    } catch (error) {
      console.error("Error marking as vacant:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleClaimSlot = async () => {
    if (!selectedItem.id || !borrowingData.subject || !borrowingData.section)
      return;

    // Validate time range
    if (borrowingData.startTime >= borrowingData.endTime) {
      alert("End time must be after start time");
      return;
    }

    // Validate time is within available slot
    if (
      borrowingData.startTime < selectedItem.startTime ||
      borrowingData.endTime > selectedItem.endTime
    ) {
      alert("Selected time must be within the available time slot");
      return;
    }

    setLoading(true);
    try {
      await onClaimSlot(selectedItem.id, borrowingData);
      onOpenChange(false);
      setBorrowingData({
        classroomId: selectedItem?.classroomId || "",
        facultyId: currentUser?.id || "",
        date: selectedItem?.date || new Date(),
        startTime: toTimeInt(selectedItem?.startTime),
        endTime: toTimeInt(selectedItem?.endTime),
        subject: "",
        section: "",
      });
    } catch (error) {
      console.error("Error claiming slot:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBorrowing = async () => {
    if (!selectedItem.id) return;

    setLoading(true);
    try {
      await onCancelBorrowing(selectedItem.id);
      onOpenChange(false);
    } catch (error) {
      console.error("Error canceling borrowing:", error);
    } finally {
      setLoading(false);
    }
  };

  const scheduleTypeInfo = getScheduleTypeInfo();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-lg overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {scheduleTypeInfo.icon}
            Schedule Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Schedule Info */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">
                {selectedItem.source === SCHEDULE_SOURCE.InitialSchedule &&
                selectedItem.subject
                  ? `${selectedItem.subject} - ${selectedItem.section}`
                  : selectedItem.source}
              </h3>
              <Badge className={scheduleTypeInfo.color}>
                {scheduleTypeInfo.label}
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Clock className="text-muted-foreground h-3 w-3" />
                <span>
                  {formatTime(toTimeInt(selectedItem.startTime))} -{" "}
                  {formatTime(toTimeInt(selectedItem.endTime))}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <CalendarIcon className="text-muted-foreground h-3 w-3" />
                <span>{selectedItem.date.toLocaleDateString()}</span>
              </div>
            </div>

            {selectedItem.facultyName && (
              <div className="flex items-center gap-2 text-sm">
                <User className="text-muted-foreground h-3 w-3" />
                <span>Faculty: {selectedItem.facultyName}</span>
              </div>
            )}
          </div>

          <Separator />

          {/* Actions */}
          {canMarkVacant && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-medium">
                <AlertTriangle className="h-4 w-4 text-orange-500" />
                Mark Class as Vacant
              </div>
              <div className="space-y-2">
                <Label htmlFor="reason">Reason for vacancy</Label>
                <Textarea
                  id="reason"
                  placeholder="e.g., Faculty meeting, sick leave, conference..."
                  value={vacancyReason}
                  onChange={(e) => setVacancyReason(e.target.value)}
                  rows={3}
                />
              </div>
              <Button
                onClick={handleMarkVacant}
                disabled={loading || !vacancyReason.trim()}
                className="w-full"
              >
                {loading ? "Marking as Vacant..." : "Mark as Vacant"}
              </Button>
            </div>
          )}

          {canClaim && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-medium">
                <CheckCircle className="h-4 w-4 text-green-500" />
                Borrow Room for Class
              </div>

              <div className="rounded-md border border-blue-200 bg-blue-50 p-3">
                <p className="text-sm text-blue-800">
                  <strong>Available Time:</strong>{" "}
                  {formatTime(toTimeInt(selectedItem.startTime))} -{" "}
                  {formatTime(toTimeInt(selectedItem.endTime))}
                </p>
                <p className="mt-1 text-xs text-blue-600">
                  You can borrow any portion of this time slot. The remaining
                  time will stay available.
                </p>
              </div>

              <div className="space-y-4">
                {/* Subject and Section */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="subject">
                      Subject <span className="text-red-600">*</span>
                    </Label>
                    <Input
                      id="subject"
                      placeholder="e.g., IT401"
                      value={borrowingData.subject || ""}
                      onChange={(e) =>
                        setBorrowingData({
                          ...borrowingData,
                          subject: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="section">
                      Section <span className="text-red-600">*</span>
                    </Label>
                    <Input
                      id="section"
                      placeholder="e.g., BSIT 4D"
                      value={borrowingData.section || ""}
                      onChange={(e) =>
                        setBorrowingData({
                          ...borrowingData,
                          section: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                {/* Time Selection */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="startTime">
                      Start Time <span className="text-red-600">*</span>
                    </Label>
                    <Select
                      value={borrowingData.startTime.toString()}
                      onValueChange={(value) =>
                        setBorrowingData({
                          ...borrowingData,
                          startTime: toTimeInt(Number(value)),
                        })
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select start time" />
                      </SelectTrigger>
                      <SelectContent>
                        {getAvailableStartTimes().map((option) => (
                          <SelectItem
                            key={option.value}
                            value={option.value.toString()}
                          >
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endTime">
                      End Time <span className="text-red-600">*</span>
                    </Label>
                    <Select
                      value={borrowingData.endTime.toString()}
                      onValueChange={(value) =>
                        setBorrowingData({
                          ...borrowingData,
                          endTime: toTimeInt(Number(value)),
                        })
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select end time" />
                      </SelectTrigger>
                      <SelectContent>
                        {getAvailableEndTimes().map((option) => (
                          <SelectItem
                            key={option.value}
                            value={option.value.toString()}
                          >
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Validation Messages */}
                {borrowingData.startTime >= borrowingData.endTime && (
                  <div className="rounded bg-red-50 p-2 text-sm text-red-600">
                    End time must be after start time
                  </div>
                )}
              </div>

              <Button
                onClick={handleClaimSlot}
                disabled={
                  loading ||
                  !borrowingData.subject ||
                  !borrowingData.section ||
                  borrowingData.startTime >= borrowingData.endTime ||
                  borrowingData.startTime < selectedItem.startTime ||
                  borrowingData.endTime > selectedItem.endTime
                }
                className="w-full"
              >
                {loading ? "Submitting Request..." : "Borrow Room"}
              </Button>
            </div>
          )}

          {canCancel && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-medium">
                <XCircle className="h-4 w-4 text-red-500" />
                Cancel Your Borrowing
              </div>
              <p className="text-muted-foreground text-sm">
                This will cancel your room borrowing and make the time slot
                available for others.
              </p>
              <Button
                onClick={handleCancelBorrowing}
                disabled={loading}
                variant="destructive"
                className="w-full"
              >
                {loading ? "Canceling..." : "Cancel Borrowing"}
              </Button>
            </div>
          )}

          {!canMarkVacant && !canClaim && !canCancel && (
            <div className="py-4 text-center">
              <p className="text-muted-foreground text-sm">
                No actions available for this schedule item.
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export type { FinalClassroomSchedule };
