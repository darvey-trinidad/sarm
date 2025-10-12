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
export default function RecentRepotedIssues() {
  const { data: recentFacilityIssues, isLoading } =
    api.facilityIssue.getRecentFacilityIssueReports.useQuery();

  return (
    <Card className="w-full p-6">
      <h3 className="text-md font-semibold">Recent Repoted Issues</h3>

      <div className="space-y-4">
        {isLoading ? (
          <CurrentScheduleSkeleton />
        ) : recentFacilityIssues?.length === 0 ? (
          <div>No recent reported issues</div>
        ) : (
          recentFacilityIssues?.map((issue) => (
            <div key={issue.id} className="flex flex-col">
              <Card className="border-none bg-stone-50 shadow-none">
                <CardHeader>
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
                    <Badge
                      className={`text-xs ${getStatusColor(issue.status)}`}
                    >
                      {issue.status}
                    </Badge>
                  </div>
                </CardHeader>
              </Card>
            </div>
          ))
        )}
      </div>
    </Card>
  );
}
