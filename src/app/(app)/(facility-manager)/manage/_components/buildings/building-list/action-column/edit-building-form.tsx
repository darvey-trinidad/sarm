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
import { Button } from "@/components/ui/button";
import { buildingSchema } from "./schema";

type BuildingFormValues = z.infer<typeof buildingSchema>;

interface Building {
  id: string;
  name: string;
  description: string | null;
}

export default function BuildingEditForm({ building }: { building: Building }) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showConfirmation, ConfirmationDialog } = useConfirmationDialog();
  const utils = api.useUtils();

  const form = useForm<BuildingFormValues>({
    resolver: zodResolver(buildingSchema),
    defaultValues: {
      name: building.name,
      description: building.description ?? "",
    },
  });

  const { mutate: editBuilding } = api.classroom.editBuilding.useMutation({
    onSuccess: () => {
      toast.success("Building updated successfully");
      void utils.classroom.getAllBuildings.invalidate();
      setOpen(false);
      form.reset();
      setIsSubmitting(false);
    },
    onError: (error) => {
      toast.error(error.message ?? "Failed to update building");
      setIsSubmitting(false);
    },
  });

  const handleSubmit = (data: BuildingFormValues) => {
    setIsSubmitting(true);
    editBuilding({
      id: building.id,
      ...data,
      description: data.description ?? undefined,
    });
  };

  return (
    <div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="ghost">Edit Building</Button>
        </DialogTrigger>

        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Building</DialogTitle>
            <DialogDescription>
              Update the information for <strong>{building.name}</strong>.
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form
              className="space-y-4"
              onSubmit={form.handleSubmit((data) =>
                showConfirmation({
                  title: "Update Building",
                  description: `Are you sure you want to update ${building.name}?`,
                  confirmText: "Update",
                  variant: "warning",
                  onConfirm: () => handleSubmit(data),
                }),
              )}
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Building Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter building name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter building description"
                        {...field}
                      />
                    </FormControl>
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
