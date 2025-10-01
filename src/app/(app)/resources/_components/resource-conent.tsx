"use client";
import { useState } from "react";
import ResourceTable from "./resource-table/resource-table";
import RequestResourcesDialog from "./request-rersource-button/request-resources";
import { newDate } from "@/lib/utils";
export default function ResourceContent() {
  const [requestedDate, setRequestedDate] = useState<Date | null>(newDate(new Date()));
  const [requestedStartTime, setRequestedStartTime] = useState<string>("700");
  const [requestedEndTime, setRequestedEndTime] = useState<string>("2000");
  return (
    <div className="space-y-4">
      <div className="flex flex-col justify-between space-y-4 sm:flex-row">
        <div className="flex flex-col">
          <h2 className="text-2xl font-bold">Resources Reservation</h2>
          <p className="text-muted-foreground">
            Request for resources to be reserved
          </p>
        </div>
        <RequestResourcesDialog
          requestedDate={requestedDate}
          requestedStartTime={requestedStartTime}
          requestedEndTime={requestedEndTime}
        />
      </div>
      <ResourceTable
        requestedDate={requestedDate}
        setRequestedDate={setRequestedDate}
        requestedStartTime={requestedStartTime}
        setRequestedStartTime={setRequestedStartTime}
        requestedEndTime={requestedEndTime}
        setRequestedEndTime={setRequestedEndTime}
      />
    </div>
  );
}
