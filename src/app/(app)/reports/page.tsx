import React from "react";
import { type Metadata } from "next";
import BreadcrumbLayout from "@/components/breadcrumb/page-breadcrumb";
import ReportCards from "./_components/report-status";

export const metadata: Metadata = {
  title: "Reports",
};

const Reports = () => {
  return (
    <div className="flex w-full flex-col space-y-4">
      <BreadcrumbLayout currentPage="Reports" />

      <ReportCards />
    </div>
  );
};

export default Reports;
