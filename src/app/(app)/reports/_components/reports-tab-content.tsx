"use client";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import ReportForm from "./submit/report-form";
import ReportTable from "./reports-lists/reports-table";

export default function ReportsTabContent() {
  const [tab, setTab] = useState("submit");

  return (
    <Tabs value={tab} onValueChange={setTab}>
      <TabsList>
        <TabsTrigger value="submit">Submit Report</TabsTrigger>
        <TabsTrigger value="myReports">My Reports</TabsTrigger>
        <TabsTrigger value="allReports">All Reports</TabsTrigger>
      </TabsList>

      <div className="mt-1 w-full">
        <TabsContent value="submit" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Report a Problem</CardTitle>
              <CardDescription>
                Fill out the form below to report an issue with a room or
                facility on campus.
              </CardDescription>
              <CardContent className="px-0 pt-3">
                <ReportForm />
              </CardContent>
            </CardHeader>
          </Card>
        </TabsContent>

        <TabsContent value="myReports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>My Reports</CardTitle>
              <CardDescription>
                View and manage your submitted reports.
              </CardDescription>
              <CardContent className="px-0 pt-3">
                <ReportTable filter="my-reports" />
              </CardContent>
            </CardHeader>
          </Card>
        </TabsContent>

        <TabsContent value="allReports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>All Reports</CardTitle>
              <CardDescription>
                View and manage reports across campus.
              </CardDescription>
              <CardContent className="px-0 pt-3">
                <ReportTable filter="all-reports" />
              </CardContent>
            </CardHeader>
          </Card>
        </TabsContent>
      </div>
    </Tabs>
  );
}
