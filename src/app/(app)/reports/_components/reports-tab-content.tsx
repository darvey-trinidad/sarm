"use client";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ReportForm from "./submit/report-form";
import ReportListContent from "./report-list/report-list-conent";
import ReportListUser from "./report-list/report-list-user";
export default function ReportsTabContent() {
  const [tab, setTab] = useState("submit");

  return (
    <Tabs value={tab} onValueChange={setTab} className="space-y-2">
      <TabsList>
        <TabsTrigger value="submit">Submit Report</TabsTrigger>
        <TabsTrigger value="myReports">My Reports</TabsTrigger>
        <TabsTrigger value="allReports">All Reports</TabsTrigger>
      </TabsList>

      <div className="mt-1 w-full">
        <TabsContent value="submit">
          <div className="space-y-6">
            <div className="flex flex-col">
              <h2 className="text-2xl font-bold">Report a Problem</h2>
              <p className="text-muted-foreground">
                Fill out the form below to report an issue with a room or
                facility on campus.
              </p>
            </div>
            <ReportForm />
          </div>
        </TabsContent>

        <TabsContent value="myReports" className="space-y-4">
          <ReportListUser />
        </TabsContent>

        <TabsContent value="allReports" className="space-y-4">
          <ReportListContent />
        </TabsContent>
      </div>
    </Tabs>
  );
}
