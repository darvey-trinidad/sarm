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
export default function ManageTabContent() {
  const [tab, setTab] = useState("resources");
  return (
    <Tabs value={tab} onValueChange={setTab} className="space-y-2">
      <TabsList>
        <TabsTrigger value="resources">Resources</TabsTrigger>
        <TabsTrigger value="venue">Venue</TabsTrigger>
        <TabsTrigger value="buildings">Buildings</TabsTrigger>
        <TabsTrigger value="rooms">Classrooms</TabsTrigger>
      </TabsList>

      <div className="mt-1 w-full">
        <TabsContent value="resources">
          <div className="space-y-4">
            <div className="flex flex-col justify-between space-y-4 sm:w-full sm:flex-row">
              <div>
                <h2 className="text-2xl font-bold tracking-tight">Resources</h2>
                <p className="text-muted-foreground">Manage campus recources</p>
              </div>
              <div>
                <ResourceFormButton />
              </div>
            </div>
            <ResourceTable />
          </div>
        </TabsContent>

        <TabsContent value="venue">
          <div className="space-y-4">
            <div className="flex flex-col justify-between space-y-4 sm:w-full sm:flex-row">
              <div>
                <h2 className="text-2xl font-bold tracking-tight">Venue</h2>
                <p className="text-muted-foreground">
                  Manage campus Venues and facilities
                </p>
              </div>
              <div>
                <VenueFormButton />
              </div>
            </div>
            <VenueTable />

            <button className="sr-only">hidden focus trap</button>
          </div>
        </TabsContent>

        <TabsContent value="buildings">
          <div className="space-y-4">
            <div className="flex flex-col justify-between space-y-4 sm:w-full sm:flex-row">
              <div>
                <h2 className="text-2xl font-bold tracking-tight">Buildings</h2>
                <p className="text-muted-foreground">
                  Manage campus buildings and facilities
                </p>
              </div>
              <div>
                <BuildingFormButton />
              </div>
            </div>
            <BuildingTable />
          </div>
        </TabsContent>

        <TabsContent value="rooms">
          <div className="space-y-4">
            <div className="flex flex-col justify-between space-y-4 sm:w-full sm:flex-row">
              <div>
                <h2 className="text-2xl font-bold tracking-tight">
                  Classrooms
                </h2>
                <p className="text-muted-foreground">
                  Manage campus classrooms and learning facilities
                </p>
              </div>
              <div>
                <RoomFormButton />
              </div>
            </div>
            <RoomTable />
          </div>
        </TabsContent>
      </div>
    </Tabs>
  );
}
