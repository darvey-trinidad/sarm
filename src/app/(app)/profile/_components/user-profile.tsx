"use client";
import { useState, useEffect } from "react";

import { api } from "@/trpc/react";
import { authClient } from "@/lib/auth-client";
import { ROLE_LABELS } from "@/constants/roles";
import { DEPARTMENT_OR_ORGANIZATION_OPTIONS } from "@/constants/dept-org";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  UserRound,
  Mail,
  Building2,
  Briefcase,
  Calendar,
  Edit2,
  Check,
  CircleX,
} from "lucide-react";
import { formatISODate } from "@/lib/utils";
import { useConfirmationDialog } from "@/components/dialog/use-confirmation-dialog";

export default function UserProfile() {
  const { data: session, refetch: refetchSession } = authClient.useSession();
  const { data: userData, refetch: refetchUserData } =
    api.auth.getUserById.useQuery(
      {
        id: session?.user.id ?? "",
      },
      {
        enabled: !!session?.user.id,
      },
    );

  const { mutate: updateUser, isPending } =
    api.auth.editUserProfile.useMutation();
  const { showConfirmation, ConfirmationDialog } = useConfirmationDialog();
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState("");
  const [editedDepartment, setEditedDepartment] = useState("");

  // Sync state when userData is loaded or updated
  useEffect(() => {
    if (userData) {
      setEditedName(userData.name ?? "");
      setEditedDepartment(userData.departmentOrOrganization ?? "");
    }
  }, [userData]);

  const handleCancel = () => {
    setEditedName(userData?.name ?? "");
    setEditedDepartment(userData?.departmentOrOrganization ?? "");
    setIsEditing(false);
  };

  const handleSave = () => {
    // Basic validation
    if (!editedName.trim()) {
      toast.error("Name cannot be empty");
      return;
    }

    showConfirmation({
      title: "Update User Profile",
      description: "Are you sure you want to save these changes?",
      confirmText: "Save Changes",
      cancelText: "Cancel",
      variant: "success",
      onConfirm: async () => {
        await new Promise((resolve) => {
          updateUser(
            {
              id: session?.user.id ?? "",
              name: editedName.trim().length === 0 ? undefined : editedName,
              departmentOrOrganization: editedDepartment.trim() ?? undefined,
            },
            {
              onSuccess: () => {
                toast.success("Profile updated successfully!");
                setIsEditing(false);
                void refetchSession();
                void refetchUserData();
                resolve(true);
              },
              onError: (error) => {
                toast.error(error.message ?? "Failed to update profile");
                resolve(false);
              },
            },
          );
        });
      },
    });
  };

  return (
    <div className="container mr-auto max-w-2xl px-4 py-2">
      {/* Action Buttons - Fixed at top */}
      <div className="mb-2 md:mb-[-2rem] flex justify-end">
        {!isEditing ? (
          <Button
            onClick={() => setIsEditing(true)}
            variant="outline"
            className="gap-2"
          >
            <Edit2 className="h-4 w-4" />
            Edit Profile
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button onClick={handleSave} className="gap-2" disabled={isPending}>
              <Check className="h-4 w-4" />
              {isPending ? "Saving..." : "Save"}
            </Button>
            <Button
              onClick={handleCancel}
              variant="outline"
              className="gap-2"
              disabled={isPending}
            >
              <CircleX className="h-4 w-4" />
              Cancel
            </Button>
          </div>
        )}
      </div>

      {/* Form Fields */}
      <div className="space-y-8">
        {/* Name Field - EDITABLE */}
        <div className="space-y-3">
          <Label
            htmlFor="name"
            className="flex items-center gap-2 text-sm font-semibold"
          >
            <UserRound className="h-5 w-5 text-muted-foreground" />
            <span>Full Name</span>
          </Label>
          {isEditing ? (
            <Input
              id="name"
              value={editedName}
              onChange={(e) => setEditedName(e.target.value)}
              className="max-w-xl md:w-3/5"
              placeholder="Enter your full name"
            />
          ) : (
            <p className="pl-7 text-base">
              {userData?.name ?? "Not provided"}
            </p>
          )}
        </div>

        {/* Email Field - READ ONLY */}
        <div className="space-y-3">
          <Label className="flex items-center gap-2 text-sm font-semibold">
            <Mail className="h-5 w-5 text-muted-foreground" />
            <span>Email Address</span>
          </Label>
          <p className="pl-7 text-base">{userData?.email ?? "Not provided"}</p>
        </div>

        {/* Department Field - EDITABLE */}
        <div className="space-y-3">
          <Label
            htmlFor="department"
            className="flex items-center gap-2 text-sm font-semibold"
          >
            <Building2 className="h-5 w-5 text-muted-foreground" />
            <span>Department / Organization</span>
          </Label>
          {isEditing ? (
            <Select
              value={editedDepartment}
              onValueChange={setEditedDepartment}
            >
              <SelectTrigger id="department" className="max-w-xl md:w-3/5">
                <SelectValue placeholder="Select department or organization" />
              </SelectTrigger>
              <SelectContent>
                {DEPARTMENT_OR_ORGANIZATION_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <p className="pl-7 text-base">
              {userData?.departmentOrOrganization
                ? DEPARTMENT_OR_ORGANIZATION_OPTIONS.find(
                  (opt) => opt.value === userData.departmentOrOrganization,
                )?.label ?? userData.departmentOrOrganization
                : "Not provided"}
            </p>
          )}
        </div>

        {/* Role Field - READ ONLY */}
        <div className="space-y-3">
          <Label className="flex items-center gap-2 text-sm font-semibold">
            <Briefcase className="h-5 w-5 text-muted-foreground" />
            <span>Role</span>
          </Label>
          <p className="pl-7 text-base">
            {userData?.role ? ROLE_LABELS[userData.role] : "Not assigned"}
          </p>
        </div>

        {/* Created At Field - READ ONLY */}
        <div className="space-y-3">
          <Label className="flex items-center gap-2 text-sm font-semibold">
            <Calendar className="h-5 w-5 text-muted-foreground" />
            <span>Created On</span>
          </Label>
          <p className="pl-7 text-base">
            {userData?.createdAt
              ? formatISODate(userData.createdAt)
              : "Not available"}
          </p>
        </div>
      </div>

      {ConfirmationDialog}
    </div>
  );
}