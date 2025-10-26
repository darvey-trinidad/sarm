"use client";
import { createSortableHeader } from "@/components/table/data-table";
import { type ColumnDef } from "@tanstack/react-table";
import { UserCheck, UserX, Pencil, Save, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Roles, ROLES_OPTIONS } from "@/constants/roles";
import { DEPARTMENT_OR_ORGANIZATION_OPTIONS } from "@/constants/dept-org";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { api } from "@/trpc/react";
import { useState } from "react";

const getUserRoleLabel = (role: string): string => {
  const roleOption = ROLES_OPTIONS.find(r => r.value === role);
  return roleOption?.label ?? role;
};

const getStatusBadge = (isActive: boolean) => {
  if (isActive) {
    return (
      <Badge
        variant="outline"
        className="border-green-200 bg-green-50 text-green-700"
      >
        <UserCheck className="mr-1 h-3 w-3" />
        Active
      </Badge>
    );
  } else {
    return (
      <Badge
        variant="outline"
        className="border-red-200 bg-red-50 text-red-700"
      >
        <UserX className="mr-1 h-3 w-3" />
        Inactive
      </Badge>
    );
  }
};

const formatTimestamp = (timestamp: Date): string => {
  const date = new Date(timestamp);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const formatRelativeTime = (timestamp: Date): string => {
  const now = new Date().getTime();
  const diffInMs = now - timestamp.getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInDays === 0) return "Today";
  if (diffInDays === 1) return "Yesterday";
  if (diffInDays < 7) return `${diffInDays} days ago`;
  if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
  if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} months ago`;
  return `${Math.floor(diffInDays / 365)} years ago`;
};

interface User {
  id: string;
  name: string | null;
  email: string;
  role: Roles;
  departmentOrOrganization: string | null;
  isActive: boolean;
  createdAt: Date;
}

interface EditState {
  userId: string;
  role: Roles;
  departmentOrOrganization: string;
  isActive: boolean;
}

// Shared state for editing
let currentEditState: EditState | null = null;
const editStateListeners: Set<(state: EditState | null) => void> = new Set();

const setEditState = (state: EditState | null) => {
  currentEditState = state;
  editStateListeners.forEach(listener => listener(state));
};

const useEditState = () => {
  const [state, setState] = useState<EditState | null>(currentEditState);

  useState(() => {
    editStateListeners.add(setState);
    return () => editStateListeners.delete(setState);
  });

  return state;
};

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "name",
    header: createSortableHeader("Name"),
    cell: ({ row }) => (
      <div className="pl-3 font-medium">{row.getValue("name")}</div>
    ),
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "role",
    header: createSortableHeader("Role"),
    cell: ({ row }) => {
      const editState = useEditState();
      const isEditing = editState?.userId === row.original.id;

      if (isEditing) {
        return (
          <Select
            value={editState.role}
            onValueChange={(val) => setEditState({ ...editState, role: val as Roles })}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {ROLES_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      }

      return <div className="pl-3">{getUserRoleLabel(row.original.role)}</div>;
    },
  },
  {
    accessorKey: "departmentOrOrganization",
    header: createSortableHeader("Department/Organization"),
    cell: ({ row }) => {
      const editState = useEditState();
      const isEditing = editState?.userId === row.original.id;

      if (isEditing) {
        return (
          <Select
            value={editState.departmentOrOrganization}
            onValueChange={(val) => setEditState({ ...editState, departmentOrOrganization: val })}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select dept/org" />
            </SelectTrigger>
            <SelectContent>
              {DEPARTMENT_OR_ORGANIZATION_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      }

      const val: string | null = row.getValue("departmentOrOrganization");
      return val ? <div className="pl-3">{val.toUpperCase()}</div> : <div className="pl-3 text-muted-foreground">N/A</div>;
    },
  },
  {
    accessorKey: "createdAt",
    header: "Date Created",
    cell: ({ row }) => {
      const timestamp: Date = row.getValue("createdAt");
      const formatted = formatTimestamp(timestamp);
      const relative = formatRelativeTime(timestamp);

      return (
        <div className="text-sm">
          {formatted}
          <div className="text-muted-foreground text-xs">{relative}</div>
        </div>
      );
    },
    sortingFn: (rowA, rowB) => {
      const timestampA: Date = rowA.getValue("createdAt");
      const timestampB: Date = rowB.getValue("createdAt");
      return timestampB.getTime() - timestampA.getTime();
    },
  },
  {
    accessorKey: "isActive",
    header: "Status",
    cell: ({ row }) => {
      const editState = useEditState();
      const isEditing = editState?.userId === row.original.id;

      if (isEditing) {
        return (
          <Select
            value={editState.isActive ? "active" : "inactive"}
            onValueChange={(val) => setEditState({ ...editState, isActive: val === "active" })}
          >
            <SelectTrigger className="w-[130px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">
                <div className="flex items-center">
                  <UserCheck className="mr-2 h-4 w-4 text-green-600" />
                  Active
                </div>
              </SelectItem>
              <SelectItem value="inactive">
                <div className="flex items-center">
                  <UserX className="mr-2 h-4 w-4 text-red-600" />
                  Inactive
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        );
      }

      return getStatusBadge(row.original.isActive);
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const user = row.original;
      const utils = api.useUtils();
      const editState = useEditState();
      const isEditing = editState?.userId === user.id;

      const { mutate: editMutation, isPending } =
        api.auth.editUser.useMutation({
          onSuccess: async () => {
            await utils.auth.getAllUsers.invalidate();
            setEditState(null);
          },
        });

      const handleEdit = () => {
        setEditState({
          userId: user.id,
          role: user.role,
          departmentOrOrganization: user.departmentOrOrganization ?? "",
          isActive: user.isActive,
        });
      };

      const handleSave = () => {
        if (!editState) return;

        editMutation({
          id: user.id,
          role: editState.role,
          departmentOrOrganization: editState.departmentOrOrganization ?? undefined,
          isActive: editState.isActive,
        });
      };

      const handleCancel = () => {
        setEditState(null);
      };

      if (isEditing) {
        return (
          <div className="flex gap-2">
            <Button
              variant="default"
              size="sm"
              onClick={handleSave}
              disabled={isPending}
            >
              {isPending ? (
                "Saving..."
              ) : (
                <>
                  <Save className="mr-1 h-4 w-4" />
                  Save
                </>
              )}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleCancel}
              disabled={isPending}
            >
              <X className="mr-1 h-4 w-4" />
              Cancel
            </Button>
          </div>
        );
      }

      return (
        <Button variant="outline" size="sm" onClick={handleEdit}>
          <Pencil className="mr-1 h-4 w-4" />
          Edit
        </Button>
      );
    },
  },
];