"use client";
import { api } from "@/trpc/react";
import { newDate } from "@/lib/utils";

/*
 ** sample code only
 */

export default function TestingPage() {
  // ito tatawagin para makuha yung session (info about currently logged in na user)
  const { data, isLoading } = api.classroomSchedule.getWeeklyInitialClassroomSchedule.useQuery({ classroomId: "b0bd0bcb-bd4e-4867-920c-5ba2d4964543" });

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
