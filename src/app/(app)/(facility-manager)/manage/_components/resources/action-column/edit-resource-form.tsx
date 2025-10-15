"use client";
import { api } from "@/trpc/react";
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
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useConfirmationDialog } from "@/components/dialog/use-confirmation-dialog";
import { toast } from "sonner";
import { Loader2, Pencil } from "lucide-react";
import {
  RESOURCE_CATEGORY,
  RESOURCE_OPTIONS,
} from "@/constants/resource-category";
import { EditResourceSchema } from "./editSchema";

interface ResourceEditFormProps {
  resource: {
    id: string;
    name: string;
    description: string | null;
    category: (typeof RESOURCE_CATEGORY)[number];
  };
}

export default function ResourceEditForm({ resource }: ResourceEditFormProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showConfirmation, ConfirmationDialog } = useConfirmationDialog();

  const form = useForm<z.infer<typeof EditResourceSchema>>({
    resolver: zodResolver(EditResourceSchema),
    defaultValues: {
      name: resource.name,
      description: resource.description ?? "",
      category: resource.category,
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        name: resource.name,
        description: resource.description ?? "",
        category: resource.category,
      });
    }
  }, [open, resource, form]);

  const utils = api.useUtils();
  const { mutate: editResource } = api.resource.editResource.useMutation();

  const handleSubmit = (data: z.infer<typeof EditResourceSchema>) => {
    setIsSubmitting(true);

    editResource(
      {
        id: resource.id,
        name: data.name,
        description: data.description ?? undefined,
        category: data.category,
      },
      {
        onSuccess: () => {
          toast.success("Resource updated successfully");
          void utils.resource.getAllResources.invalidate();
          setOpen(false);
          setIsSubmitting(false);
        },
        onError: (error) => {
          toast.error(error.message || "Failed to update resource");
          setIsSubmitting(false);
        },
      },
    );
  };

  return (
    <div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="ghost">Edit Resource</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Resource</DialogTitle>
            <DialogDescription>
              Update the details for <strong>{resource.name}</strong>
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form
              className="space-y-4"
              onSubmit={form.handleSubmit((data) =>
                showConfirmation({
                  title: "Update Resource",
                  description: `Are you sure you want to update ${resource.name}?`,
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
                    <FormLabel>Resource Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter resource name" {...field} />
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
                      <Textarea
                        placeholder="Enter resource description"
                        {...field}
                        rows={3}
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
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {RESOURCE_OPTIONS.map((category) => (
                          <SelectItem
                            key={category.value}
                            value={category.value}
                          >
                            {category.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpen(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {isSubmitting ? "Updating..." : "Update"}
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
