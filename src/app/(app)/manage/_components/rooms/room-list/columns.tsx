"use client";
import { type ColumnDef } from "@tanstack/react-table";
import { createSortableHeader } from "@/components/table/data-table";
import { Badge } from "@/components/ui/badge";

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

const getTypeBadge = (type: string | null) => {
  switch (type) {
    case "lecture":
      return (
        <Badge
          variant="outline"
          className="border-yellow-200 bg-yellow-50 text-yellow-700"
        >
          Lecture
        </Badge>
      );
    case "laboratory":
      return (
        <Badge
          variant="outline"
          className="border-blue-200 bg-blue-50 text-blue-700"
        >
          Laboratory
        </Badge>
      );
    default:
  }
};
interface Classroom {
  id: string;
  name: string;
  buildingId: string;
  buildingName: string | null;
  capacity: number;
  floor: string;
  type: string;
  usability: "operational" | "non-operational";
}
export const columns: ColumnDef<Classroom>[] = [
  {
    accessorKey: "name",
    header: createSortableHeader("Classroom"),
  },
  {
    accessorKey: "building",
    header: createSortableHeader("Building"),
    cell: ({ row }) => {
      const buildingName = row.original.buildingName;
      return buildingName ?? "N/A";
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
      return getTypeBadge(type);
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
