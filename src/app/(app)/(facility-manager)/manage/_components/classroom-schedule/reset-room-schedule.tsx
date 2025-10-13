"use client";
import { useState } from "react";
import { api } from "@/trpc/react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trash2, CalendarMinus } from "lucide-react";
import { toast } from "sonner";

export default function ResetRoomSchedule() {
  const [confirmText, setConfirmText] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const { mutate: classroomScheduleReset, isPending } =
    api.classroomSchedule.resetClassroomSchedules.useMutation({
      onSuccess: (data) => {
        if (data.success) {
          toast.success("Classroom schedules reset successfully");
          setIsOpen(false);
          setConfirmText("");
        }
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });

  const handleReset = () => {
    if (confirmText === "delete schedule") {
      classroomScheduleReset();
    }
  };

  const isConfirmValid = confirmText === "delete schedule";

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" className="gap-2">
          <Trash2 className="h-4 w-4" />
          Reset All Schedules
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="gap-4 sm:max-w-[500px]">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <CalendarMinus className="h-5 w-5" />
            Are you absolutely sure?
          </AlertDialogTitle>
          <AlertDialogDescription className="space-y-4">
            This action cannot be undone. This will permanently delete all
            classroom schedules from the system.
            <div className="mt-4 space-y-2">
              <Label>
                Type<span className="font-bold">delete schedule</span> to
                confirm:
              </Label>
              <Input
                id="confirm-text"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                placeholder="delete schedule"
              />
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            onClick={() => {
              setConfirmText("");
            }}
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleReset}
            disabled={!isConfirmValid || isPending}
            className="bg-destructive hover:bg-destructive/90"
          >
            {isPending ? "Deleting..." : "Delete All Schedules"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
