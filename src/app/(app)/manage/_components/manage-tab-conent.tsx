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
export default function ManageTabContent() {
  const [tab, setTab] = useState("resources");
  return (
    <Tabs value={tab} onValueChange={setTab}>
      <TabsList>
        <TabsTrigger value="resources">Resources</TabsTrigger>
        <TabsTrigger value="venue">Venue</TabsTrigger>
        <TabsTrigger value="buildings">Buildings</TabsTrigger>
        <TabsTrigger value="rooms">Classrooms</TabsTrigger>
      </TabsList>

      <div className="mt-1 w-full">
        <TabsContent value="resources">
          <Card>
            <CardHeader>
              <CardTitle>Resource List</CardTitle>
              <CardDescription>
                Manage facility resources and equipment
              </CardDescription>
              <CardContent className="px-0 pt-3">
                <h1 className="text-2xl font-bold">RESOURCES</h1>
              </CardContent>
            </CardHeader>
          </Card>
        </TabsContent>

        <TabsContent value="venue">
          <Card>
            <CardHeader>
              <CardTitle>Venue List</CardTitle>
              <CardDescription>
                Manage campus venues and event spaces
              </CardDescription>
              <CardContent className="px-0 pt-3">
                <h1 className="text-2xl font-bold">VENUES</h1>
              </CardContent>
            </CardHeader>
          </Card>
        </TabsContent>

        <TabsContent value="buildings">
          <Card>
            <CardHeader>
              <CardTitle>Buildings List</CardTitle>
              <CardDescription>
                Manage campus buildings and infrastructure
              </CardDescription>
              <CardContent className="px-0 pt-3">
                <BuildingManagement />
              </CardContent>
            </CardHeader>
          </Card>
        </TabsContent>

        <TabsContent value="rooms">
          <Card>
            <CardHeader>
              <CardTitle>Classrooms List</CardTitle>
              <CardDescription>
                Manage classrooms and learning spaces
              </CardDescription>
              <CardContent className="px-0 pt-3">
                <h1 className="text-2xl font-bold">CLASSROOMS</h1>
              </CardContent>
            </CardHeader>
          </Card>
        </TabsContent>
      </div>
    </Tabs>
  );
}
