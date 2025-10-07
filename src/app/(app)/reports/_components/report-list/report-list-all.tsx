"use client";

import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { cn, newDate, formatISODate } from "@/lib/utils";
import { format } from "date-fns";
import { api } from "@/trpc/react";
import { toast } from "sonner";
import { useConfirmationDialog } from "@/components/dialog/use-confirmation-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Clock,
  MapPin,
  User,
  Filter,
  CalendarIcon,
  Search,
  AlertTriangle,
  CheckCircle,
  AlertCircle,
  Zap,
  Wrench,
  Settings,
  Droplets,
  HelpCircle,
  Building,
  Camera,
  Copy,
} from "lucide-react";
import {
  REPORT_CATEGORY_OPTIONS,
  type ReportCategory,
} from "@/constants/report-category";
import {
  REPORT_STATUS_OPTIONS,
  ReportStatusValues,
  type ReportStatus,
} from "@/constants/report-status";
import NoReports from "@/components/loading-state/no-reports";
import LoadingMessage from "@/components/loading-state/loading-message";
import { D } from "node_modules/better-auth/dist/shared/better-auth.CUMpWXN6";

export default function ReportListContent() {
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const { showConfirmation, ConfirmationDialog } = useConfirmationDialog();
  const [selectedStatus, setSelectedStatus] = useState<ReportStatus | "all">(
    "all",
  );
  const [selectedCategory, setSelectedCategory] = useState<
    ReportCategory | "all"
  >("all");

  const filters = useMemo(
    () => ({
      status: selectedStatus === "all" ? undefined : selectedStatus,
      category: selectedCategory === "all" ? undefined : selectedCategory,
      startDate: startDate ? newDate(startDate) : undefined,
      endDate: endDate ? newDate(endDate) : undefined,
    }),
    [selectedStatus, selectedCategory, startDate, endDate],
  );

  const { mutate: editStatusMutation } =
    api.facilityIssue.editFacilityIssueReportStatus.useMutation();

  const {
    data: reports,
    isLoading,
    refetch: refetchReports,
  } = api.facilityIssue.getAllFacilityIssueReports.useQuery({
    status: filters.status,
    category: filters.category,
    startDate: filters.startDate ? newDate(filters.startDate) : undefined,
    endDate: filters.endDate
      ? (() => {
          const adjustedDate = new Date(filters.endDate);
          adjustedDate.setDate(adjustedDate.getDate() + 1);
          return newDate(adjustedDate);
        })()
      : undefined,
  });
  const filteredReports = useMemo(() => {
    if (!reports) return [];

    if (!searchTerm) return reports;

    const searchLower = searchTerm.toLowerCase();
    return reports.filter(
      (report) =>
        (report.reportedByName?.toLowerCase().includes(searchLower) ?? false) ||
        report.description.toLowerCase().includes(searchLower) ||
        report.location.toLowerCase().includes(searchLower) ||
        (report.buildingName?.toLowerCase().includes(searchLower) ?? false) ||
        (report.classroomName?.toLowerCase().includes(searchLower) ?? false),
    );
  }, [reports, searchTerm]);

  const handleUpdateStatus = (reportId: string, newStatus: ReportStatus) => {
    showConfirmation({
      title: "Update Report Status",
      description: `Are you sure you want to update the status of this report to ${newStatus}?`,
      confirmText: "Update",
      cancelText: "Cancel",
      variant: "success",
      onConfirm: () => {
        return new Promise<boolean>((resolve) => {
          editStatusMutation(
            {
              id: reportId,
              status: newStatus,
            },
            {
              onSuccess: () => {
                toast.success(`Report status updated to ${newStatus}`);
                void refetchReports();
                resolve(true);
              },
              onError: () => {
                toast.error("Failed to update report status!");
                resolve(false);
              },
            },
          );
        });
      },
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "resolved":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "ongoing":
        return <AlertTriangle className="h-4 w-4 text-orange-600" />;
      case "duplicate":
        return <Copy className="h-4 w-4 text-yellow-600" />;
      default:
        return <AlertCircle className="h-4 w-4 text-red-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "resolved":
        return "bg-green-100 text-green-800 border-green-200";
      case "ongoing":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "duplicate":
        return "bg-orange-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-red-100 text-red-800 border-red-200";
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "electrical":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "plumbing":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "equipment":
        return "bg-gray-100 text-gray-800 border-gray-200";
      case "sanitation":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-purple-100 text-purple-800 border-purple-200";
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-5">
        <div className="flex flex-col">
          <h2 className="text-2xl font-bold">All Reports</h2>
          <p className="text-muted-foreground">
            View and manage all facility issue reports.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-row items-center gap-2">
          <Filter className="h-5 w-5" />
          <h3 className="font-semibold">Filters</h3>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-5">
          {/* Search Filter */}
          <div className="space-y-2">
            <div className="relative">
              <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform" />
              <Input
                id="search"
                placeholder="search by reporter, details..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div className="space-y-2">
            <Select
              value={selectedCategory}
              onValueChange={(value) =>
                setSelectedCategory(value as ReportCategory | "all")
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {REPORT_CATEGORY_OPTIONS.map((status) => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Status Filter */}
          <div className="space-y-2">
            <Select
              value={selectedStatus}
              onValueChange={(value) =>
                setSelectedStatus(value as ReportStatus | "all")
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                {REPORT_STATUS_OPTIONS.map((status) => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Start Date */}
          <div className="space-y-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !startDate && "text-muted-foreground",
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {startDate ? format(startDate, "PPP") : "Pick start date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={startDate}
                  onSelect={setStartDate}
                  captionLayout="dropdown"
                  disabled={(date) => date < new Date("1900-01-01")}
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* End Date */}
          <div className="space-y-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !endDate && "text-muted-foreground",
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {endDate ? format(endDate, "PPP") : "Pick end date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={endDate}
                  onSelect={setEndDate}
                  captionLayout="dropdown"
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>

      {/* Report lists */}
      <div className="grid gap-4">
        {!isLoading && filteredReports.length === 0 ? (
          <NoReports />
        ) : isLoading ? (
          <LoadingMessage />
        ) : (
          filteredReports.map((report) => (
            <Card key={report.id}>
              <CardContent className="p-6">
                <div className="mb-4 flex flex-col items-start justify-between gap-2 lg:flex-row">
                  <div className="flex items-start gap-4">
                    <div className="flex-1">
                      <div className="flex flex-col gap-2 md:flex-row">
                        <h3 className="text-medium font-semibold text-gray-800">
                          {report.description}
                        </h3>
                        <div className="flex items-center">
                          <Badge
                            className={`${getStatusColor(report.status)} flex items-center gap-1`}
                          >
                            {getStatusIcon(report.status)}
                            {report.status.charAt(0).toUpperCase() +
                              report.status.slice(1)}
                          </Badge>
                          <Badge
                            className={`${getCategoryColor(report.category)} ml-2 flex items-center gap-1`}
                          >
                            {report.category.charAt(0).toUpperCase() +
                              report.category.slice(1)}
                          </Badge>
                        </div>
                      </div>

                      <div className="text-muted-foreground flex flex-col gap-4 pt-2 lg:flex-row">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          <span>{report.reportedByName}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          <span>{report.location}</span>
                        </div>

                        {(report.buildingName ?? report.classroomName) && (
                          <div className="flex items-center gap-2">
                            <Building className="h-4 w-4" />
                            <span>
                              {report.buildingName && report.classroomName
                                ? `${report.buildingName} - ${report.classroomName}`
                                : (report.buildingName ?? report.classroomName)}
                            </span>
                          </div>
                        )}

                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          <span>{formatISODate(report.dateReported)}</span>
                        </div>
                      </div>

                      {report.details && (
                        <div className="mt-3 rounded-lg bg-stone-50 p-3">
                          <h4 className="text-foreground mb-1 text-sm font-medium">
                            Additional Details:
                          </h4>
                          <p className="text-muted-foreground text-sm">
                            {report.details}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-2 flex items-center gap-2 md:mt-0">
                    {report.imageUrl &&
                      report.imageUrl !== "https://example.com" && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            report.imageUrl &&
                            window.open(report.imageUrl, "_blank")
                          }
                          className="flex items-center gap-1"
                        >
                          <Camera className="h-4 w-4" />
                          View Image
                        </Button>
                      )}

                    {report.status === ReportStatusValues.Reported && (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() =>
                            handleUpdateStatus(
                              report.id,
                              ReportStatusValues.Ongoing,
                            )
                          }
                          className="bg-primary hover:bg-primary/90 text-white"
                        >
                          <AlertTriangle className="mr-1 h-4 w-4" />
                          Start Work
                        </Button>
                      </div>
                    )}

                    {report.status === ReportStatusValues.Reported && (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() =>
                            handleUpdateStatus(
                              report.id,
                              ReportStatusValues.Duplicate,
                            )
                          }
                          className="bg-orange-600 text-white hover:bg-orange-700"
                        >
                          <Copy className="mr-1 h-4 w-4" />
                          Mark Duplicate
                        </Button>
                      </div>
                    )}

                    {report.status === ReportStatusValues.Ongoing && (
                      <Button
                        size="sm"
                        onClick={() =>
                          handleUpdateStatus(
                            report.id,
                            ReportStatusValues.Resolved,
                          )
                        }
                        className="bg-green-600 text-white hover:bg-green-700"
                      >
                        <CheckCircle className="mr-1 h-4 w-4" />
                        Mark Resolved
                      </Button>
                    )}
                  </div>
                </div>

                <div className="text-muted-foreground border-border border-t pt-3 text-xs">
                  Reported on {formatISODate(report.dateReported)}
                  {report.dateUpdated &&
                    ` • Last updated on ${formatISODate(report.dateUpdated)}`}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
      {ConfirmationDialog}
    </div>
  );
}
