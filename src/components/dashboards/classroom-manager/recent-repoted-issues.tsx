"use client";
import { api } from "@/trpc/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  AlertCircle,
  Building2,
  Calendar,
  Camera,
  Droplet,
  MapPin,
  User,
  Wrench,
  Zap,
} from "lucide-react";
import { CurrentScheduleSkeleton } from "../_components/skeletons/received-room-skeleton";
import {
  getCategoryBgColor,
  getCategoryIcon,
  getStatusColor,
} from "./status-icon";
import { formatISODate } from "@/lib/utils";
export default function RecentRepotedIssues() {
  const { data: recentFacilityIssues, isLoading } =
    api.facilityIssue.getRecentFacilityIssueReports.useQuery();

  return (
    <Card className="w-full p-6">
      <h3 className="text-md font-semibold">Recent Repoted Issues</h3>

      <ScrollArea className="h-[450px]">
        <div className="space-y-4">
          {isLoading ? (
            <CurrentScheduleSkeleton />
          ) : recentFacilityIssues?.length === 0 ? (
            <div>No recent reported issues</div>
          ) : (
            recentFacilityIssues?.map((issue) => (
              <div key={issue.id} className="flex flex-col">
                <Card className="border-none bg-stone-50 shadow-none">
                  <div className="mb-4 flex flex-col items-start justify-between gap-2 lg:flex-row">
                    <div>
                      <CardHeader className="pb-2">
                        <div className="flex flex-wrap items-start justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <div
                              className={`flex h-10 w-10 items-center justify-center rounded-lg ${getCategoryBgColor(issue.category)}`}
                            >
                              {getCategoryIcon(issue.category)}
                            </div>
                            <div>
                              <h3 className="leading-none font-semibold">
                                {issue.description}
                              </h3>
                              <p className="text-muted-foreground mt-1 text-sm">
                                {issue.category}
                              </p>
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3 pt-4">
                        {/* Location Information */}
                        <div className="flex flex-col gap-4 pt-2 text-gray-600 lg:flex-row">
                          <div className="flex items-start gap-2 text-sm">
                            <Building2 className="mt-0.5 h-4 w-4" />

                            <div className="flex items-center gap-2">
                              <p>{issue.buildingName}</p>
                              {issue.classroomName && (
                                <p>(Room {issue.classroomName})</p>
                              )}
                            </div>
                          </div>
                          <div className="flex items-start gap-2">
                            <MapPin className="mt-0.5 h-4 w-4" />
                            <p className="min-w-0 flex-1 text-sm">
                              {issue.location}
                            </p>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <User className="h-4 w-4" />
                            <span>Reporter: {issue.reportedByName}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Calendar className="h-4 w-4" />
                            <span>{formatISODate(issue.dateReported)}</span>
                          </div>
                        </div>

                        {/* Details */}
                        {issue.details && (
                          <div className="mt-4 rounded-lg bg-stone-100 p-3">
                            <h4 className="text-foreground mb-1 text-sm font-medium">
                              Additional Details:
                            </h4>
                            <p className="text-muted-foreground text-sm">
                              {issue.details}
                            </p>
                          </div>
                        )}
                      </CardContent>
                    </div>

                    <CardContent className="mt-2 flex items-center gap-2 md:mt-0">
                      {/* Image Button */}
                      {issue.imageUrl &&
                        issue.imageUrl !== "https://example.com" &&
                        issue.imageUrl !== "" && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              issue.imageUrl &&
                              window.open(issue.imageUrl, "_blank")
                            }
                            className="w-full gap-2 sm:w-auto"
                          >
                            <Camera className="h-4 w-4" />
                            View Image
                          </Button>
                        )}
                    </CardContent>
                  </div>
                </Card>
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </Card>
  );
}
