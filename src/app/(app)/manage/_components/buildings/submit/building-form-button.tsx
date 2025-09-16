"use client";
import { api } from "@/trpc/react";
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { BuildingSchema } from "./schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useConfirmationDialog } from "@/components/dialog/use-confirmation-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
export default function BuildingFormButton() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showConfirmation, ConfirmationDialog } = useConfirmationDialog();
  const [open, setOpen] = useState(false);
  const form = useForm<z.infer<typeof BuildingSchema>>({
    resolver: zodResolver(BuildingSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const { mutate: createBuiding } = api.classroom.createBuilding.useMutation();

  const handleSubmit = (data: z.infer<typeof BuildingSchema>) => {
    setIsSubmitting(true);
    createBuiding(data, {
      onSuccess: () => {
        toast.success("Building created successfully");
        form.reset();
        setOpen(false);
        setIsSubmitting(false);
      },
      onError: () => {
        toast.error("Failed to create building");
        setIsSubmitting(false);
      },
    });
  };

  return (
    <div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button>Add Building</Button>
        </DialogTrigger>

        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Building</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            Add a new building to the campus.
          </DialogDescription>

          <Form {...form}>
            <form
              className="space-y-6"
              onSubmit={form.handleSubmit((data) =>
                showConfirmation({
                  title: "Create Building",
                  description: "Are you sure you want to create this building?",
                  confirmText: "Create",
                  variant: "default",
                  onConfirm: () => handleSubmit(data),
                }),
              )}
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Building Name <p className="text-destructive">*</p>
                    </FormLabel>
                    <FormControl>
                      <Input {...field} />
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
                    <FormLabel>
                      Description <p className="text-destructive">*</p>
                    </FormLabel>
                    <FormControl>
                      <Input {...field} />
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
                  {isSubmitting ? "Creating..." : "Create Building"}
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
