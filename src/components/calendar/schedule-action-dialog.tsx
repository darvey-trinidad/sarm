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
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CalendarIcon, Clock, User, XCircle, Info } from "lucide-react";
import { type FinalClassroomSchedule } from "@/types/clasroom-schedule";
import { SCHEDULE_SOURCE } from "@/constants/schedule";
import { TIME_OPTIONS, TIME_MAP, type TimeInt } from "@/constants/timeslot";
import { type BetterAuthSession } from "@/lib/auth-client";
import { type BorrowingData } from "@/hooks/use-schedule-action";
import { toTimeInt } from "@/lib/utils";
import { Roles } from "@/constants/roles";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { getScheduleTypeInfo } from "./_components/schedule-type-info";

export type UserSession = BetterAuthSession["user"] | undefined;

interface ScheduleActionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedItem: FinalClassroomSchedule | null;
  currentUser: UserSession;
  onMarkVacant: (
    schedule: FinalClassroomSchedule,
    data: BorrowingData,
  ) => Promise<void>;
  onClaimSlot: (
    schedule: FinalClassroomSchedule,
    data: BorrowingData,
  ) => Promise<void>;
  onCancelBorrowing: (
    schedule: FinalClassroomSchedule,
    data: BorrowingData,
  ) => Promise<void>;
  onRequestToBorrow: (
    schedule: FinalClassroomSchedule,
    data: BorrowingData,
  ) => Promise<void>;
}
export default function ScheduleActionDialog({
  open,
  onOpenChange,
  selectedItem,
  currentUser,
  onMarkVacant,
  onClaimSlot,
  onCancelBorrowing,
  onRequestToBorrow,
}: ScheduleActionDialogProps) {
  const [loading, setLoading] = useState(false);
  const [isBorrowMode, setIsBorrowMode] = useState(false);
  const [borrowingData, setBorrowingData] = useState<BorrowingData>({
    classroomId: selectedItem?.classroomId ?? "",
    facultyId: currentUser?.id ?? "",
    date: selectedItem?.date ?? new Date(),
    startTime: toTimeInt(selectedItem?.startTime),
    endTime: toTimeInt(selectedItem?.endTime),
    subject: "",
    section: "",
    details: "",
  });

  if (!selectedItem) return null;

  // Determine what actions are available
  const isOwnSchedule =
    (currentUser?.role === Roles.Faculty || Roles.DepartmentHead) &&
    selectedItem.facultyId === currentUser?.id &&
    selectedItem.source === SCHEDULE_SOURCE.InitialSchedule;

  const isVacantSlot = selectedItem.source === SCHEDULE_SOURCE.Vacancy;
  const isUnoccupiedSlot = selectedItem.source === SCHEDULE_SOURCE.Unoccupied;
  const isBorrowedByUser =
    selectedItem.source === SCHEDULE_SOURCE.Borrowing &&
    selectedItem.facultyId === currentUser?.id;
  const isOthersSchedule =
    !isOwnSchedule &&
    !isVacantSlot &&
    !isUnoccupiedSlot &&
    !isBorrowedByUser &&
    selectedItem.source !== SCHEDULE_SOURCE.Borrowing;

  const canMarkVacant = isOwnSchedule;
  const canClaim = isVacantSlot || isUnoccupiedSlot;
  const canCancel = isBorrowedByUser;
  const canRequestToBorrow = isOthersSchedule;

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

  const handleMarkVacant = async () => {
    if (!selectedItem.id) return;

    setLoading(true);
    try {
      await onMarkVacant(selectedItem, borrowingData);
      onOpenChange(false);
    } catch (error) {
      console.error("Error marking as vacant:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleClaimSlot = async () => {
    if (!borrowingData.subject || !borrowingData.section) return;

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
      await onClaimSlot(selectedItem, borrowingData);
      onOpenChange(false);
      setBorrowingData({
        classroomId: selectedItem?.classroomId ?? "",
        facultyId: currentUser?.id ?? "",
        date: selectedItem?.date ?? new Date(),
        startTime: toTimeInt(selectedItem?.startTime),
        endTime: toTimeInt(selectedItem?.endTime),
        subject: "",
        section: "",
        details: "",
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
      await onCancelBorrowing(selectedItem, borrowingData);
      onOpenChange(false);
    } catch (error) {
      console.error("Error canceling borrowing:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRequestToBorrow = async () => {
    if (!borrowingData.subject || !borrowingData.section) return;

    setLoading(true);
    try {
      await onRequestToBorrow(selectedItem, borrowingData);
      onOpenChange(false);
      setBorrowingData({
        classroomId: selectedItem?.classroomId ?? "",
        facultyId: currentUser?.id ?? "",
        date: selectedItem?.date ?? new Date(),
        startTime: toTimeInt(selectedItem?.startTime),
        endTime: toTimeInt(selectedItem?.endTime),
        subject: "",
        section: "",
        details: "",
      });
    } catch (error) {
      console.error("Error requesting to borrow:", error);
    } finally {
      setLoading(false);
    }
  };

  const source = selectedItem.source;
  const scheduleTypeInfo = getScheduleTypeInfo(source);

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
                <Clock className="text-muted-foreground h-4 w-4" />
                <span>
                  {TIME_MAP[toTimeInt(selectedItem.startTime)]} -{" "}
                  {TIME_MAP[toTimeInt(selectedItem.endTime)]}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <CalendarIcon className="text-muted-foreground h-4 w-4" />
                <span>{selectedItem.date.toLocaleDateString()}</span>
              </div>
            </div>

            {selectedItem.facultyName && (
              <div className="flex items-center gap-2 text-sm">
                <User className="text-muted-foreground h-4 w-4" />
                <span>Faculty: {selectedItem.facultyName}</span>
              </div>
            )}

            {selectedItem.details && (
              <div className="flex items-center gap-2 text-sm">
                <Info className="text-muted-foreground h-4 w-4" />
                <span>{selectedItem.details}</span>
              </div>
            )}
          </div>

          <Separator />

          {/* Actions */}
          {canMarkVacant && (
            <div className="space-y-4">
              <div className="item-center flex gap-3">
                <span className="text-sm font-medium">Mode :</span>
                <RadioGroup
                  value={isBorrowMode ? "lend" : "vacant"}
                  onValueChange={(value) => setIsBorrowMode(value === "lend")}
                  className="flex items-center gap-6"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="vacant" id="vacant" />
                    <Label htmlFor="vacant">Vacate</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="lend" id="lend" />
                    <Label htmlFor="lend">Lend</Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Subject and Section */}
              {isBorrowMode && (
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="subject">
                      Subject <span className="text-red-600">*</span>
                    </Label>
                    <Input
                      id="subject"
                      placeholder="e.g., IT401"
                      value={borrowingData.subject ?? ""}
                      onChange={(e) =>
                        setBorrowingData({
                          ...borrowingData,
                          facultyId: currentUser?.id ?? "guest",
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
                      value={borrowingData.section ?? ""}
                      onChange={(e) =>
                        setBorrowingData({
                          ...borrowingData,
                          section: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
              )}

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

              {/* Details when giving up room */}
              {isBorrowMode && (
                <div className="space-y-2">
                  <div className="space-y-2">
                    <Label htmlFor="details">Additional Details</Label>
                    <Input
                      placeholder="e.g., Lending to sir John Doe "
                      value={borrowingData.details ?? ""}
                      onChange={(e) =>
                        setBorrowingData({
                          ...borrowingData,
                          details: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
              )}

              {/* Validation Messages */}
              {borrowingData.startTime >= borrowingData.endTime && (
                <div className="rounded bg-red-50 p-2 text-sm text-red-600">
                  End time must be after start time
                </div>
              )}

              <Button
                onClick={isBorrowMode ? handleClaimSlot : handleMarkVacant}
                disabled={loading}
                className="w-full"
              >
                {loading
                  ? isBorrowMode
                    ? "Lending Room..."
                    : "Marking as Vacant..."
                  : isBorrowMode
                    ? "Lend Room"
                    : "Mark as Vacant"}
              </Button>
            </div>
          )}

          {canClaim && (
            <div className="space-y-4">
              <div className="rounded-md border border-blue-200 bg-blue-50 p-3">
                <p className="text-sm text-blue-800">
                  <strong>Available Time:</strong>{" "}
                  {TIME_MAP[toTimeInt(selectedItem.startTime)]} -{" "}
                  {TIME_MAP[toTimeInt(selectedItem.endTime)]}
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
                      value={borrowingData.subject ?? ""}
                      onChange={(e) =>
                        setBorrowingData({
                          ...borrowingData,
                          facultyId: currentUser?.id ?? "guest",
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
                      value={borrowingData.section ?? ""}
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

                {/*Details*/}
                <div className="space-y-2">
                  <Label htmlFor="details">Additional Details</Label>
                  <Input
                    placeholder="e.g., Lending to sir John Doe "
                    value={borrowingData.details ?? ""}
                    onChange={(e) =>
                      setBorrowingData({
                        ...borrowingData,
                        details: e.target.value,
                      })
                    }
                  />
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
                {loading ? "Borrowing..." : "Borrow Room"}
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

          {canRequestToBorrow && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-medium">
                <User className="h-4 w-4 text-purple-500" />
                Request to Borrow Room
              </div>

              <div className="rounded-md border border-purple-200 bg-purple-50 p-3">
                <p className="text-sm text-purple-800">
                  <strong>Current Owner:</strong> {selectedItem.facultyName}
                </p>
                <p className="mt-1 text-xs text-purple-600">
                  You can request to borrow this time slot. The owner will be
                  notified.
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
                      value={borrowingData.subject ?? ""}
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
                      value={borrowingData.section ?? ""}
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
                onClick={handleRequestToBorrow}
                disabled={
                  loading ||
                  !borrowingData.subject ||
                  !borrowingData.section ||
                  borrowingData.startTime >= borrowingData.endTime
                }
                className="w-full"
              >
                {loading ? "Requesting..." : "Request to Borrow"}
              </Button>
            </div>
          )}

          {!canMarkVacant && !canClaim && !canCancel && !canRequestToBorrow && (
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
