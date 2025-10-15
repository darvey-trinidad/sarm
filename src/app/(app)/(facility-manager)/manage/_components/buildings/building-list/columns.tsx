"use clients";
import { createSortableHeader } from "@/components/table/data-table";
import { createActionColumn } from "@/components/table/action-column";
import { type ColumnDef } from "@tanstack/react-table";
import type { ReactNode } from "react";
import BuildingEditForm from "./action-column/edit-building-form";

interface Building {
  id: string;
  name: string;
  description: string | null;
}

export const columns: ColumnDef<Building>[] = [
  {
    accessorKey: "name",
    header: createSortableHeader("Building"),
    cell: (info) => <div className="pl-3">{info.getValue() as ReactNode}</div>,
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  createActionColumn<Building>([
    {
      label: "Edit Building",
      render: (building) => <BuildingEditForm building={building} />,
    },
  ]),
];
