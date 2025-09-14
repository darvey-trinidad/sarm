"use clients";
import { createSortableHeader } from "@/components/table/data-table";
import { type ColumnDef } from "@tanstack/react-table";
import { int } from "better-auth";

interface Building {
  id: string;
  name: string;
  description: string | null;
}

export const columns: ColumnDef<Building>[] = [
  {
    accessorKey: "name",
    header: createSortableHeader("Name"),
  },
  {
    accessorKey: "description",
    header: "Description",
  },
];
