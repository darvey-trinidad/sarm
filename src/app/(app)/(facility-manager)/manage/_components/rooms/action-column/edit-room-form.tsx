"use client";

import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/trpc/react";
import { useConfirmationDialog } from "@/components/dialog/use-confirmation-dialog";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

import { type ClassroomType } from "@/constants/classroom-type";
import { FLOORS, type FloorType } from "@/constants/floors";
import { classroomSchema } from "./schema";
import { CLASSROOM_TYPE_OPTIONS } from "@/constants/classroom-type";

type ClassroomFormValues = z.infer<typeof classroomSchema>;

interface Classroom {
  id: string;
  name: string;
  buildingId: string;
  buildingName: string | null;
  capacity: number;
  floor: FloorType;
  type: ClassroomType;
  usability: "operational" | "non-operational";
}

export default function ClassroomEditForm({
  classroom,
}: {
  classroom: Classroom;
}) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showConfirmation, ConfirmationDialog } = useConfirmationDialog();
  const utils = api.useUtils();

  const form = useForm<ClassroomFormValues>({
    resolver: zodResolver(classroomSchema),
    defaultValues: {
      name: classroom.name,
      capacity: classroom.capacity,
      floor: classroom.floor,
      type: classroom.type,
    },
  });

  const { mutate: editClassroom } = api.classroom.editClassroom.useMutation({
    onSuccess: () => {
      toast.success("Classroom updated successfully");
      void utils.classroom.getAllClassrooms.invalidate();
      setOpen(false);
      form.reset();
      setIsSubmitting(false);
    },
    onError: (error) => {
      toast.error(error.message ?? "Failed to update classroom");
      setIsSubmitting(false);
    },
  });

  const handleSubmit = (data: ClassroomFormValues) => {
    setIsSubmitting(true);
    editClassroom({
      id: classroom.id,
      ...data,
      capacity: data.capacity ?? undefined,
      floor: data.floor ?? undefined,
      type: data.type ?? undefined,
    });
  };

  return (
    <div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="ghost">Edit Classroom</Button>
        </DialogTrigger>

        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Classroom</DialogTitle>
            <DialogDescription>
              Update details for <strong>{classroom.name}</strong>.
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form
              className="space-y-4"
              onSubmit={form.handleSubmit((data) =>
                showConfirmation({
                  title: "Update Classroom",
                  description: `Are you sure you want to update ${classroom.name}?`,
                  confirmText: "Update",
                  variant: "warning",
                  onConfirm: () => handleSubmit(data),
                }),
              )}
            >
              {/* Name */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Classroom Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter classroom name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Capacity */}
              <FormField
                control={form.control}
                name="capacity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Capacity</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Enter capacity"
                        value={field.value}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Floor (Select) */}
              <FormField
                control={form.control}
                name="floor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Floor</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select floor" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {FLOORS.map((floor) => (
                          <SelectItem key={floor} value={floor}>
                            {floor}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Type (Select) */}
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {CLASSROOM_TYPE_OPTIONS.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {isSubmitting ? "Saving..." : "Save Changes"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {ConfirmationDialog}
    </div>
  );
}
