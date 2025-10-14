"use client";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BuildingTable from "./buildings/building-list/building-table";
import BuildingFormButton from "./buildings/submit/building-form-button";
import RoomTable from "./rooms/room-list/room-table";
import RoomFormButton from "./rooms/submit/room-form-button";
import ResourceTable from "./resources/resource-list/resource-table";
import ResourceFormButton from "./resources/submit/resource-form-button";
import VenueTable from "./venue/venue-list/venue-table";
import VenueFormButton from "./venue/submit/venue-form-button";
import ResetRoomSchedule from "./classroom-schedule/reset-room-schedule";
export default function ManageTabContent() {
  const [tab, setTab] = useState("resources");
  return (
    <Tabs value={tab} onValueChange={setTab} className="space-y-2">
      <TabsList>
        <TabsTrigger value="resources">Resources</TabsTrigger>
        <TabsTrigger value="venue">Venue</TabsTrigger>
        <TabsTrigger value="buildings">Buildings</TabsTrigger>
        <TabsTrigger value="rooms">Classrooms</TabsTrigger>
        <TabsTrigger value="room-schedule">Classroom Schedule</TabsTrigger>
      </TabsList>

      <div className="mt-1 w-full">
        <TabsContent value="resources">
          <div className="space-y-4">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Resources</h2>
              <p className="text-muted-foreground">Manage campus recources</p>
            </div>
            <ResourceTable />
          </div>
          <div className="flex justify-end">
            <ResourceFormButton />
          </div>
        </TabsContent>

        <TabsContent value="venue">
          <div className="space-y-4">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Venue</h2>
              <p className="text-muted-foreground">
                Manage campus Venues and facilities
              </p>
            </div>
            <VenueTable />
            <div className="flex justify-end">
              <VenueFormButton />
            </div>
            <button className="sr-only">hidden focus trap</button>
          </div>
        </TabsContent>

        <TabsContent value="buildings">
          <div className="space-y-4">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Buildings</h2>
              <p className="text-muted-foreground">
                Manage campus buildings and facilities
              </p>
            </div>
            <BuildingTable />
            <div className="flex justify-end">
              <BuildingFormButton />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="rooms">
          <div className="space-y-4">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Classrooms</h2>
              <p className="text-muted-foreground">
                Manage campus classrooms and learning facilities
              </p>
            </div>
            <RoomTable />
            <div className="flex justify-end">
              <RoomFormButton />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="room-schedule">
          <div className="space-y-4">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">
                Classroom Schedule
              </h2>
              <p className="text-muted-foreground">
                Reset classroom schedule for the semester
              </p>
            </div>
            <ResetRoomSchedule />
          </div>
        </TabsContent>
      </div>
    </Tabs>
  );
}
