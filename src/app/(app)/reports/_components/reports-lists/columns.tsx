"use clients";
import { createSortableHeader } from "@/components/table/data-table";
import { type ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  Filter,
  MoreHorizontal,
  Search,
  Wrench,
} from "lucide-react";

const getStatusIcon = (status: string) => {
  switch (status) {
    case "ongoing":
      return <Clock className="h-4 w-4 text-yellow-500" />;
    case "reported":
      return <AlertCircle className="h-4 w-4 text-blue-500" />;
    case "resolved":
      return <CheckCircle2 className="h-4 w-4 text-green-500" />;
    default:
      return null;
  }
};

const getStatusBadge = (status: string) => {
  switch (status) {
    case "ongoing":
      return (
        <Badge className="border-yellow-200 bg-yellow-100 text-yellow-700">
          Ongoing
        </Badge>
      );
    case "reported":
      return (
        <Badge className="border-blue-200 bg-blue-100 text-blue-700">
          Reported
        </Badge>
      );
    case "resolved":
      return (
        <Badge className="border-green-200 bg-green-100 text-green-700">
          Resolved
        </Badge>
      );
    default:
      return null;
  }
};

const getPriorityBadge = (priority: string) => {
  switch (priority) {
    case "low":
      return (
        <Badge className="border-green-200 bg-green-100 text-green-700">
          Low
        </Badge>
      );
    case "medium":
      return (
        <Badge className="border-yellow-200 bg-yellow-100 text-yellow-700">
          Medium
        </Badge>
      );
    case "high":
      return (
        <Badge className="border-red-200 bg-red-100 text-red-700">High</Badge>
      );
    default:
      return null;
  }
};

interface ReportList {
  id: string;
  title: string;
  location: string;
  dateSubmitted: string;
  status: "ongoing" | "reported" | "resolved";
  priority: "low" | "medium" | "high";
}

export const columns: ColumnDef<ReportList>[] = [
  {
    accessorKey: "title",
    header: createSortableHeader("Title"),
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("title")}</div>
    ),
  },
  {
    accessorKey: "location",
    header: createSortableHeader("Location"),
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("location")}</div>
    ),
  },
  {
    accessorKey: "dateSubmitted",
    header: createSortableHeader("Date Submitted"),
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("dateSubmitted")}</div>
    ),
  },
  {
    accessorKey: "priority",
    header: "Priority",
    cell: ({ row }) => (
      <div className="flex items-center gap-2 font-medium">
        {getPriorityBadge(row.getValue("priority"))}
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <div className="flex items-center gap-2 font-medium">
        {getStatusIcon(row.getValue("status"))}
        {getStatusBadge(row.getValue("status"))}
      </div>
    ),
  },
];
