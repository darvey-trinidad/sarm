"use client";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BorrowingRecords from "./borrowing-records";
import VenueReservationRecords from "./venue-reservation-records";

export default function RecordsTabContent() {
  const [tab, setTab] = useState("venue");

  return (
    <Tabs value={tab} onValueChange={setTab} className="space-y-2">
      <TabsList>
        <TabsTrigger value="venue">Venue</TabsTrigger>
        <TabsTrigger value="resource">Resource</TabsTrigger>
      </TabsList>

      <div className="mt-1 w-full">
        <TabsContent value="venue">
          <div className="space-y-6">
            <div className="flex flex-col">
              <h2 className="text-2xl font-bold">Venue Reservation Records</h2>
              <p className="text-muted-foreground">
                Download your venue reservation records
              </p>
            </div>
            <VenueReservationRecords />
          </div>
        </TabsContent>
        <TabsContent value="resource">
          <div className="space-y-6">
            <div className="flex flex-col">
              <h2 className="text-2xl font-bold">Resource Borrowing Records</h2>
              <p className="text-muted-foreground">
                Download your resource borrowing records
              </p>
            </div>
            <BorrowingRecords />
          </div>
        </TabsContent>
      </div>
    </Tabs>
  );
}
