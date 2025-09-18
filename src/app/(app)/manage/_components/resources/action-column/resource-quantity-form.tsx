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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
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
import { Label } from "@/components/ui/label";
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

    const quantity = data.action === "add" ? data.stock : -data.stock;
    updateResource(
      {
        id: resourceId,
        quantity: quantity,
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
          <Button variant="ghost">Edit Quantity</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Quantity</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            Update the quantity of <strong>{resourceName}</strong>
          </DialogDescription>
          <Form {...form}>
            <form
              className="space-y-6"
              onSubmit={form.handleSubmit((data) =>
                showConfirmation({
                  title: "Update Quantity",
                  description: `Are you sure you want to update the quantity of ${resourceName}?`,
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

              <FormField
                control={form.control}
                name="action"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Action</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        value={field.value ?? "add"}
                        className="flex gap-6"
                      >
                        <div className="flex items-center gap-2">
                          <RadioGroupItem value="add" id="add" />
                          <Label htmlFor="add">Add</Label>
                        </div>
                        <div className="flex items-center gap-2">
                          <RadioGroupItem value="subtract" id="subtract" />
                          <Label htmlFor="subtract">Subtract</Label>
                        </div>
                      </RadioGroup>
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
