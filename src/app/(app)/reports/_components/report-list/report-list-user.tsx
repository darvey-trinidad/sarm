"use client";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { cn, newDate, formatISODate } from "@/lib/utils";
import { api } from "@/trpc/react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import NoReports from "@/components/loading-state/no-reports";
import LoadingMessage from "@/components/loading-state/loading-message";
import { Car } from "lucide-react";
import {
  Clock,
  MapPin,
  User,
  CalendarIcon,
  AlertTriangle,
  CheckCircle,
  AlertCircle,
  Loader2,
  Zap,
  Wrench,
  Settings,
  Droplets,
  HelpCircle,
  Building,
  Camera,
} from "lucide-react";

const getCategoryIcon = (category: string) => {
  switch (category) {
    case "electrical":
      return <Zap className="h-4 w-4 text-yellow-600" />;
    case "plumbing":
      return <Droplets className="h-4 w-4 text-blue-600" />;
    case "equipment":
      return <Settings className="h-4 w-4 text-gray-600" />;
    case "sanitation":
      return <Wrench className="h-4 w-4 text-green-600" />;
    default:
      return <HelpCircle className="h-4 w-4 text-purple-600" />;
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "resolved":
      return <CheckCircle className="h-4 w-4 text-green-600" />;
    case "ongoing":
      return <AlertTriangle className="h-4 w-4 text-orange-600" />;
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
export default function ReportListUser() {
  const { data: session } = authClient.useSession();
  const { data: ReportListUser, isLoading } =
    api.facilityIssue.getAllFacilityIssueReportsByUser.useQuery({
      userId: session?.user.id ?? "",
    });
  return (
    <div className="space-y-4">
      <div className="flex flex-col">
        <h2 className="text-2xl font-bold">My Reports</h2>
        <p className="text-muted-foreground">
          View and manage your facility issue reports.
        </p>
      </div>

      {/* Report List */}
      <div className="grid gap-4">
        {!isLoading && ReportListUser?.length === 0 ? (
          <NoReports />
        ) : isLoading ? (
          <LoadingMessage />
        ) : (
          ReportListUser?.map((report) => (
            <Card
              key={report.id}
              className="border-border transition-shadow hover:shadow-md"
            >
              <CardContent className="p-6">
                <div className="mb-4 flex flex-col items-start justify-between gap-2 lg:flex-row">
                  <div className="flex items-start gap-4">
                    <div className="flex-1">
                      <div className="mb-2 flex items-center gap-2">
                        <h3 className="text-foreground text-lg font-semibold">
                          {report.description}
                        </h3>
                        <Badge
                          className={`${getStatusColor(report.status)} flex items-center gap-1`}
                        >
                          {getStatusIcon(report.status)}
                          {report.status.charAt(0).toUpperCase() +
                            report.status.slice(1)}
                        </Badge>
                        <Badge
                          className={`${getCategoryColor(report.category)} flex items-center gap-1`}
                        >
                          {getCategoryIcon(report.category)}
                          {report.category.charAt(0).toUpperCase() +
                            report.category.slice(1)}
                        </Badge>
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

                        {(report.buildingName || report.classroomName) && (
                          <div className="flex items-center gap-2">
                            <Building className="h-4 w-4" />
                            <span>
                              {report.buildingName && report.classroomName
                                ? `${report.buildingName} - ${report.classroomName}`
                                : report.buildingName || report.classroomName}
                            </span>
                          </div>
                        )}

                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          <span>{formatISODate(report.dateReported)}</span>
                        </div>
                      </div>

                      {report.details && (
                        <div className="bg-muted mt-3 rounded-lg p-3">
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

                  <div className="ml-4 flex items-center gap-2">
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
    </div>
  );
}
