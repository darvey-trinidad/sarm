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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  getStatusColorRoomRequest,
  getStatusIconRoomRequest,
} from "../user-view/request-status";
import { formatISODate, formatLocalTime, toTimeInt } from "@/lib/utils";
import { TIME_MAP } from "@/constants/timeslot";
import { RoomRequestStatus } from "@/constants/room-request-status";
import NoRoomRequest from "@/components/loading-state/no-room-request";
import LoadingMessage from "@/components/loading-state/loading-message";
import { toast } from "sonner";
export default function UserRoomRequest() {
  const { data: session } = authClient.useSession();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const { showConfirmation, ConfirmationDialog } = useConfirmationDialog();

  const { mutate: cancelRoomRequestMutation } = api.classroomSchedule.cancelRoomRequest.useMutation();

  const {
    data: userRoomRequests,
    isLoading,
    refetch: refetchClassroomRequests,
  } = api.classroomSchedule.getRoomRequestsByRequestorId.useQuery({
    requestorId: session?.user.id ?? "",
  });

  const filteredClassroomRequests = useMemo(() => {
    if (!userRoomRequests) return [];

    const searchLower = searchTerm.toLowerCase();
    return userRoomRequests.filter((classroomRequest) =>
      classroomRequest.classroomName.toLowerCase().includes(searchLower),
    );
  }, [userRoomRequests, searchTerm]);

  const handleCancel = (roomRequestId: string) => {
    showConfirmation({
      title: "Cancel Room Request",
      description: "Are you sure you want to cancel this room request?",
      variant: "destructive",
      confirmText: "Confirm",
      cancelText: "Cancel",
      onConfirm: () => {
        return new Promise<void>((resolve) => {
          cancelRoomRequestMutation(
            { roomRequestId },
            {
              onSuccess: async () => {
                await refetchClassroomRequests();
                toast.success("Room request canceled!");
                resolve();
              },
              onError: (error) => {
                toast.error(error.message);
                resolve();
              },
            },
          );
        });
      },
    });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-5">
        <div className="flex flex-col">
          <h2 className="text-2xl font-bold">Classroom Requests</h2>
          <p className="text-muted-foreground">
            View and manage your classroom requests
          </p>
        </div>

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
            filteredClassroomRequests?.map((classroomRequest) => (
              <Card key={classroomRequest.id}>
                <CardContent className="p-4">
                  <div className="mb-4 flex flex-col items-start justify-between gap-2 lg:flex-row">
                    <div className="flex items-start gap-4">
                      <div className="flex-1">
                        <div className="flex flex-col gap-2 md:flex-row">
                          <h3 className="text-medium font-semibold text-gray-800">
                            Room {classroomRequest.classroomName}
                          </h3>

                          <Badge
                            className={`${getStatusColorRoomRequest(classroomRequest.status)} flex items-center gap-1`}
                          >
                            {getStatusIconRoomRequest(classroomRequest.status)}
                            {classroomRequest.status.charAt(0).toUpperCase() +
                              classroomRequest.status.slice(1)}
                          </Badge>
                        </div>

                        <div className="text-muted-foreground flex flex-col gap-4 pt-2 lg:flex-row">
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4" />
                            <span>{classroomRequest.section}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <BookOpenText className="h-4 w-4" />
                            <span>{classroomRequest.subject}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CalendarIcon className="h-4 w-4" />
                            <span>{formatISODate(classroomRequest.date)}</span>
                          </div>

                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            <span>
                              {TIME_MAP[toTimeInt(classroomRequest.startTime)]}{" "}
                              {""}-{""}{" "}
                              {TIME_MAP[toTimeInt(classroomRequest.endTime)]}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-2 flex items-center gap-2 md:mt-0">
                      {classroomRequest.status ===
                        RoomRequestStatus.Pending && (
                          <div>
                            <Button
                              size="sm"
                              onClick={() => {
                                handleCancel(classroomRequest.id);
                              }}
                              className="bg-orange-600 text-white hover:bg-orange-700"
                            >
                              <XCircle className="mr-1 h-4 w-4" />
                              Cancel
                            </Button>
                          </div>
                        )}
                    </div>
                  </div>
                  <div className="text-muted-foreground border-border flex border-t pt-3 text-xs">
                    Submitted on {formatISODate(classroomRequest.createdAt)} (
                    {formatLocalTime(classroomRequest.createdAt)})
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
      {ConfirmationDialog}
    </div>
  );
}
