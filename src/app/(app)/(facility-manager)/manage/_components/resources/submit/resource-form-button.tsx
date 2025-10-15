"use client";
import { api } from "@/trpc/react";
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { ResourceSchema } from "./schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { RESOURCE_OPTIONS } from "@/constants/resource-category";
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

export default function ResourceFormButton() {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showConfirmation, ConfirmationDialog } = useConfirmationDialog();
  const utils = api.useUtils();

  const form = useForm<z.infer<typeof ResourceSchema>>({
    resolver: zodResolver(ResourceSchema),
    defaultValues: {
      name: "",
      description: "",
      category: undefined,
      stock: 0,
    },
  });

  const { mutate: createResource } = api.resource.createResource.useMutation();

  const handleSubmit = (data: z.infer<typeof ResourceSchema>) => {
    setIsSubmitting(true);
    createResource(data, {
      onSuccess: () => {
        toast.success("Resource created successfully");
        form.reset();
        setOpen(false);
        setIsSubmitting(false);
        void utils.resource.getAllResources.invalidate();
      },
      onError: () => {
        toast.error("Failed to create resource");
        setIsSubmitting(false);
      },
    });
  };

  return (
    <div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="default">Add Resource</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add a new resource</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            Add a new resource to the inventory.
          </DialogDescription>

          <Form {...form}>
            <form
              className="space-y-6"
              onSubmit={form.handleSubmit((data) =>
                showConfirmation({
                  title: "Create Resource",
                  description: "Are you sure you want to create this resource?",
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
                      Resource Name <p className="text-destructive">*</p>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Sound System" {...field} />
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
                      <Input
                        placeholder="e.g. This is a sound system"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="stock"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Stock <p className="text-destructive">*</p>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
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
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Category <p className="text-destructive">*</p>
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {RESOURCE_OPTIONS.map((option) => (
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
                  {isSubmitting ? "Creating..." : "Create"}
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
