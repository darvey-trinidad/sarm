"use client";
import { api } from "@/trpc/react";
export default function UpcomingVenueReservation() {
  const { data: UpcomingVenueReservation, isLoading } =
    api.venue.getAllUpcomingVenueReservations.useQuery();
  return <div></div>;
}
