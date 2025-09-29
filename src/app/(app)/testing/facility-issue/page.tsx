"use client";
import React from 'react'
import { api } from '@/trpc/react'
import { newDate } from '@/lib/utils';
const page = () => {
  const { data } = api.facilityIssue.getAllFacilityIssueReports.useQuery({
    // startDate: newDate(new Date("2025-09-01")),
    // endDate: newDate(new Date("2025-09-30"))
    //status: "reported"
  });

  return (
    <div>
      <div className="mt-4 text-sm">
        {
          data?.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl border p-4 shadow-sm bg-white"
            >
              {JSON.stringify(item)}
            </div>
          ))
        }
      </div>
    </div>
  )
}

export default page