"use client";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import VenueReservation from "./venue-reservation";
import ResourceReservation from "./resource-reservation";
export default function RequestTabContent() {
  const [tab, setTab] = useState("venue");
  return (
    <Tabs value={tab} onValueChange={setTab} className="space-y-2">
      <TabsList>
        <TabsTrigger value="venue">Venue Request</TabsTrigger>
        <TabsTrigger value="resource">Resource Request</TabsTrigger>
      </TabsList>

      <div className="mt-1 w-full">
        <TabsContent value="venue" className="space-y-4">
          <VenueReservation />
        </TabsContent>
        <TabsContent value="resource" className="space-y-4">
          <ResourceReservation />
        </TabsContent>
      </div>
    </Tabs>
  );
}
