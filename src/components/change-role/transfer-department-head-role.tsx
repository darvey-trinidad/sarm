"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { AutoComplete, type Option } from "@/components/ui/autocomplete";
import { toast } from "sonner";
import { UserRound, ArrowRightLeft } from "lucide-react";

interface TransferDepartmentHeadModalProps {
  facultyList: Array<{
    id: string;
    name: string | null;
    email: string;
    role?: string;
    departmentOrOrganization?: string | null;
  }>;
  onTransfer: (newHeadId: string) => Promise<void>;
  isTransferring: boolean;
}

export function TransferDepartmentHeadModal({
  facultyList,
  onTransfer,
  isTransferring,
}: TransferDepartmentHeadModalProps) {
  const [open, setOpen] = useState(false);
  const [selectedFaculty, setSelectedFaculty] = useState<Option | undefined>();

  // Convert faculty list to autocomplete options
  const facultyOptions: Option[] = facultyList
    .filter((faculty) => faculty.name) // Filter out null names
    .map((faculty) => ({
      value: faculty.id,
      label: faculty.name!, // Safe to use ! because we filtered out nulls
      email: faculty.email,
    }));

  const handleTransfer = async () => {
    if (!selectedFaculty) {
      toast.error("Please select a faculty member");
      return;
    }

    try {
      await onTransfer(selectedFaculty.value);
      toast.success("Department Head role transferred successfully!");
      setOpen(false);
      setSelectedFaculty(undefined);
    } catch (error) {
      toast.error("Failed to transfer role. Please try again.");
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!isTransferring) {
      setOpen(newOpen);
      if (!newOpen) {
        setSelectedFaculty(undefined);
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          variant="link"
          size="sm"
          className="text-primary hover:text-primary/80 h-auto p-0 text-xs"
        >
          <ArrowRightLeft className="mr-1 h-3 w-3" />
          Transfer Role
        </Button>
      </DialogTrigger>
      <DialogContent className="gap-4 sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserRound className="h-5 w-5" />
            Transfer Department Head Role
          </DialogTitle>
          <DialogDescription>
            Select a faculty member from your department to become the new
            Department Head. You will be assigned the Faculty role after the
            transfer.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="mb-4 text-sm font-medium">
              Select New Department Head
            </label>
            <AutoComplete
              options={facultyOptions}
              emptyMessage="No faculty members found"
              placeholder="Search faculty by name..."
              value={selectedFaculty}
              onValueChange={setSelectedFaculty}
              disabled={isTransferring}
            />
            {selectedFaculty && (
              <p className="text-muted-foreground text-xs">
                Email: {selectedFaculty.email}
              </p>
            )}
          </div>
          {facultyList.length === 0 && (
            <div className="rounded-md bg-yellow-50 p-3 text-sm text-yellow-800">
              No faculty members available in your department for role transfer.
            </div>
          )}
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => handleOpenChange(false)}
            disabled={isTransferring}
          >
            Cancel
          </Button>
          <Button
            onClick={handleTransfer}
            disabled={
              !selectedFaculty || isTransferring || facultyList.length === 0
            }
          >
            {isTransferring ? "Transferring..." : "Transfer Role"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
