"use client";
import { api } from "@/trpc/react";
import { newDate } from "@/lib/utils";

/*
 ** sample code only
 */


export default function TestingPage() {

  const { data: data2, isLoading: isLoading2 } = api.venue.getAllVenueReservations.useQuery({
    startDate: newDate(new Date("2025-09-26")),
    endDate: newDate(new Date("2025-09-30"))

  });

  return (
    <div>
      <div className="mt-4 text-s">
        {
          isLoading2 ? "Loading..." : JSON.stringify(data2)

        }
      </div>
    </div>
  );
}
