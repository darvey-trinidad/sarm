import React from "react";
import { type Metadata } from "next";
import BreadcrumbLayout from "@/components/breadcrumb/page-breadcrumb";
import Header from "./_components/request/room-request";
import BuildingDirectory from "./_components/building-directory";

export const metadata: Metadata = {
  title: "Classroom",
};

const Classroom = () => {
  return (
    <div className="flex w-full flex-col space-y-4">
      <BreadcrumbLayout currentPage="Classroom" parentPage="Schedule" />

      <Header />
      <BuildingDirectory />
    </div>
  );
};

export default Classroom;
