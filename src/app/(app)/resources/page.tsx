import React from "react";
import { type Metadata } from "next";
import BreadcrumbLayout from "@/components/breadcrumb/page-breadcrumb";
import ResourceContent from "./_components/resource-conent";
export const metadata: Metadata = {
  title: "Resources",
};

const Resources = () => {
  return (
    <div className="flex w-full flex-col space-y-4">
      <BreadcrumbLayout currentPage="Resources" />

      <ResourceContent />
    </div>
  );
};

export default Resources;
