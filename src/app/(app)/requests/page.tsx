import React from "react";
import { type Metadata } from "next";
import BreadcrumbLayout from "@/components/breadcrumb/page-breadcrumb";
import VenueReservation from "./_components/venue-reservation";
export const metadata: Metadata = {
  title: "Requests",
};

const Requests = () => {
  return (
    <div className="flex w-full flex-col space-y-4">
      <BreadcrumbLayout currentPage="Requests" />

      <VenueReservation />
    </div>
  );
};

export default Requests;
