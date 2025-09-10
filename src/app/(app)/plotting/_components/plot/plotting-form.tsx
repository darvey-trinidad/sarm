"use client";

import { useState } from "react";
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
import { toast } from "sonner";
import { PlottingSchema } from "./schema";
import { api } from "@/trpc/react";
import { TIME_OPTIONS } from "@/constants/timeslot";
import { DAYS_OPTIONS } from "@/constants/days";
import { useConfirmationDialog } from "@/components/dialog/use-confirmation-dialog";
import { authClient } from "@/lib/auth-client";

export default function PlottingForm() {
  const { data: session } = authClient.useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { data: buildings } = api.classroom.getClassroomsPerBuilding.useQuery();
  // const { data: faculty } = api.auth.getAllFaculty.useQuery();
  const { data: faculty } = api.auth.getAllSchedulableFaculty.useQuery({
    role: session?.user.role || "facility_manager",
    departmentOrOrganization: session?.user.departmentOrOrganization || "itds",
  });
  const [selectedBuildingId, setSelectedBuildingId] = useState("");
  const [value, setValue] = useState<Option>();
  const { showConfirmation, ConfirmationDialog } = useConfirmationDialog();

  const form = useForm<z.infer<typeof PlottingSchema>>({
    resolver: zodResolver(PlottingSchema),
    defaultValues: {
      courseCode: "",
      proffesor: "",
      section: "",
      building: "",
      room: "",
      startTime: "",
      endTime: "",
      days: "",
    },
  });

  const { mutate: createClassroomSchedule } =
    api.classroomSchedule.createClassroomSchedule.useMutation();

  const handleSubmit = async (data: z.infer<typeof PlottingSchema>) => {
    setIsSubmitting(true);
    createClassroomSchedule(
      {
        subject: data.courseCode,
        section: data.section,
        classroomId: data.room,
        facultyId: data.proffesor,
        startTime: data.startTime,
        endTime: data.endTime,
        day: Number(data.days),
      },
      {
        onSuccess: () => {
          toast.success("Classroom schedule created successfully");
          form.reset();
          setIsSubmitting(false);
        },
        onError: (err) => {
          console.log(err);
          toast.error(err.message || "Failed to create schedule");
          setIsSubmitting(false);
        },
      },
    );
  };

  const buildingId = form.watch("building"); // always the latest
  const selectedBuilding = buildings?.find(
    (building) => building.buildingId === buildingId,
  );

  return (
    <div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((data) =>
            showConfirmation({
              title: "Confirm Schedule Creation",
              description:
                "Are you sure you want to create this classroom schedule?",
              confirmText: "Create",
              cancelText: "Cancel",
              variant: "success",
              onConfirm: () => handleSubmit(data),
            }),
          )}
          className="space-y-4 px-0 md:space-y-8"
        >
          <div className="grid grid-cols-1 items-start gap-5 md:grid-cols-3">
            <FormField
              control={form.control}
              name="courseCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Course Code</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., IT401" {...field} />
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
              name="proffesor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Proffesor</FormLabel>
                  <FormControl>
                    <AutoComplete
                      options={
                        faculty
                          ? faculty.map((faculty) => ({
                            value: faculty.id,
                            label: faculty.name ?? "",
                          }))
                          : []
                      }
                      emptyMessage="No proffesor found"
                      placeholder="Select a proffesor"
                      isLoading={!faculty}
                      onValueChange={(opt) => field.onChange(opt?.value)} // ✅ only store the id
                      value={value}
                    />
                  </FormControl>
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
                    <Input placeholder="e.g., IT4D" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="gird-cols-1 grid gap-5 md:grid-cols-2">
            <FormField
              control={form.control}
              name="building"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Building</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                      setSelectedBuildingId(value);
                    }}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a building" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {buildings?.map((building) => (
                        <SelectItem
                          key={building.buildingId}
                          value={building.buildingId}
                        >
                          {building.name} - {building.description}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="room"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Room</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a room" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {selectedBuilding?.classrooms?.map((classroom) => (
                        <SelectItem key={classroom.id} value={classroom.id}>
                          {classroom.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            <FormField
              control={form.control}
              name="startTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Start Time</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full">
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
                      <SelectTrigger className="w-full">
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
              name="days"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Days</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select days" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {DAYS_OPTIONS.map((day) => (
                        <SelectItem
                          key={day.value}
                          value={day.value.toString()}
                        >
                          {day.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex justify-end">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {isSubmitting ? "Creating Schedule..." : "Create Schedule"}
            </Button>
          </div>
        </form>
      </Form>

      {ConfirmationDialog}
    </div>
  );
}
