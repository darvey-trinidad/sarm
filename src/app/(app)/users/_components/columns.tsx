"use clients";
import { createSortableHeader } from "@/components/table/data-table";
import { createActionColumn } from "@/components/table/action-column";
import { type ColumnDef } from "@tanstack/react-table";
import { UserCheck, UserX, Mail, Edit, Key, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

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

// Utility function to format timestamp to relative time
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
  name: string;
  email: string;
  role: string;
  departmentOrOrganization: string;
  isActive: boolean;
}

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "name",
    header: createSortableHeader("Name"),
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("name")}</div>
    ),
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "role",
    header: createSortableHeader("Role"),
  },
  {
    accessorKey: "departmentOrOrganization",
    header: createSortableHeader("Department/Organization"),
    cell: ({ row }) => {
      const val: string = row.getValue("departmentOrOrganization");
      return val ? val.toUpperCase() : "N/A";
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
      // Sort by timestamp (newest first)
      const timestampA: Date = rowA.getValue("createdAt");
      const timestampB: Date = rowB.getValue("createdAt");
      return timestampB.getTime() - timestampA.getTime();
    },
  },
  {
    accessorKey: "isActive",
    header: "Status",
    cell: ({ row }) => {
      const isActive: boolean = row.getValue("isActive");
      if (isActive) {
        return getStatusBadge(true);
      } else {
        return getStatusBadge(false);
      }
    },
  },

  //   createActionColumn<User>([
  //     {
  //       label: "Edit user",
  //       //onClick: handleEditUser,
  //       icon: <Edit className="h-4 w-4" />,
  //     },
  //     {
  //       label: "Send email",
  //       //onClick: handleSendEmail,
  //       icon: <Mail className="h-4 w-4" />,
  //     },
  //     {
  //       label: "Reset password",
  //       //onClick: handleResetPassword,
  //       icon: <Key className="h-4 w-4" />,
  //     },
  //     {
  //       label: (user: User) =>
  //         user.isActive ? "Deactivate user" : "Activate user",
  //       //onClick: handleToggleStatus,
  //       icon: (user: User) =>
  //         user.isActive ? (
  //           <UserX className="h-4 w-4" />
  //         ) : (
  //           <UserCheck className="h-4 w-4" />
  //         ),
  //     },
  //     {
  //       label: "Delete user",
  //       //onClick: handleDeleteUser,
  //       icon: <Trash2 className="h-4 w-4" />,
  //       variant: "destructive",
  //     },
  //   ]),
];
