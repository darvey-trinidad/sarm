"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { api } from "@/trpc/react";
import { Button } from "@/components/ui/button";
import { TIME_MAP } from "@/constants/timeslot";
import { toTimeInt } from "@/lib/utils";
import { RoomRequestStatus } from "@/constants/room-request-status";
import { toast } from "sonner";
import { env } from "@/env";

export default function RespondPage() {
  const [responded, setResponded] = useState(false);
  const [requestStatus, setRequestStatus] = useState("");

  const params = useParams<{ roomRequestId?: string }>();
  const roomRequestId = params?.roomRequestId ?? "";

  const { data: roomRequestData, isLoading } =
    api.classroomSchedule.getRoomRequestById.useQuery(
      { roomRequestId },
      { enabled: !!roomRequestId }
    );

  const { mutate, isPending, isError, error } =
    api.classroomSchedule.respondToRoomRequest.useMutation();

  useEffect(() => {
    if (roomRequestData && roomRequestData.status !== "pending") {
      setRequestStatus(roomRequestData.status);
      setResponded(true);
    }
  }, [roomRequestData]);

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
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
      <div className="w-full max-w-2xl overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg">
        {/* Header */}
        <div className="bg-[#8A350E] px-6 py-5 text-white">
          <h1 className="text-xl font-bold">Room Request</h1>
          <p className="text-sm text-[#fcd9c5]">
            Someone is requesting to borrow your room.
          </p>
        </div>

        {/* Body */}
        <div className="space-y-6 p-8 text-gray-800">
          <p className="text-lg">
            <span className="font-semibold text-blue-700">
              {roomRequestData.requestorName}
            </span>{" "}
            is requesting to use room{" "}
            <span className="font-semibold text-gray-900">
              {roomRequestData.classroomName}
            </span>
          </p>

          <p>
            on{" "}
            <span className="font-medium">
              {new Date(roomRequestData.date).toLocaleDateString(undefined, {
                year: "numeric",
                month: "long",
                day: "numeric",
                weekday: "long",
              })}
            </span>{" "}
            from{" "}
            <span className="font-medium">
              {TIME_MAP[toTimeInt(roomRequestData.startTime)]} –{" "}
              {TIME_MAP[toTimeInt(roomRequestData.endTime)]}
            </span>
          </p>

          {roomRequestData.subject && (
            <div className="rounded-lg border border-gray-200 bg-[#fef7f5] p-4">
              <p className="text-sm text-[#8A350E]">Subject & Section</p>
              <p className="font-semibold text-gray-900">
                {roomRequestData.subject} - {roomRequestData.section}
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-center gap-4">
            <Button
              onClick={() =>
                mutate(
                  { roomRequestId, status: RoomRequestStatus.Accepted },
                  {
                    onSuccess: () => {
                      toast("Responded successfully!");
                      setRequestStatus(RoomRequestStatus.Accepted);
                      setResponded(true);
                    },
                  }
                )
              }
              className="rounded-lg bg-green-600 px-6 py-2 text-white shadow-md hover:bg-green-700 disabled:opacity-50"
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
                      toast("Responded successfully!");
                      setRequestStatus(RoomRequestStatus.Declined);
                      setResponded(true);
                    },
                  }
                )
              }
              className="rounded-lg bg-red-600 px-6 py-2 text-white shadow-md hover:bg-red-700 disabled:opacity-50"
              disabled={isPending || responded}
            >
              {isPending ? "Processing..." : "Decline"}
            </Button>
          </div>

          {/* Feedback */}
          {responded && (
            <p className="mt-4 text-center font-medium text-green-600">
              This request has already been {requestStatus}.
            </p>
          )}

          {isError && (
            <p className="mt-4 text-center font-medium text-red-600">
              Failed to respond: {error.message}
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 bg-gray-50 px-6 py-4 text-center text-xs text-gray-500">
          <a className="underline" target="_blank" href={env.NEXT_PUBLIC_APP_URL}>Scheduling and Resource Management System</a>
        </div>
      </div>
    </div>
  );
}
