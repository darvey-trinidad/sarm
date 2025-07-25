import React from "react";
import { type Metadata } from "next";
import BreadcrumbLayout from "@/components/breadcrumb/page-breadcrumb";
import ReportCards from "./_components/report-status";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ReportsTabContent from "./_components/reports-tab-content";

export const metadata: Metadata = {
  title: "Reports",
};

const Reports = () => {
  return (
    <div className="flex w-full flex-col space-y-4">
      <BreadcrumbLayout currentPage="Reports" />

      <ReportCards />
      <ReportsTabContent />
    </div>
  );
};

export default Reports;
