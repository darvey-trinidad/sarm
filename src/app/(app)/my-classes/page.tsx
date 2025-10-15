import React from "react";
import { type Metadata } from "next";
import BreadcrumbLayout from "@/components/breadcrumb/page-breadcrumb";
import FacultyCalendarView from "@/components/calendar/faculty-calendar-view";

export const metadata: Metadata = {
  title: "My Classes",
};
const Page = () => {
  return (
    <div className="flex w-full flex-col space-y-4">
      <BreadcrumbLayout currentPage="My Classes" />
      <FacultyCalendarView />
    </div>
  );
};

export default Page;
