"use client";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function ReportsTabContent() {
  const [tab, setTab] = useState("submit");

  return (
    <Tabs value={tab} onValueChange={setTab}>
      <TabsList>
        <TabsTrigger value="submit">Submit Report</TabsTrigger>
        <TabsTrigger value="myReports">My Reports</TabsTrigger>
        <TabsTrigger value="allReports">All Reports</TabsTrigger>
      </TabsList>

      <TabsContent value="submit" className="space-y-4">
        Submit Report
      </TabsContent>

      <TabsContent value="myReports" className="space-y-4">
        My Reports
      </TabsContent>

      <TabsContent value="allReports" className="space-y-4">
        All Reports
      </TabsContent>
    </Tabs>
  );
}
