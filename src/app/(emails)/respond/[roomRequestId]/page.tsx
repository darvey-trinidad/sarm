"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { api } from "@/trpc/react";
import { Button } from "@/components/ui/button";
import { TIME_MAP } from "@/constants/timeslot";
import { toTimeInt } from "@/lib/utils";
import { RoomRequestStatus } from "@/constants/room-request-status";
import { toast } from "sonner";
import { set } from "better-auth";

export default function RespondPage() {
  const [responded, setResponded] = useState(false);
  const [requestStatus, setRequestStatus] = useState("");

  const params = useParams<{ roomRequestId?: string }>();
  const roomRequestId = params?.roomRequestId ?? ""; // 👈 always defined (string)

  const { data: roomRequestData, isLoading } =
    api.classroomSchedule.getRoomRequestById.useQuery(
      { roomRequestId },
      { enabled: !!roomRequestId } // 👈 only runs if we have an ID
    );

  const {
    mutate,
    isPending,
    isSuccess,
    isError,
    error,
    variables,
  } = api.classroomSchedule.respondToRoomRequest.useMutation();

  useEffect(() => {
    if (roomRequestData && roomRequestData.status !== "pending") {
      setRequestStatus(roomRequestData.status);
      setResponded(true);
    }
  }, [roomRequestData]);

  // Now render based on conditions safely
  if (!roomRequestId) {
    return (
      <p className="p-6 text-center text-red-600 font-medium">
        Invalid or missing request link.
      </p>
    );
  }

  if (isLoading) {
    return <p className="p-6 text-center">Loading request...</p>;
  }

  if (!roomRequestData) {
    return (
      <p className="p-6 text-center text-gray-600">No request found.</p>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gray-50">
      <div className="w-full max-w-2xl p-8 bg-white rounded-2xl shadow-lg space-y-6">
        {/* Title */}
        <h1 className="text-2xl font-bold text-gray-900 text-center">
          Room Request Approval
        </h1>

        {/* Single concise summary */}
        <div className="bg-gray-100 p-6 rounded-xl text-gray-800 space-y-3">
          <p className="text-lg">
            Professor{" "}
            <span className="font-semibold text-blue-700">
              {roomRequestData.requestorName}
            </span>{" "}
            is requesting to borrow Room{" "}
            <span className="font-semibold">
              {roomRequestData.classroomName}
            </span>
          </p>
          <p>
            on{" "}
            <span className="font-medium">
              {new Date(roomRequestData.date).toLocaleDateString()}
            </span>{" "}
            from{" "}
            <span className="font-medium">
              {TIME_MAP[toTimeInt(roomRequestData.startTime)]} –{" "}
              {TIME_MAP[toTimeInt(roomRequestData.endTime)]}
            </span>
          </p>
          {roomRequestData.subject && (
            <p>
              for <span className="font-medium">{roomRequestData.subject}</span>{" "}
              ({roomRequestData.section})
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-center gap-6 mt-6">
          <Button
            onClick={() =>
              mutate(
                { roomRequestId, status: RoomRequestStatus.Accepted },
                {
                  onSuccess: () => {
                    toast(`Responded successfully!`);
                    setRequestStatus(RoomRequestStatus.Accepted);
                    setResponded(true);
                  }
                }
              )
            }
            className="bg-green-600 hover:bg-green-700 px-8 py-3 text-lg rounded-xl shadow-md"
            disabled={isPending || responded}
          >
            {isPending ? "Processing..." : "Approve"}
          </Button>

          <Button
            onClick={() =>
              mutate(
                { roomRequestId, status: RoomRequestStatus.Declined },
                {
                  onSuccess: () => {
                    toast(`Responded successfully!`);
                    setRequestStatus(RoomRequestStatus.Declined);
                    setResponded(true);
                  }
                }
              )
            }
            className="bg-red-600 hover:bg-red-700 px-8 py-3 text-lg rounded-xl shadow-md"
            disabled={isPending || responded}
          >
            {isPending ? "Processing..." : "Decline"}
          </Button>
        </div>

        {/* Feedback */}
        {responded && (
          <p className="text-green-600 font-medium text-center mt-4">
            This request has already been {requestStatus}.
          </p>
        )}

        {isError && (
          <p className="text-red-600 font-medium text-center mt-4">
            Failed to respond: {error.message}
          </p>
        )}
      </div>
    </div>
  );
}
