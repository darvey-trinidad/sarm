"use client";
import { api } from "@/trpc/react";
import { newDate, getCurrentNearestBlock } from "@/lib/utils";
import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AvailableRoomSkeleton from "./available-room-skeleton";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { PageRoutes } from "@/constants/page-routes";
import { type ClassroomType } from "@/constants/classroom-type";
import {
  MapPin,
  Building,
  ExternalLink,
  Book,
  Microscope,
  Users,
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
export default function CurrentAvailableRooms() {
  // compute query params only once when component mounts
  const queryParams = useMemo(() => {
    const now = new Date();
    return {
      startBlock: getCurrentNearestBlock(now).toString(),
      date: newDate(now),
    };
  }, []);

  const { data: availableRooms, isLoading } =
    api.classroomSchedule.getCurrentlyAvailableClassrooms.useQuery(queryParams);

  const getTypeColor = (type: ClassroomType) => {
    switch (type) {
      case "lecture":
        return "bg-yellow-50 text-yellow-700 border-yellow-200";
      case "laboratory":
        return "bg-blue-50 text-blue-700 border-blue-200";
    }
  };

  const getTypeIcon = (type: ClassroomType) => {
    switch (type) {
      case "lecture":
        return <Book className="h-4 w-4 text-yellow-600" />;
      case "laboratory":
        return <Microscope className="h-4 w-4 text-blue-600" />;
    }
  };

  const handleOpenClassroom = (classRoomId: string) => {
    window.open(
      `${process.env.NEXT_PUBLIC_APP_URL}${PageRoutes.SCHEDULE_CLASSROOM}/${classRoomId}`,
      "_blank",
    );
  };

  return (
    <div className="lg:grid-row-5 grid rounded-md border border-gray-200 p-4">
      <div className="px-4">
        <h2 className="text-2xl font-bold">Available Classroom</h2>
        <p className="text-muted-foreground">
          Currently Available Classroom Today
        </p>
      </div>
      <div className="mt-2">
        {isLoading ? (
          <AvailableRoomSkeleton />
        ) : (
          <ScrollArea className="h-[400px] w-full">
            {availableRooms?.map((building) => (
              <div key={building.buildingId}>
                <Card
                  key={building.buildingId}
                  className="border-none shadow-none"
                >
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2 text-xl">
                        <Building className="h-5 w-5" />
                        {building.buildingName}
                      </CardTitle>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-sm">
                          {building.classrooms.length} available
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {building.classrooms.map((classroom) => (
                        <Card
                          key={classroom.classroomId}
                          className="border-border transition-shadow hover:shadow-md"
                        >
                          <CardContent className="p-4">
                            <div className="space-y-3">
                              {/* Header */}
                              <div className="flex items-center justify-between">
                                <h3 className="text-foreground text-lg font-semibold">
                                  Room {classroom.classroomName}
                                </h3>
                                <Badge
                                  className={`${getTypeColor(
                                    classroom.type as ClassroomType,
                                  )} flex items-center gap-1`}
                                >
                                  {getTypeIcon(classroom.type as ClassroomType)}
                                  {classroom.type.charAt(0).toUpperCase() +
                                    classroom.type.slice(1)}
                                </Badge>
                              </div>

                              {/* Details */}
                              <div className="text-muted-foreground space-y-2 text-sm">
                                <div className="flex items-center gap-2">
                                  <Users className="h-4 w-4" />
                                  <span>
                                    Capacity: {classroom.capacity} people
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <MapPin className="h-4 w-4" />
                                  <span>Floor: {classroom.floor}</span>
                                </div>
                              </div>

                              {/* Action */}
                              <div className="border-border border-t pt-2">
                                <Button
                                  className="w-full"
                                  size="sm"
                                  onClick={() =>
                                    handleOpenClassroom(classroom.classroomId)
                                  }
                                >
                                  <ExternalLink className="mr-1 h-4 w-4" /> Open
                                  Classroom
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                <Separator className="my-4" />
              </div>
            ))}
          </ScrollArea>
        )}
      </div>
    </div>
  );
}
