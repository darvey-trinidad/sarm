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
  const [linkedBorrowingId, setLinkedBorrowingId] = useState<string | null>(null);
  const [linkedVenueId, setLinkedVenueId] = useState<string | null>(null);

  const handleShowLinkedBorrowing = (borrowingId: string) => {
    setLinkedBorrowingId(borrowingId);
    setLinkedVenueId(null); // Clear venue filter
    setTab("resource");
  };

  // Handler to switch to venue tab and filter by linked venue
  const handleShowLinkedVenue = (venueReservationId: string) => {
    setLinkedVenueId(venueReservationId);
    setLinkedBorrowingId(null); // Clear borrowing filter
    setTab("venue");
  };

  // Clear filters when manually switching tabs
  const handleTabChange = (value: string) => {
    setTab(value);
    // Clear filters when switching to a different tab manually
    if (value === "venue") {
      setLinkedBorrowingId(null);
    } else if (value === "resource") {
      setLinkedVenueId(null);
    } else {
      // Classroom tab - clear all filters
      setLinkedBorrowingId(null);
      setLinkedVenueId(null);
    }
  };

  return (
    <Tabs value={tab} onValueChange={handleTabChange} className="space-y-2">
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
            {
              (role === Roles.DepartmentHead || role === Roles.Faculty || role === Roles.PEInstructor) && (
                <TabsTrigger value="room-request">
                  <span className="hidden md:inline">Classroom Request</span>
                  <span className="inline md:hidden">Classroom</span>
                </TabsTrigger>
              )
            }
          </>
        )}
      </TabsList>

      <div className="mt-1 w-full">
        {role === Roles.FacilityManager ? (
          <>
            <TabsContent value="venue" className="space-y-4">
              <VenueReservation
                onShowLinkedBorrowing={handleShowLinkedBorrowing}
                linkedVenueId={linkedVenueId}
              />
            </TabsContent>
            <TabsContent value="resource" className="space-y-4">
              <ResourceReservation
                onShowLinkedVenue={handleShowLinkedVenue}
                linkedBorrowingId={linkedBorrowingId}
              />
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
            {
              (role === Roles.DepartmentHead || role === Roles.Faculty || role === Roles.PEInstructor) && (
                <TabsContent value="room-request">
                  <UserRoomRequest />
                </TabsContent>
              )
            }
          </>
        )}
      </div>
    </Tabs>
  );
}
