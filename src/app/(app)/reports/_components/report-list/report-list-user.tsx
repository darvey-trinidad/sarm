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
              <CardContent className="p-6"></CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
