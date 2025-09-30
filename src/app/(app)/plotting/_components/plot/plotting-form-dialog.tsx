"use client";

import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Loader2 } from "lucide-react";
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
import { start } from "repl";
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
  const { data: faculty } = api.auth.getAllSchedulableFaculty.useQuery({
    role: session?.user.role ?? "facility_manager",
    departmentOrOrganization: session?.user.departmentOrOrganization ?? "itds",
  });
  const [value, setValue] = useState<Option>();
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
    }
  }, [selectedItem, form]);

  const isExistingSchedule = !!selectedItem?.id;

  const { mutate: createClassroomSchedule } =
    api.classroomSchedule.createClassroomSchedule.useMutation();

  const handleDelete = () => {
    toast.success("Schedule deleted successfully");
  };

  const utils = api.useUtils();

  const handleSubmit = async (data: z.infer<typeof PlottingSchema>) => {
    setIsSubmitting(true);
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
          void utils.classroomSchedule.getWeeklyInitialClassroomSchedule.invalidate({
            classroomId: selectedItem?.classroomId ?? "",
          });
          toast.success("Classroom schedule created successfully");
          form.reset();
          setIsSubmitting(false);
          onOpenChange(false);
        },
        onError: (err) => {
          console.log(err);
          toast.error(err.message || "Failed to create schedule");
          setIsSubmitting(false);
        },
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Classroom Schedule</DialogTitle>
          <DialogDescription>
            Input course details and schedule information for the entire school
            year
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((data) =>
              isExistingSchedule
                ? showConfirmation({
                  title: "Delete Schedule Creation",
                  description:
                    "Are you sure you want to delete this classroom schedule?",
                  confirmText: "Delete",
                  cancelText: "Cancel",
                  variant: "warning",
                  onConfirm: () => handleDelete(),
                })
                : showConfirmation({
                  title: "Confirm Schedule Creation",
                  description:
                    "Are you sure you want to create this classroom schedule?",
                  confirmText: "Create",
                  cancelText: "Cancel",
                  variant: "success",
                  onConfirm: () => handleSubmit(data),
                }),
            )}
            className="space-y-4 md:space-y-6"
          >
            <FormField
              control={form.control}
              name="proffesor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Professor</FormLabel>
                  {isExistingSchedule ? (
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
                        disabled={isExistingSchedule}
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
                        disabled={isExistingSchedule}
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
                        disabled={isExistingSchedule}
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
                          disabled={isExistingSchedule}
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
                          disabled={isExistingSchedule}
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
            <DialogFooter>
              {isExistingSchedule ? (
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {isSubmitting ? "Deleting Schedule..." : "Delete Schedule"}
                </Button>
              ) : (
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {isSubmitting ? "Creating Schedule..." : "Create Schedule"}
                </Button>
              )}
            </DialogFooter>
          </form>
        </Form>

        {ConfirmationDialog}
      </DialogContent>
    </Dialog>
  );
}
