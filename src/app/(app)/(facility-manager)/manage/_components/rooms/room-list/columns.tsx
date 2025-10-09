"use client";
import { type ColumnDef } from "@tanstack/react-table";
import { createSortableHeader } from "@/components/table/data-table";
import { Badge } from "@/components/ui/badge";
import type { ReactNode } from "react";
import { CLASSROOM_TYPE_LABELS, ClassroomTypeValues, type ClassroomType } from "@/constants/classroom-type";

const getUsabilityBadge = (usability: string | null) => {
  switch (usability) {
    case "operational":
      return (
        <Badge
          variant="outline"
          className="border-green-200 bg-green-50 text-green-700"
        >
          Operational
        </Badge>
      );
    case "non-operational":
      return (
        <Badge
          variant="outline"
          className="border-red-200 bg-red-50 text-red-700"
        >
          Non-Operational
        </Badge>
      );
    default:
      return <Badge variant="outline">NA</Badge>;
  }
};

const getTypeBadge = (type: ClassroomType) => {
  switch (type) {
    case ClassroomTypeValues.Lecture:
      return (
        <Badge
          variant="outline"
          className="border-yellow-200 bg-yellow-50 text-yellow-700"
        >
          {CLASSROOM_TYPE_LABELS[type]}
        </Badge>
      );
    default:
      return (
        <Badge
          variant="outline"
          className="border-blue-200 bg-blue-50 text-blue-700"
        >
          {CLASSROOM_TYPE_LABELS[type]}
        </Badge>
      );
  }
};


interface Classroom {
  id: string;
  name: string;
  buildingId: string;
  buildingName: string | null;
  capacity: number;
  floor: string;
  type: ClassroomType;
  usability: "operational" | "non-operational";
}
export const columns: ColumnDef<Classroom>[] = [
  {
    accessorKey: "name",
    header: createSortableHeader("Classroom"),
    cell: (info) => <div className="pl-3">{info.getValue() as ReactNode}</div>,
  },
  {
    accessorKey: "building",
    header: createSortableHeader("Building"),
    cell: ({ row }) => {
      const buildingName = row.original.buildingName;
      return <div className="pl-3">{buildingName ?? "N/A"}</div>;
    },
  },
  {
    accessorKey: "capacity",
    header: "Capacity",
  },
  {
    accessorKey: "floor",
    header: "Floor",
  },
  {
    accessorKey: "type",
    header: createSortableHeader("Type"),
    cell: ({ row }) => {
      const type = row.original.type;
      return <div className="pl-3">{getTypeBadge(type)}</div>;
    },
  },
  {
    accessorKey: "usability",
    header: "Usability",
    cell: ({ row }) => {
      const usability = row.original.usability;
      return getUsabilityBadge(usability);
    },
  },
];
