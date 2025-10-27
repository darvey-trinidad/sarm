"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UserRoomRequest from "./user-room-request";
import ReceivedRoomRequest from "./received-room-request";

export default function RoomRequest() {
  const [tab, setTab] = useState("own-room-request");

  return (
    <div className="space-y-4">
      <div className="flex flex-col">
        <h2 className="text-2xl font-bold">Classroom Requests</h2>
        <p className="text-muted-foreground">
          View and manage classroom requests
        </p>
      </div>

      <Tabs value={tab} onValueChange={setTab} className="space-y-2">
        <TabsList>
          <TabsTrigger value="own-room-request">My Room Requests</TabsTrigger>
          <TabsTrigger value="received-room-request">Received Room Requests</TabsTrigger>
        </TabsList>
        <div className="mt-1 w-full">
          <TabsContent value="own-room-request">
            <div className="space-y-6">
              <UserRoomRequest />
            </div>
          </TabsContent>
          <TabsContent value="received-room-request">
            <div className="space-y-6">
              <ReceivedRoomRequest />
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
