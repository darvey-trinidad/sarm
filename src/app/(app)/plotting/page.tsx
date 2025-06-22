import React from "react";
import { type Metadata } from "next";
import BreadcrumbLayout from "@/components/breadcrumb/page-breadcrumb";

export const metadata: Metadata = {
  title: "Plotting",
};

const Plotting = () => {
  return (
    <div className="flex w-full flex-col space-y-4">
      <BreadcrumbLayout currentPage="Plotting" />
    </div>
  );
};

export default Plotting;
