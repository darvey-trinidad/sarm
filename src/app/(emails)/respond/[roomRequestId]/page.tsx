"use client";

import { useParams } from "next/navigation";
import { api } from "@/trpc/react";
import { Button } from "@/components/ui/button";

export default function RespondPage() {
  const { roomRequestId } = useParams<{ roomRequestId: string }>();

  // Fetch the request details
  // const { data, isLoading } = api.classroomSchedule.getRoomRequest.useQuery({
  //   id: roomRequestId!,
  // });

  // const respondMutation = api.classroomSchedule.respondToRoomRequest.useMutation();

  // if (isLoading) return <p className="p-6 text-center">Loading request...</p>;

  // if (!data) return <p className="p-6 text-center">No request found.</p>;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 gap-6">
      <h1 className="text-2xl font-bold text-gray-800">Room Request Details Page {roomRequestId}</h1>

      {/* <div className="p-6 rounded-xl shadow-lg border max-w-lg w-full space-y-3">
        <p><strong>Room:</strong> {data.classroomName}</p>
        <p><strong>Date:</strong> {new Date(data.date).toLocaleDateString()}</p>
        <p>
          <strong>Time:</strong> {data.startTime} - {data.endTime}
        </p>
        <p><strong>Subject:</strong> {data.subject}</p>
        <p><strong>Section:</strong> {data.section}</p>
        <p><strong>Requested by:</strong> {data.requestorName}</p>
      </div>

      <div className="flex gap-4">
        <Button
          onClick={() =>
            respondMutation.mutate({ id: roomRequestId!, response: "approved" })
          }
          className="bg-green-600 hover:bg-green-700"
        >
          Approve
        </Button>

        <Button
          onClick={() =>
            respondMutation.mutate({ id: roomRequestId!, response: "declined" })
          }
          className="bg-red-600 hover:bg-red-700"
        >
          Decline
        </Button>
      </div> */}
    </div>
  );
}
