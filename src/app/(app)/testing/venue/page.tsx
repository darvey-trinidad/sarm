"use client";
import { api } from "@/trpc/react";
import { newDate } from "@/lib/utils";

/*
 ** sample code only
 */

export default function TestingPage() {
  // ito tatawagin para makuha yung session (info about currently logged in na user)
  const { data, isLoading } = api.venue.getVenueSchedule.useQuery({
    venueId: "75312178-384e-4a68-8ced-5876de1b76f4",
    startDate: newDate(new Date("2025-09-15")),
    endDate: newDate(new Date("2025-09-20"))
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
