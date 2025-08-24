import React from "react";
import { type Metadata } from "next";
import BreadcrumbLayout from "@/components/breadcrumb/page-breadcrumb";
import Header from "./_components/header";
export const metadata: Metadata = {
  title: "Activity Center",
};

const Classroom = () => {
  return (
    <div className="flex w-full flex-col space-y-4">
      <BreadcrumbLayout currentPage="Activity Center" parentPage="Schedule" />

      <Header />
    </div>
  );
};

export default Classroom;
