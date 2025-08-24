import React from "react";
import { type Metadata } from "next";
import BreadcrumbLayout from "@/components/breadcrumb/page-breadcrumb";
import Header from "./_components/header";
export const metadata: Metadata = {
  title: "Social Hall",
};
const SocialHall = () => {
  return (
    <div className="flex w-full flex-col space-y-4">
      <BreadcrumbLayout currentPage="Social Hall" parentPage="Schedule" />

      <Header />
    </div>
  );
};

export default SocialHall;
