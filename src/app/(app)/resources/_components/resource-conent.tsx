"use client";
import { useState } from "react";
import ResourceTable from "./resource-table/resource-table";
import RequestResourcesDialog from "./request-rersource-button/request-resources";
export default function ResourceContent() {
  const [requestedDate, setRequestedDate] = useState<Date | null>(null);
  const [requestedStartTime, setRequestedStartTime] = useState<string>("");
  const [requestedEndTime, setRequestedEndTime] = useState<string>("");
  return (
    <div className="space-y-4">
      <div className="flex flex-col justify-between space-y-4 sm:flex-row">
        <div className="flex flex-col">
          <h2 className="text-2xl font-bold">Venue Request</h2>
          <p className="text-muted-foreground">
            Review and manage venue reservations
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
