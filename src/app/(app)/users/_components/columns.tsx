"use clients";

import { type ColumnDef } from "@tanstack/react-table";

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
    header: "Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "role",
    header: "Role",
  },
  {
    accessorKey: "departmentOrOrganization",
    header: "Department/Organization",
  },
  {
    accessorKey: "isActive",
    header: "Status",
  },
];
