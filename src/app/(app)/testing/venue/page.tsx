"use client";
import { api } from "@/trpc/react";
import { newDate } from "@/lib/utils";

/*
 ** sample code only
 */

export default function TestingPage() {
  // ito tatawagin para makuha yung session (info about currently logged in na user)
  const { data, isLoading } = api.venue.getVenueSchedule.useQuery({
    venueId: "cc749850-79c3-4b3f-bbf0-7065471d94b1",
    startDate: newDate(new Date("2025-09-01")),
    endDate: newDate(new Date("2025-09-06"))
  });

  return (
    <div>
      <div className="mt-4 text-xl">
        {
          isLoading ? "Loading..." : JSON.stringify(data)
        }
      </div>
    </div>
  );
}
