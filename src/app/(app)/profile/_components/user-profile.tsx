"use client";
import { useState } from "react";

import { api } from "@/trpc/react";
import { authClient } from "@/lib/auth-client";
import { CircleUserRound } from "lucide-react";
import { ROLE_LABELS, ROLES_OPTIONS } from "@/constants/roles";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
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
import { Card, CardContent } from "@/components/ui/card";
import { formatISODate } from "@/lib/utils";
import { useConfirmationDialog } from "@/components/dialog/use-confirmation-dialog";

export default function UserProfile() {
  const { data: session, refetch: refetchSession } = authClient.useSession();
  const { data: User } = api.auth.getUserById.useQuery(
    {
      id: session?.user.id ?? "",
    },
    {
      enabled: !!session?.user.id,
    },
  );

  const { mutate: updateUser } = api.auth.editUserProfile.useMutation();
  const { showConfirmation, ConfirmationDialog } = useConfirmationDialog();
  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState(User);
  const [editedName, setEditedName] = useState(User?.name ?? "");
  const [editedDepartmentOrRole, setEditedDepartmentOrRole] = useState(
    User?.role ?? "",
  );

  const handleCancel = () => {
    setEditedName(User?.name ?? "");
    setEditedDepartmentOrRole(User?.role ?? "");
    setIsEditing(false);
  };

  const handleSave = () => {
    showConfirmation({
      title: "Update User Profile",
      description: "Are you sure you want to save changes?",
      confirmText: "Save",
      cancelText: "Cancel",
      variant: "success",
      onConfirm: () => {
        return new Promise<boolean>((resolve) => {
          updateUser(
            {
              id: session?.user.id ?? "",
              name: editedName,
              departmentOrOrganization: editedDepartmentOrRole,
            },
            {
              onSuccess: () => {
                toast.success("User profile updated!");
                setIsEditing(false);
                void refetchSession();
                resolve(true);
              },
              onError: (error) => {
                toast.error(error.message);
                resolve(false);
              },
            },
          );
        });
      },
    });
  };

  return (
    <div className="flex min-h-screen items-start justify-center px-10">
      <Card className="container flex h-auto flex-col justify-center px-10 md:flex-row">
        {/* User Profile */}
        <div className="xs:border-b flex w-[350px] flex-col items-center border-r-gray-300 p-4 md:border-r">
          <CircleUserRound className="h-60 w-60 stroke-1" />
          <h1 className="mt-4 text-2xl font-bold">{User?.name ?? "Name"}</h1>
          <span>{User?.role ? ROLE_LABELS[User.role] : "Role"}</span>
        </div>

        {/* User Details */}
        <CardContent className="w-auto md:w-[500px]">
          <div className="flex w-full flex-col gap-4 md:flex-row md:justify-between">
            <div className="flex-1 space-y-5 md:mt-10">
              {/* Name Field */}
              <div className="space-y-2">
                <Label
                  htmlFor="name"
                  className="text-muted-foreground flex items-center gap-2 text-sm font-medium"
                >
                  <UserRound className="h-4 w-4" />
                  <span>Full Name</span>
                </Label>
                {isEditing ? (
                  <Input
                    id="name"
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                    className="font-medium"
                  />
                ) : (
                  <p className="text-foreground text-md pl-6 font-medium">
                    {User?.name}
                  </p>
                )}
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <Label className="text-muted-foreground font-xl flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4" />
                  <span>Email Address</span>
                </Label>
                <p className="text-foreground text-md pl-6 font-medium">
                  {User?.email ?? "emailexample@example.com"}
                </p>
              </div>

              {/* Department Field (Read-only) */}
              <div className="space-y-2">
                <Label className="text-muted-foreground flex items-center gap-2 text-sm font-medium">
                  <Building2 className="h-4 w-4" />
                  <span>Department</span>
                </Label>
                <p className="text-foreground text-md pl-6 font-medium">
                  {User?.departmentOrOrganization ?? "Itds"}
                </p>
              </div>

              {/* Role Field (Editable) */}
              <div className="space-y-2">
                <Label
                  htmlFor="role"
                  className="text-muted-foreground flex items-center gap-2 text-sm font-medium"
                >
                  <Briefcase className="h-4 w-4" />
                  <span>Role</span>
                </Label>
                {isEditing ? (
                  <Select
                    value={editedDepartmentOrRole}
                    onValueChange={setEditedDepartmentOrRole}
                  >
                    <SelectTrigger id="role" className="w-full font-medium">
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                      {ROLES_OPTIONS.map((role) => (
                        <SelectItem
                          key={role.value}
                          value={role.value}
                          className="font-medium"
                        >
                          {role.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <p className="text-foreground text-md pl-6 font-medium">
                    {ROLE_LABELS[User?.role ?? ""]}
                  </p>
                )}
              </div>

              {/* Created At Field (Read-only) */}
              <div className="space-y-2">
                <Label className="text-muted-foreground flex items-center gap-2 text-sm font-medium">
                  <Calendar className="h-4 w-4" />
                  <span>Created At</span>
                </Label>
                <p className="text-foreground text-md pl-6 font-medium">
                  {User?.createdAt ? formatISODate(User.createdAt) : ""}
                </p>
              </div>
            </div>
            <div className="flex justify-end">
              {!isEditing ? (
                <Button
                  onClick={() => setIsEditing(true)}
                  variant="outline"
                  size="sm"
                  className="bg-backgrounds gap-2"
                >
                  <Edit2 className="h-4 w-4" />
                  Edit Profile
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button onClick={handleSave} size="sm" className="gap-2">
                    <Check className="h-4 w-4" />
                    Save
                  </Button>
                  <Button
                    onClick={handleCancel}
                    variant="outline"
                    size="sm"
                    className="gap-2 bg-transparent"
                  >
                    <CircleX className="h-4 w-4" />
                    Cancel
                  </Button>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
      {ConfirmationDialog}
    </div>
  );
}
