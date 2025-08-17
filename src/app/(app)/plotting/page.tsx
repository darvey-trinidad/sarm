import React from "react";
import { type Metadata } from "next";
import BreadcrumbLayout from "@/components/breadcrumb/page-breadcrumb";
import PlottingContent from "./_components/plotting-content";

export const metadata: Metadata = {
  title: "Plotting",
};

const Plotting = () => {
  return (
    <div className="flex w-full flex-col space-y-4">
      <BreadcrumbLayout currentPage="Plotting" />

      <PlottingContent />
    </div>
  );
};

export default Plotting;
