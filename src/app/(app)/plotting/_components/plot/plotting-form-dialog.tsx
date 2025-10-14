"use client";

import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Loader2, Pencil, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { AutoComplete, type Option } from "@/components/ui/autocomplete";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { PlottingSchema } from "./schema";
import { api } from "@/trpc/react";
import { TIME_OPTIONS } from "@/constants/timeslot";
import { useConfirmationDialog } from "@/components/dialog/use-confirmation-dialog";
import { authClient } from "@/lib/auth-client";
import type { InitialClassroomSchedule } from "@/types/clasroom-schedule";
import { type UserSession } from "@/components/calendar/schedule-action-dialog";

interface PlottingFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedItem: InitialClassroomSchedule | null;
  currentUser: UserSession;
}

export default function PlottingFormDialog({
  open,
  onOpenChange,
  selectedItem,
}: PlottingFormDialogProps) {
  const { data: session } = authClient.useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState<Option>();

  const { data: faculty } = api.auth.getAllSchedulableFaculty.useQuery({
    role: session?.user.role ?? "facility_manager",
    departmentOrOrganization: session?.user.departmentOrOrganization ?? "itds",
  });

  const { showConfirmation, ConfirmationDialog } = useConfirmationDialog();

  const form = useForm<z.infer<typeof PlottingSchema>>({
    resolver: zodResolver(PlottingSchema),
    defaultValues: {
      courseCode: "",
      proffesor: "",
      section: "",
      startTime: "",
      endTime: "",
    },
  });

  const startTime = form.watch("startTime");
  const endTime = form.watch("endTime");

  useEffect(() => {
    if (selectedItem) {
      form.reset({
        courseCode: selectedItem.subject ?? "",
        section: selectedItem.section ?? "",
        proffesor: selectedItem.facultyName ?? "",
        startTime: selectedItem.startTime?.toString() ?? "",
        endTime: selectedItem.endTime?.toString() ?? "",
      });
      setIsEditing(false);
      setValue(undefined);
    }
  }, [selectedItem, form]);

  const isExistingSchedule = !!selectedItem?.id;

  const { mutate: createClassroomSchedule } =
    api.classroomSchedule.createClassroomSchedule.useMutation();

  const { mutate: deleteClassroomSchedule } =
    api.classroomSchedule.deleteClassroomSchedule.useMutation();

  const utils = api.useUtils();

  const handleDelete = (data: z.infer<typeof PlottingSchema>) => {
    setIsSubmitting(true);
    deleteClassroomSchedule(
      {
        classroomId: selectedItem?.classroomId ?? "",
        startTime: data.startTime,
        endTime: data.endTime,
        day: selectedItem?.day ?? 0,
      },
      {
        onSuccess: () => {
          void utils.classroomSchedule.getWeeklyInitialClassroomSchedule.invalidate(
            {
              classroomId: selectedItem?.classroomId ?? "",
            },
          );
          toast.success("Classroom schedule deleted successfully");
          setIsSubmitting(false);
          onOpenChange(false);
        },
        onError: (error) => {
          toast.error(error.message ?? "Failed to delete schedule");
          setIsSubmitting(false);
        },
      },
    );
  };

  const handleEditSchedule = (data: z.infer<typeof PlottingSchema>) => {
    setIsSubmitting(true);

    // First, delete the old schedule
    deleteClassroomSchedule(
      {
        classroomId: selectedItem?.classroomId ?? "",
        startTime: (selectedItem?.startTime ?? 0).toString(),
        endTime: (selectedItem?.endTime ?? 0).toString(),
        day: selectedItem?.day ?? 0,
      },
      {
        onSuccess: () => {
          // Then create the new schedule with the edited details
          createClassroomSchedule(
            {
              subject: data.courseCode,
              section: data.section,
              classroomId: selectedItem?.classroomId ?? "",
              facultyId: data.proffesor,
              startTime: data.startTime,
              endTime: data.endTime,
              day: selectedItem?.day ?? 0,
            },
            {
              onSuccess: () => {
                void utils.classroomSchedule.getWeeklyInitialClassroomSchedule.invalidate(
                  {
                    classroomId: selectedItem?.classroomId ?? "",
                  },
                );
                toast.success("Classroom schedule updated successfully");
                form.reset();
                setIsSubmitting(false);
                setIsEditing(false);
                onOpenChange(false);
              },
              onError: (err) => {
                console.log(err);
                toast.error(err.message ?? "Failed to create new schedule");
                setIsSubmitting(false);
              },
            },
          );
        },
        onError: (error) => {
          toast.error(error.message ?? "Failed to delete old schedule");
          setIsSubmitting(false);
        },
      },
    );
  };

  const handleSubmit = (data: z.infer<typeof PlottingSchema>) => {
    if (isExistingSchedule && isEditing) {
      showConfirmation({
        title: "Confirm Edit Schedule",
        description:
          "Are you sure you want to edit this classroom schedule? The old schedule will be deleted and replaced with the new one.",
        confirmText: "Confirm Edit",
        cancelText: "Cancel",
        variant: "warning",
        onConfirm: () => handleEditSchedule(data),
      });
    } else if (isExistingSchedule && !isEditing) {
      showConfirmation({
        title: "Delete Schedule",
        description: "Are you sure you want to delete this classroom schedule?",
        confirmText: "Delete",
        cancelText: "Cancel",
        variant: "warning",
        onConfirm: () => handleDelete(data),
      });
    } else {
      showConfirmation({
        title: "Confirm Schedule Creation",
        description: "Are you sure you want to create this classroom schedule?",
        confirmText: "Create",
        cancelText: "Cancel",
        variant: "success",
        onConfirm: () => handleSubmit(data),
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isExistingSchedule
              ? isEditing
                ? "Edit Classroom Schedule"
                : "View Classroom Schedule"
              : "Create Classroom Schedule"}
          </DialogTitle>
          <DialogDescription>
            {isExistingSchedule
              ? isEditing
                ? "Modify the schedule details. The old schedule will be replaced."
                : "View schedule information"
              : "Input course details and schedule information for the entire school year"}
          </DialogDescription>
          {isExistingSchedule && !isEditing && (
            <div className="flex justify-end">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setIsEditing(true)}
                disabled={isSubmitting}
              >
                <Pencil className="h-4 w-4" />
                Edit Schedule
              </Button>
            </div>
          )}
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4 md:space-y-6"
          >
            <FormField
              control={form.control}
              name="proffesor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Professor</FormLabel>
                  {isExistingSchedule && !isEditing ? (
                    <FormControl>
                      <Input
                        placeholder="e.g., Prof. Juan Luna"
                        {...field}
                        disabled
                      />
                    </FormControl>
                  ) : (
                    <FormControl>
                      <AutoComplete
                        options={
                          faculty
                            ? faculty.map((f) => ({
                                value: f.id,
                                label: f.name ?? "",
                              }))
                            : []
                        }
                        emptyMessage="No professor found"
                        placeholder="Select a professor"
                        isLoading={!faculty}
                        onValueChange={(opt) => field.onChange(opt?.value)}
                        value={value}
                        disabled={isExistingSchedule && !isEditing}
                      />
                    </FormControl>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 items-start gap-2 md:grid-cols-2">
              <FormField
                control={form.control}
                name="courseCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Course Code</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., IT401"
                        {...field}
                        disabled={isExistingSchedule && !isEditing}
                      />
                    </FormControl>
                    <FormDescription>
                      Enter the official course code
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="section"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Section</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., IT4D"
                        {...field}
                        disabled={isExistingSchedule && !isEditing}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
              <FormField
                control={form.control}
                name="startTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Time</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger
                          className="w-full"
                          disabled={isExistingSchedule && !isEditing}
                        >
                          <SelectValue placeholder="Select time" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {TIME_OPTIONS.map((opt) => (
                          <SelectItem
                            key={opt.value}
                            value={opt.value.toString()}
                          >
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                      <FormMessage />
                    </Select>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="endTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Time</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger
                          className="w-full"
                          disabled={isExistingSchedule && !isEditing}
                        >
                          <SelectValue placeholder="Select time" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {TIME_OPTIONS.map((opt) => (
                          <SelectItem
                            key={opt.value}
                            value={opt.value.toString()}
                          >
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                      <FormMessage />
                    </Select>
                  </FormItem>
                )}
              />
            </div>

            {/* Validation Messages */}
            {startTime && endTime && Number(startTime) >= Number(endTime) && (
              <div className="rounded bg-red-50 p-2 text-sm text-red-600">
                End time must be after start time
              </div>
            )}

            <DialogFooter className="gap-2 sm:gap-2">
              {isEditing && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditing(false)}
                  disabled={isSubmitting}
                >
                  <X className="mr-2 h-4 w-4" />
                  Cancel Edit
                </Button>
              )}

              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {isSubmitting
                  ? isExistingSchedule && isEditing
                    ? "Updating Schedule..."
                    : isExistingSchedule
                      ? "Deleting Schedule..."
                      : "Creating Schedule..."
                  : isExistingSchedule && isEditing
                    ? "Confirm Edit"
                    : isExistingSchedule
                      ? "Delete Schedule"
                      : "Create Schedule"}
              </Button>
            </DialogFooter>
          </form>
        </Form>

        {ConfirmationDialog}
      </DialogContent>
    </Dialog>
  );
}
