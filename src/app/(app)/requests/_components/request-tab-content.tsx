"use client";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import VenueReservation from "./facility-manager-view/venue-reservation";
import ResourceReservation from "./facility-manager-view/resource-reservation";
import VenueReservationUser from "./user-view/venue-reservation-user";
import ResourceReservationUser from "./user-view/resource-reservation-user";
import { authClient } from "@/lib/auth-client";
import { Roles } from "@/constants/roles";

type RequestTabContentProps = {
  role: string;
};
export default function RequestTabContent({ role }: RequestTabContentProps) {
  const [tab, setTab] = useState("venue");
  return (
    <Tabs value={tab} onValueChange={setTab} className="space-y-2">
      <TabsList>
        {role === Roles.FacilityManager ? (
          <>
            <TabsTrigger value="venue">Venue Request</TabsTrigger>
            <TabsTrigger value="resource">Resource Request</TabsTrigger>
          </>
        ) : (
          <>
            <TabsTrigger value="venue">Venue Request</TabsTrigger>
            <TabsTrigger value="resource">Resource Request</TabsTrigger>
          </>
        )}
      </TabsList>

      <div className="mt-1 w-full">
        {role === Roles.FacilityManager ? (
          <>
            <TabsContent value="venue" className="space-y-4">
              <VenueReservation />
            </TabsContent>
            <TabsContent value="resource" className="space-y-4">
              <ResourceReservation />
            </TabsContent>
          </>
        ) : (
          <>
            <TabsContent value="venue" className="space-y-4">
              <VenueReservationUser />
            </TabsContent>
            <TabsContent value="resource" className="space-y-4">
              <ResourceReservationUser />
            </TabsContent>
          </>
        )}
      </div>
    </Tabs>
  );
}
