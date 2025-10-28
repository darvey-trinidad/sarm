"use client";
import { api } from "@/trpc/react";
import { useMemo, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useConfirmationDialog } from "@/components/dialog/use-confirmation-dialog";
import {
  CalendarIcon,
  Clock,
  Search,
  XCircle,
  BookOpenText,
  Users,
  DoorOpen,
  CalendarCheck,
  MapPin,
  Calendar,
  AlertCircle,
  User,
  Info,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { formatISODate, formatLocalTime, toTimeInt } from "@/lib/utils";
import { TIME_MAP } from "@/constants/timeslot";
import NoRoomRequest from "@/components/loading-state/no-room-request";
import LoadingMessage from "@/components/loading-state/loading-message";
import { Roles } from "@/constants/roles";
import { env } from "@/env";
import { PageRoutes } from "@/constants/page-routes";
export default function ReceivedRoomRequest() {
  const { data: session } = authClient.useSession();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const { showConfirmation, ConfirmationDialog } = useConfirmationDialog();

  const { mutate: cancelRoomRequestMutation } = api.classroomSchedule.cancelRoomRequest.useMutation();

  const {
    data: receivedRoomRequests,
    isLoading,
    refetch: refetchClassroomRequests,
  } = api.classroomSchedule.getRoomRequestsByResponderId.useQuery({
    responderId: session?.user.id ?? "",
  });

  const filteredClassroomRequests = useMemo(() => {
    if (!receivedRoomRequests) return [];

    const searchLower = searchTerm.toLowerCase();
    return receivedRoomRequests.filter((classroomRequest) =>
      classroomRequest.classroomName.toLowerCase().includes(searchLower),
    );
  }, [receivedRoomRequests, searchTerm]);

  const handlOpenSchedule = (requestId: string) => {
    window.open(
      `${env.NEXT_PUBLIC_APP_URL}${PageRoutes.RESPOND}/${requestId}`,
      "_blank",
    );
  };

  return (
    <div className="space-y-4">
      <div className="space-y-5">
        {/* Search Bar */}
        <div className="relative">
          <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform" />
          <Input
            id="search"
            placeholder="Search by classroom name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-xs pl-10"
          />
        </div>

        {/* Classroom Requests Card Lists */}
        <div className="grid gap-4">
          {isLoading && filteredClassroomRequests?.length === 0 ? (
            <NoRoomRequest />
          ) : isLoading ? (
            <LoadingMessage />
          ) : (
            filteredClassroomRequests?.map((request) => (
              <div key={request.id} className="w-full">
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
                          {
                            request.departmentRequestedTo && (<Badge
                              className="bg-yellow-100 text-yellow-800 border-yellow-200 flex items-center gap-1"
                            >
                              <AlertCircle className="h-4 w-4 text-yellow-600" />
                              <span>From other department</span>
                            </Badge>)
                          }
                        </div>

                        <Button
                          size="sm"
                          onClick={() => handlOpenSchedule(request.id)}
                          className="hidden sm:block"
                          disabled={(session?.user.role !== Roles.DepartmentHead && !!request.departmentRequestedTo)}
                        >
                          <div className="flex items-center gap-2">
                            <CalendarCheck className="h-4 w-4" />
                            Respond
                          </div>
                        </Button>
                      </div>
                    </CardHeader>

                    {/* Content Section */}
                    <CardContent className="p-0 space-y-1">
                      <div className="text-muted-foreground flex flex-col gap-4 pt-2 lg:flex-row">
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
                      <div className="text-muted-foreground flex flex-col gap-4 pt-2 lg:flex-row">
                        <div className="flex items-center gap-1.5">
                          <User className="h-3.5 w-3.5 text-gray-400" />
                          <span>Requested by: {request.requestorName}</span>
                        </div>
                      </div>
                      {
                        !!request.departmentRequestedTo && (
                          <div className="text-muted-foreground flex flex-col gap-4 pt-2 lg:flex-row">
                            <div className="flex items-center gap-1.5">
                              <User className="h-3.5 w-3.5 text-gray-400" />
                              <span>Requested to: {request.responderName}</span>
                            </div>
                          </div>
                        )
                      }
                      {
                        request.details && (<div className="text-muted-foreground flex flex-col gap-4 pt-2 lg:flex-row">
                          <div className="flex items-center gap-1.5">
                            <Info className="h-3.5 w-3.5 text-gray-400" />
                            <span>Details: {request.details}</span>
                          </div>
                        </div>)
                      }
                    </CardContent>
                    <div className="text-muted-foreground border-border flex border-t mt-2 pt-3 text-xs">
                      Submitted: {formatISODate(request.createdAt)} ({formatLocalTime(request.createdAt)})
                    </div>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => handlOpenSchedule(request.id)}
                    className="sm:hidden"
                    disabled={(session?.user.role !== Roles.DepartmentHead && !!request.departmentRequestedTo)}
                  >
                    Respond
                  </Button>
                </Card>
              </div>
            ))
          )}
        </div>
      </div>
      {ConfirmationDialog}
    </div>
  );
}
