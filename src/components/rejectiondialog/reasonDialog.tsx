import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
import { Textarea } from "@/components/ui/textarea";
import { RejectionSchema } from "./schema";

type ReasonFormValues = z.infer<typeof RejectionSchema>;

type ReasonDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  onConfirm: (reason: string) => Promise<boolean>;
  confirmText?: string;
  cancelText?: string;
  variant?: "default" | "destructive";
};

export function ReasonDialog({
  open,
  onOpenChange,
  title,
  onConfirm,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "default",
}: ReasonDialogProps) {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<ReasonFormValues>({
    resolver: zodResolver(RejectionSchema),
    defaultValues: {
      reason: "",
    },
  });

  const onSubmit = async (data: ReasonFormValues) => {
    setIsLoading(true);
    try {
      const success = await onConfirm(data.reason);
      if (success) {
        form.reset();
        onOpenChange(false);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    form.reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            Please provide a reason for this action.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="reason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Reason <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter a reason..."
                      className="resize-none"
                      rows={5}
                      disabled={isLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={isLoading}
              >
                {cancelText}
              </Button>
              <Button type="submit" variant={variant} disabled={isLoading}>
                {isLoading ? "Processing..." : confirmText}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

// Hook to use the reason dialog
export function useReasonDialog() {
  const [dialogState, setDialogState] = useState<{
    open: boolean;
    title: string;
    description: string;
    onConfirm: (reason: string) => Promise<boolean>;
    confirmText?: string;
    cancelText?: string;
    variant?: "default" | "destructive";
  }>({
    open: false,
    title: "",
    description: "",
    onConfirm: async () => false,
  });

  const showReasonDialog = (config: Omit<typeof dialogState, "open">) => {
    setDialogState({
      ...config,
      open: true,
    });
  };

  const ReasonDialogComponent = (
    <ReasonDialog
      open={dialogState.open}
      onOpenChange={(open) => setDialogState((prev) => ({ ...prev, open }))}
      title={dialogState.title}
      description={dialogState.description}
      onConfirm={dialogState.onConfirm}
      confirmText={dialogState.confirmText}
      cancelText={dialogState.cancelText}
      variant={dialogState.variant}
    />
  );

  return { showReasonDialog, ReasonDialog: ReasonDialogComponent };
}
