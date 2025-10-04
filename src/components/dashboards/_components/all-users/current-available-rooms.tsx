"use client";

import { api } from "@/trpc/react";
import { newDate, getCurrentNearestBlock, toTimeInt } from "@/lib/utils";
import { TIME_MAP } from "@/constants/timeslot";
import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AvailableRoomSkeleton from "./available-room-skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PageRoutes } from "@/constants/page-routes";
import type { ClassroomType } from "@/constants/classroom-type";
import {
  MapPin,
  Building,
  ExternalLink,
  Book,
  Microscope,
  Users,
  Clock,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function CurrentAvailableRooms() {
  const [currentBuildingIndex, setCurrentBuildingIndex] = useState(0);

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

  const handlePrevious = () => {
    setCurrentBuildingIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    if (availableRooms) {
      setCurrentBuildingIndex((prev) =>
        Math.min(availableRooms.length - 1, prev + 1),
      );
    }
  };

  const currentBuilding = availableRooms?.[currentBuildingIndex];

  return (
    <div className="rounded-xl border border-gray-300 p-6">
      <h2 className="text-2xl font-bold">Available Classroom</h2>

      <div>
        {isLoading ? (
          <AvailableRoomSkeleton />
        ) : availableRooms && availableRooms.length > 0 ? (
          <div className="space-y-4">
            {currentBuilding && (
              <Card className="gap-2 border-none shadow-none">
                <CardHeader className="px-0">
                  <div className="flex w-full flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                    <div className="item-center flex w-full flex-row justify-between gap-4 sm:w-auto">
                      <CardTitle className="flex items-center gap-2 text-xl">
                        <Building className="h-5 w-5" />
                        {currentBuilding.buildingName}
                      </CardTitle>
                      <Badge variant="outline" className="text-sm">
                        {currentBuilding.classrooms.length} available
                      </Badge>
                    </div>
                    <div className="flex gap-2">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handlePrevious}
                          disabled={currentBuildingIndex === 0}
                        >
                          <ChevronLeft className="mr-1 h-4 w-4" />
                          Previous
                        </Button>

                        <div className="bg-muted rounded-md px-3 py-1 text-center text-xs font-medium sm:text-sm">
                          <span className="sm:hidden">
                            {currentBuildingIndex + 1}
                          </span>

                          <span className="hidden sm:inline">
                            {currentBuildingIndex + 1} of{" "}
                            {availableRooms.length}
                          </span>
                        </div>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleNext}
                          disabled={
                            currentBuildingIndex === availableRooms.length - 1
                          }
                        >
                          Next
                          <ChevronRight className="ml-1 h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="px-0">
                  <ScrollArea className="h-[400px] w-full">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {currentBuilding.classrooms.map((classroom) => (
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
                                  className={`${getTypeColor(classroom.type as ClassroomType)} flex items-center gap-1`}
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
                                <div className="flex items-center gap-2">
                                  <Clock className="h-4 w-4" />
                                  <span>
                                    Available Until:{" "}
                                    {`${TIME_MAP[toTimeInt(classroom.availableUntil)]}`}
                                  </span>
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
                  </ScrollArea>
                </CardContent>
              </Card>
            )}
          </div>
        ) : (
          <div className="text-muted-foreground py-8 text-center">
            No available classrooms at this time
          </div>
        )}
      </div>
    </div>
  );
}
