import React from "react";
import { type Metadata } from "next";
import BreadcrumbLayout from "@/components/breadcrumb/page-breadcrumb";
import ManageTabContent from "./_components/manage-tab-conent";
export const metadata: Metadata = {
  title: "Manage",
};

const Manage = () => {
  return (
    <div className="flex w-full flex-col space-y-4">
      <BreadcrumbLayout currentPage="Manage" />

      <ManageTabContent />
    </div>
  );
};

export default Manage;
