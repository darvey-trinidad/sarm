import React from "react";
import { type Metadata } from "next";
import BreadcrumbLayout from "@/components/breadcrumb/page-breadcrumb";
import RequestTabContent from "./_components/request-tab-content";
export const metadata: Metadata = {
  title: "Requests",
};

const Requests = () => {
  return (
    <div className="flex w-full flex-col space-y-4">
      <BreadcrumbLayout currentPage="Requests" />

      <RequestTabContent />
    </div>
  );
};

export default Requests;
