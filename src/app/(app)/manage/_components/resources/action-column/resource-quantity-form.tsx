"use client";
import { api } from "@/trpc/react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ActionSchema } from "./schema";
import { useConfirmationDialog } from "@/components/dialog/use-confirmation-dialog";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { set } from "better-auth";
interface ResourceQuantityProps {
  resourceId: string;
  resourceName: string;
}

export default function ResourceQuantityForm({
  resourceId,
  resourceName,
}: ResourceQuantityProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showConfirmation, ConfirmationDialog } = useConfirmationDialog();

  const form = useForm<z.infer<typeof ActionSchema>>({
    resolver: zodResolver(ActionSchema),
    defaultValues: {
      stock: 0,
    },
  });
  const utils = api.useUtils();
  const { mutate: updateResource } =
    api.resource.addResourceQuantity.useMutation();

  const handleSubmit = (data: z.infer<typeof ActionSchema>) => {
    setIsSubmitting(true);
    updateResource(
      {
        id: resourceId,
        quantity: data.stock,
      },
      {
        onSuccess: () => {
          toast.success("Resource quantity updated successfully");
          setOpen(false);
          form.reset();
          setIsSubmitting(false);
        },
        onError: () => {
          toast.error("Failed to update resource quantity");
          setIsSubmitting(false);
        },
      },
    );
  };

  return (
    <div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline">Add Quantity</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Quantity</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form
              className="space-y-6"
              onSubmit={form.handleSubmit((data) =>
                showConfirmation({
                  title: "Update Quantity",
                  description: `Are you sure you want to update the quantity of ${resourceName} to ${data.stock}?`,
                  confirmText: "Update",
                  variant: "warning",
                  onConfirm: () => handleSubmit(data),
                }),
              )}
            >
              <FormField
                control={form.control}
                name="stock"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantity</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(e.target.value)}
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
