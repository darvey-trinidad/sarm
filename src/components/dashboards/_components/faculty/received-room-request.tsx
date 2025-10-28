"use client";
import { api } from "@/trpc/react";
import { authClient } from "@/lib/auth-client";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DoorOpen,
  Clock,
  MapPin,
  Calendar,
  Users,
  CalendarCheck,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ReceivedRoomSkeleton } from "../skeletons/received-room-skeleton";
import { checkIsPastRequest, formatISODate, formatLocalTime, toTimeInt } from "@/lib/utils";
import { TIME_MAP } from "@/constants/timeslot";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { PageRoutes } from "@/constants/page-routes";
import { NoRoomRequest } from "../no-data-mesage/dahsboard-nothing-found";
import { Roles } from "@/constants/roles";
import { RoomRequestStatusValues } from "@/constants/room-request-status";
export default function ReceivedRoomRequest() {
  const { data: session } = authClient.useSession();
  const { data: ReceivedRoomRequest, isLoading } =
    api.classroomSchedule.getRoomRequestsByResponderId.useQuery(
      {
        responderId: session?.user.id ?? "",
      },
      {
        enabled: !!session?.user.id,
      },
    );

  const handlOpenSchedule = (requestId: string) => {
    window.open(
      `${process.env.NEXT_PUBLIC_APP_URL}${PageRoutes.RESPOND}/${requestId}`,
      "_blank",
    );
  };
  return (
    <Card className="w-full p-6 sm:w-[800px]">
      <CardTitle className="text-md font-semibold">Room Request</CardTitle>

      <ScrollArea className="h-[330px]">
        <div className="space-y-4">
          {isLoading ? (
            <ReceivedRoomSkeleton />
          ) : ReceivedRoomRequest?.length === 0 ? (
            <NoRoomRequest />
          ) : (
            ReceivedRoomRequest?.map((request) => (
              <div key={request.id}
                className={`w-full ${checkIsPastRequest(request.date, request.endTime) || request.status !== RoomRequestStatusValues.Pending
                  ? "hidden"
                  : ""
                  }`}
              >
                <Card className="border-none bg-stone-50 p-6 shadow-none">
                  <div className="flex flex-col gap-2">
                    <CardHeader className="p-0">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="border-primary/30 bg-primary/10 flex h-10 w-10 items-center justify-center rounded-lg border">
                            <DoorOpen className="text-primary h-5 w-5" />
                          </div>
                          <CardTitle className="text-md">
                            {request.requestorName}
                          </CardTitle>
                          <Badge
                            className="bg-yellow-100 text-yellow-800 border-yellow-200 flex items-center gap-1"
                          >
                            {request.status.charAt(0).toUpperCase() +
                              request.status.slice(1)}
                          </Badge>
                        </div>

                        <Button
                          size="sm"
                          onClick={() => handlOpenSchedule(request.id)}
                          className="hidden sm:block"
                          disabled={checkIsPastRequest(request.date, request.endTime)
                            || (session?.user.role !== Roles.DepartmentHead && !!request.departmentRequestedTo)
                            || request.status !== RoomRequestStatusValues.Pending}
                        >
                          <div className="flex items-center gap-2">
                            <CalendarCheck className="h-4 w-4" />
                            Respond
                          </div>
                        </Button>
                      </div>
                    </CardHeader>

                    {/* Content Section */}
                    <CardContent className="p-0">
                      <div className="grid grid-cols-1 gap-2 text-sm text-gray-600 md:grid-cols-2">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5 text-gray-400" />
                          <span>{formatISODate(request.date)}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Clock className="h-3.5 w-3.5 text-gray-400" />
                          <span>
                            {`${TIME_MAP[toTimeInt(request.startTime)]}`} -{" "}
                            {`${TIME_MAP[toTimeInt(request.endTime)]}`}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <MapPin className="h-3.5 w-3.5 text-gray-400" />
                          Room<span>{request.classroomName}</span>
                        </div>
                        {request.section && (
                          <div className="flex items-center gap-1.5">
                            <Users className="h-3.5 w-3.5 text-gray-400" />
                            <span>{request.section}</span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                    <div className="text-muted-foreground border-border flex border-t mt-2 pt-3 text-xs">
                      Submitted: {formatISODate(request.createdAt)} ({formatLocalTime(request.createdAt)})
                    </div>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => handlOpenSchedule(request.id)}
                    className="sm:hidden"
                    disabled={checkIsPastRequest(request.date, request.endTime)
                      || (session?.user.role !== Roles.DepartmentHead && !!request.departmentRequestedTo)
                      || request.status !== RoomRequestStatusValues.Pending}
                  >
                    Respond
                  </Button>
                </Card>
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </Card>
  );
}
