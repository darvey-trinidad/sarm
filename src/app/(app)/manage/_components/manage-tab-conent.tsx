"use client";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import BuildingManagement from "./buildings/page";
import BuildingFormButton from "./buildings/submit/building-form-button";
import RoomManagement from "./rooms/page";
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
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold tracking-tight">Resources</h2>
                <p className="text-muted-foreground">
                  Manage campus buildings and facilities
                </p>
              </div>
            </div>
            <h1>resources</h1>
          </div>
        </TabsContent>

        <TabsContent value="venue">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold tracking-tight">Venue</h2>
                <p className="text-muted-foreground">
                  Manage campus buildings and facilities
                </p>
              </div>
            </div>
            <h1>venue</h1>
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
            <BuildingManagement />
          </div>
        </TabsContent>

        <TabsContent value="rooms">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold tracking-tight">
                  Classrooms
                </h2>
                <p className="text-muted-foreground">
                  Manage campus buildings and facilities
                </p>
              </div>
            </div>
            <RoomManagement />
          </div>
        </TabsContent>
      </div>
    </Tabs>
  );
}
