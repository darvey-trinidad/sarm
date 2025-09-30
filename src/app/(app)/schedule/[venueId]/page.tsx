import React from "react";
import BreadcrumbLayout from "@/components/breadcrumb/page-breadcrumb";
import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { getVenueById } from "@/lib/api/classroom/query";
import VenueCalendarView from "@/components/calendar/venue-calendar-view";
import RequestReservationModal from "./_components/request-reservation";

export const metadata: Metadata = {
  title: "Venue",
};

type VenuePageProps = {
  params: {
    venueId: string;
  };
};
export default async function Venue({ params }: VenuePageProps) {
  const { venueId } = params;
  const venues = await getVenueById(venueId);
  const venue = venues[0];
  return (
    <div className="flex w-full flex-col space-y-4">
      <BreadcrumbLayout
        currentPage={venue?.venueName ?? ""}
        parentPage="Schedule"
      />
      <div className="items-center justify-between gap-4">
        <div className="flex flex-col items-start gap-4 md:flex-row md:items-center">
          <Link href="/schedule">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center bg-transparent"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div className="flex flex-col justify-between space-y-4 sm:w-full sm:flex-row">
            <div className="flex-1">
              <h1 className="text-3xl font-bold tracking-tight">
                {venue?.venueName}
              </h1>
              <p className="text-muted-foreground">
                Capacity - <strong>({venue?.venueCapacity})</strong>
              </p>
            </div>

            <RequestReservationModal venueId={venueId} />
          </div>
        </div>
      </div>
      <VenueCalendarView venueId={venueId} />
    </div>
  );
}
