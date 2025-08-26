import React from "react";
import { type Metadata } from "next";
import BreadcrumbLayout from "@/components/breadcrumb/page-breadcrumb";
import BuildingDirectory from "./_components/building-directory";

export const metadata: Metadata = {
  title: "Classroom",
};

const Classroom = () => {
  return (
    <div className="flex w-full flex-col space-y-5">
      <BreadcrumbLayout currentPage="Buildings" parentPage="Schedule" />

      <BuildingDirectory />
    </div>
  );
};

export default Classroom;
