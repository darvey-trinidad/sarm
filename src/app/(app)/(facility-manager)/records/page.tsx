import React from "react";
import { type Metadata } from "next";
import BreadcrumbLayout from "@/components/breadcrumb/page-breadcrumb";
import RecordsTabContent from "./_components/records-tab-content";

export const metadata: Metadata = {
  title: "Records",
};

export default async function Page() {

  return (
    <div className="flex w-full flex-col space-y-4">
      <BreadcrumbLayout currentPage="Records" />

      <RecordsTabContent />
    </div>
  );
}
