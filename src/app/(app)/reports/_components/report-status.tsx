"use client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { CircleAlert, TriangleAlert, CircleCheckBig } from "lucide-react";
import { Roles } from "@/constants/roles";
import { api } from "@/trpc/react";

type ReportCardsProps = {
  role: string;
};

export default function reportCards({ role }: ReportCardsProps) {
  const { data: reportsCounts, isLoading } = api.facilityIssue.getFacilityIssueReportsCounts.useQuery();

  const {
    unresolvedCount,
    ongoingCount,
    resolvedCount,
  } = reportsCounts ?? {
    unresolvedCount: 0,
    ongoingCount: 0,
    resolvedCount: 0
  }

  if (role !== Roles.FacilityManager) {
    return null;
  }
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      {/* Pending */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xl font-bold">Unresolved</CardTitle>
          <CircleAlert className="h-5 w-5 text-red-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{unresolvedCount}</div>
        </CardContent>
      </Card>

      {/* On Going */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xl font-bold">Ongoing</CardTitle>
          <TriangleAlert className="h-5 w-5 text-orange-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{ongoingCount}</div>
        </CardContent>
      </Card>

      {/* Completed */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xl font-bold">Resolved</CardTitle>
          <CircleCheckBig className="h-5 w-5 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{resolvedCount}</div>
        </CardContent>
      </Card>
    </div>
  );
}
