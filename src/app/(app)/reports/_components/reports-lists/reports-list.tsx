"use client";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  Filter,
  MoreHorizontal,
  Search,
  Wrench,
} from "lucide-react";

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

export default function ReportList({ filter }: ReportListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  const filteredReports = mockReports.filter((report) => {
    const matchesSearch =
      report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.location.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter ? report.status === statusFilter : true;

    return matchesSearch && matchesStatus;
  });

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
  return (
    <div className="space-y-4">
      <div className="flex flex-col justify-between gap-4 sm:flex-row">
        <div className="relative w-full sm:max-w-xs">
          <Search className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
          <Input
            type="search"
            placeholder="Search reports..."
            className="w-full pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              <span>Filter</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => setStatusFilter(null)}>
              All Statuses
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setStatusFilter("ongoing")}>
              On Going
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setStatusFilter("reported")}>
              Reported
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setStatusFilter("resolved")}>
              Resolved
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      {filteredReports.length > 0 ? (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Report ID</TableHead>
                <TableHead>Issue</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Date Submitted</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredReports.map((report) => (
                <TableRow key={report.id}>
                  <TableCell className="font-medium">{report.id}</TableCell>
                  <TableCell>{report.title}</TableCell>
                  <TableCell>{report.location}</TableCell>
                  <TableCell>{report.dateSubmitted}</TableCell>
                  <TableCell>{getPriorityBadge(report.priority)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(report.status)}
                      {getStatusBadge(report.status)}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem>View details</DropdownMenuItem>
                        <DropdownMenuItem>Update status</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-md border border-dashed p-8 text-center">
          <div className="bg-muted rounded-full p-3">
            <AlertCircle className="text-muted-foreground h-6 w-6" />
          </div>
          <h3 className="mt-4 text-lg font-semibold">No reports found</h3>
          <p className="text-muted-foreground mt-2 text-sm">
            {searchTerm || statusFilter
              ? "Try adjusting your search or filter to find what you're looking for."
              : "There are no reports to display at this time."}
          </p>
        </div>
      )}
    </div>
  );
}
