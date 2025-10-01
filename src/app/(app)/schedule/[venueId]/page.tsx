import React from "react";
import BreadcrumbLayout from "@/components/breadcrumb/page-breadcrumb";
import type { Metadata } from "next";
import { getVenueById } from "@/lib/api/classroom/query";
import VenueCalendarView from "@/components/calendar/venue-calendar-view";
import RequestReservationModal from "./_components/request-reservation";

export const metadata: Metadata = {
  title: "Venue",
};

type VenuePageProps = {
  params: Promise<{
    venueId: string;
  }>;
};

export default async function Venue({ params }: VenuePageProps) {
  const { venueId } = await params;
  const venues = await getVenueById(venueId);
  const venue = venues[0];
  return (
    <div className="flex w-full flex-col space-y-4">
      <BreadcrumbLayout
        currentPage={venue?.venueName ?? ""}
        parentPage="Schedule"
      />

      <VenueCalendarView
        venueId={venueId}
        venueName={venue?.venueName ?? ""}
        venueCapacity={venue?.venueCapacity ?? 0}
      />

      <div className="flex justify-end">
        <RequestReservationModal venueId={venueId} />
      </div>
    </div>
  );
}
