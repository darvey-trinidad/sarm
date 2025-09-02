"use client";
import { useState } from "react";
import {
  ConfirmationDialog,
  type ConfirmationVariant,
} from "./confirmation-dialog";

export interface ConfirmationOptions {
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: ConfirmationVariant;
  onConfirm: () => void | Promise<void>;
}

export function useConfirmationDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState<ConfirmationOptions | null>(null);

  const handleOpenChange = (open: boolean) => {
    if (!loading) {
      setIsOpen(open);
      if (!open) {
        setOptions(null);
      }
    }
  };

  const handleConfirm = async () => {
    if (!options?.onConfirm) return;

    setLoading(true);
    try {
      await options.onConfirm();
    } finally {
      setLoading(false);
    }
  };

  const showConfirmation = (confirmationOptions: ConfirmationOptions) => {
    setOptions(confirmationOptions);
    setIsOpen(true);
  };

  const ConfirmationDialogComponent = options ? (
    <ConfirmationDialog
      open={isOpen}
      onOpenChange={handleOpenChange}
      title={options.title}
      description={options.description}
      confirmText={options.confirmText}
      cancelText={options.cancelText}
      variant={options.variant}
      onConfirm={handleConfirm}
      loading={loading}
    />
  ) : null;

  return {
    showConfirmation,
    ConfirmationDialog: ConfirmationDialogComponent,
    isOpen,
    loading,
  };
}
