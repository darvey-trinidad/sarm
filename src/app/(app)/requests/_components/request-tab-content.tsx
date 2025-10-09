"use client";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import VenueReservation from "./facility-manager-view/venue-reservation";
import ResourceReservation from "./facility-manager-view/resource-reservation";
import VenueReservationUser from "./user-view/venue-reservation-user";
import ResourceReservationUser from "./user-view/resource-reservation-user";
import { authClient } from "@/lib/auth-client";
import { Roles } from "@/constants/roles";
import UserRoomRequest from "./classroom-request/user-room-request";

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
            <TabsTrigger value="venue">
              <span className="hidden md:inline">Venue Request</span>
              <span className="inline md:hidden">Venue</span>
            </TabsTrigger>
            <TabsTrigger value="resource">
              <span className="hidden md:inline">Resource Request</span>
              <span className="inline md:hidden">Resource</span>
            </TabsTrigger>
            <TabsTrigger value="room-request">
              <span className="hidden md:inline">Classroom Request</span>
              <span className="inline md:hidden">Classroom</span>
            </TabsTrigger>
          </>
        ) : (
          <>
            <TabsTrigger value="venue">
              <span className="hidden md:inline">Venue Request</span>
              <span className="inline md:hidden">Venue</span>
            </TabsTrigger>
            <TabsTrigger value="resource">
              <span className="hidden md:inline">Resource Request</span>
              <span className="inline md:hidden">Resource</span>
            </TabsTrigger>
            <TabsTrigger value="room-request">
              <span className="hidden md:inline">Classroom Request</span>
              <span className="inline md:hidden">Classroom</span>
            </TabsTrigger>
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
            <TabsContent value="room-request">
              <UserRoomRequest />
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
            <TabsContent value="room-request">
              <UserRoomRequest />
            </TabsContent>
          </>
        )}
      </div>
    </Tabs>
  );
}
