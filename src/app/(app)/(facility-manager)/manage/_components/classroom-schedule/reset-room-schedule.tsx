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
import { Trash2 } from "lucide-react";

export default function ResetRoomSchedule() {
  const [confirmText, setConfirmText] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const { mutate: classroomScheduleReset, isPending } =
    api.classroomSchedule.resetClassroomSchedules.useMutation({
      onSuccess: (data) => {
        if (data.success) {
          alert("Success: " + data.message);
          setIsOpen(false);
          setConfirmText("");
        }
      },
      onError: (error) => {
        alert("Error: " + error.message);
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
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete all
            classroom schedules from the system.
          </AlertDialogDescription>
          <div className="mt-4 space-y-2">
            <Label
              htmlFor="confirm-text"
              className="text-foreground text-sm font-medium"
            >
              Type <span className="font-bold">delete schedule</span> to
              confirm:
            </Label>
            <Input
              id="confirm-text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder="delete schedule"
            />
          </div>
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
