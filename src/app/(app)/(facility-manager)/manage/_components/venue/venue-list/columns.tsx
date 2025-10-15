"use clients";

import { createSortableHeader } from "@/components/table/data-table";
import { type ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { createActionColumn } from "@/components/table/action-column";
import { Pencil } from "lucide-react";
import VenueEditForm from "../action-column/edit-venue-form";

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
interface Venue {
  id: string;
  name: string;
  description: string | null;
  capacity: number | null;
  usability: "operational" | "non-operational";
}

export const columns: ColumnDef<Venue>[] = [
  {
    accessorKey: "name",
    header: createSortableHeader("Venue"),
    cell: ({ row }) => <div className="pl-3">{row.getValue("name")}</div>,
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    accessorKey: "capacity",
    header: "Capacity",
  },
  createActionColumn<Venue>([
    {
      label: "Edit Venue",
      icon: <Pencil className="h-4 w-4" />,
      render: (venue) => <VenueEditForm venue={venue} />,
    },
  ]),
];
