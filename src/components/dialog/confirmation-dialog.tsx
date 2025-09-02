"use client";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  AlertTriangle,
  CheckCircle,
  Info,
  XCircle,
  Loader2,
} from "lucide-react";

export type ConfirmationVariant =
  | "default"
  | "destructive"
  | "warning"
  | "success";

interface ConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: ConfirmationVariant;
  onConfirm: () => void | Promise<void>;
  loading?: boolean;
}

const variantConfig = {
  default: {
    icon: Info,
    confirmClass: "bg-primary hover:bg-primary/90",
    iconClass: "text-blue-500",
  },
  destructive: {
    icon: XCircle,
    confirmClass: "bg-destructive hover:bg-destructive/90",
    iconClass: "text-red-500",
  },
  warning: {
    icon: AlertTriangle,
    confirmClass: "bg-yellow-500 hover:bg-yellow-600 text-white",
    iconClass: "text-yellow-500",
  },
  success: {
    icon: CheckCircle,
    confirmClass: "bg-green-500 hover:bg-green-600 text-white",
    iconClass: "text-green-500",
  },
};

export function ConfirmationDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "default",
  onConfirm,
  loading = false,
}: ConfirmationDialogProps) {
  const config = variantConfig[variant];
  const Icon = config.icon;

  const handleConfirm = async () => {
    try {
      await onConfirm();
      onOpenChange(false);

      toast.success("Action completed successfully");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong",
      );
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <Icon className={`h-5 w-5 ${config.iconClass}`} />
            {title}
          </AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>{cancelText}</AlertDialogCancel>
          <Button
            onClick={handleConfirm}
            disabled={loading}
            className={config.confirmClass}
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {loading ? "Processing..." : confirmText}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
