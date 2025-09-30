"use client";
import { api } from "@/trpc/react";
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { VenueSchema } from "./schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { USABILITY_OPTIONS } from "@/constants/usability";
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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
export default function VenueFormButton() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [Open, setOpen] = useState(false);
  const { showConfirmation, ConfirmationDialog } = useConfirmationDialog();

  const form = useForm<z.infer<typeof VenueSchema>>({
    resolver: zodResolver(VenueSchema),
    defaultValues: {
      name: "",
      description: "",
      capacity: 0,
      usability: "operational",
    },
  });

  const { mutate: createVenue } = api.venue.createVenue.useMutation();

  const handleSubmit = (data: z.infer<typeof VenueSchema>) => {
    setIsSubmitting(true);
    createVenue(data, {
      onSuccess: () => {
        toast.success("Venue created successfully");
        form.reset();
        setOpen(false);
        setIsSubmitting(false);
      },
      onError: () => {
        toast.error("Failed to create venue");
        setIsSubmitting(false);
      },
    });
  };

  return (
    <div>
      <Dialog open={Open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button>Add Venue</Button>
        </DialogTrigger>

        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Venue</DialogTitle>
          </DialogHeader>
          <DialogDescription>Add a venue to the campus.</DialogDescription>

          <Form {...form}>
            <form
              className="space-y-6"
              onSubmit={form.handleSubmit((data) => {
                showConfirmation({
                  title: "Add Venue",
                  description: "Are you sure you want to add this venue?",
                  confirmText: "Add Venue",
                  variant: "default",
                  onConfirm: () => {
                    handleSubmit(data);
                  },
                });
              })}
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Venue Name <p className="text-destructive">*</p>
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

              <FormField
                control={form.control}
                name="capacity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Capacity <p className="text-destructive">*</p>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        value={field.value ?? ""}
                        onChange={(e) => field.onChange(e.target.value)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="usability"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Usability</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select a usability" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {USABILITY_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
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
                  {isSubmitting ? "Creating..." : "Create Venue"}
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
