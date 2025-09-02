"use client";
import { useState } from "react";
import { DataTable } from "@/components/table/data-table";
import { DataTableSkeleton } from "@/components/table/data-table-skeleton";
import { columns } from "./columns";

interface Reports {
  id: string;
  title: string;
  location: string;
  dateSubmitted: string;
  status: "ongoing" | "reported" | "resolved";
  priority: "low" | "medium" | "high";
}

interface ReportListProps {
  filter: "my-reports" | "all-reports";
}

// Mock data change this later.
const mockReports: Reports[] = [
  {
    id: "REP-001",
    title: "Broken Ceiling Fan",
    location: "Building A, Room 201",
    dateSubmitted: "April 27, 2025",
    status: "ongoing",
    priority: "medium",
  },
  {
    id: "REP-002",
    title: "Flickering Light Bulbs",
    location: "Building C, Room 302",
    dateSubmitted: "April 26, 2025",
    status: "reported",
    priority: "low",
  },
  {
    id: "REP-003",
    title: "Leaking Water Fountain",
    location: "Building B, 1st Floor Hallway",
    dateSubmitted: "April 25, 2025",
    status: "resolved",
    priority: "high",
  },
  {
    id: "REP-004",
    title: "Broken Door Handle",
    location: "Building D, Room 105",
    dateSubmitted: "April 24, 2025",
    status: "ongoing",
    priority: "low",
  },
  {
    id: "REP-005",
    title: "AC Not Working",
    location: "Building E, Room 401",
    dateSubmitted: "April 23, 2025",
    status: "resolved",
    priority: "high",
  },
];

export default function ReportTable({ filter }: ReportListProps) {
  const reports =
    filter === "my-reports"
      ? mockReports.filter((r) => r.id.startsWith("REP-00")) // TODO: replace with real user-owned filter
      : mockReports;

  return (
    <div className="space-y-4">
      <DataTable
        columns={columns}
        data={mockReports}
        searchKey="title"
        searchPlaceholder="Search by title..."
      />
    </div>
  );
}
