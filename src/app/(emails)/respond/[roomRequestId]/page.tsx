"use client";

import { useState, useEffect } from "react";
import { redirect, useParams } from "next/navigation";
import { api } from "@/trpc/react";
import { Button } from "@/components/ui/button";
import { TIME_MAP } from "@/constants/timeslot";
import { toTimeInt } from "@/lib/utils";
import { RoomRequestStatus } from "@/constants/room-request-status";
import { toast } from "sonner";
import { env } from "@/env";
import { authClient } from "@/lib/auth-client";
import { PageRoutes } from "@/constants/page-routes";
import { Roles } from "@/constants/roles";
import { User, Building2, Calendar, Clock, BookOpen, UserCheck, FileText } from "lucide-react";

export default function RespondPage() {
  const [responded, setResponded] = useState(false);
  const [requestStatus, setRequestStatus] = useState("");

  const { data: session } = authClient.useSession();

  const params = useParams<{ roomRequestId?: string }>();
  const roomRequestId = params?.roomRequestId ?? "";

  const { data: roomRequestData, isLoading } =
    api.classroomSchedule.getRoomRequestById.useQuery(
      { roomRequestId },
      { enabled: !!roomRequestId }
    );

  const crossDepartment = !!roomRequestData?.departmentRequestedTo;
  const isRequestedDeptHead = session?.user.role === Roles.DepartmentHead
    && session?.user.departmentOrOrganization === roomRequestData?.departmentRequestedTo

  const { mutate, isPending, isError, error } =
    api.classroomSchedule.respondToRoomRequest.useMutation();

  useEffect(() => {
    if (roomRequestData && roomRequestData.status !== "pending") {
      setRequestStatus(roomRequestData.status);
      setResponded(true);
    }
  }, [roomRequestData]);

  useEffect(() => {
    console.log("roomRequestData", roomRequestData);
    console.log("user role and dept: ", session?.user.role, session?.user.departmentOrOrganization);
    console.log("dept requested to: ", roomRequestData?.departmentRequestedTo);
    if (!isLoading && session && roomRequestData) {
      if (roomRequestData.responderId !== session.user.id
        && !isRequestedDeptHead) {
        redirect(PageRoutes.DASHBOARD);
      }
    }
  }, [isLoading, session, roomRequestData]);

  if (!roomRequestId) {
    return (
      <p className="p-6 text-center text-red-600 font-medium">
        Invalid or missing request link.
      </p>
    );
  }

  if (isLoading) {
    return <p className="my-auto p-6 text-center">Loading request...</p>;
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
            Someone is requesting to borrow a room.
          </p>
        </div>

        {/* Body */}
        <div className="space-y-6 p-8">
          {/* Requestor Info */}
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-blue-100">
              <User className="h-6 w-6 text-blue-700" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-500">Requested by</p>
              <p className="text-lg font-semibold text-gray-900">
                {roomRequestData.requestorName}
              </p>
            </div>
          </div>

          {/* Request Details Card */}
          <div className="space-y-4 rounded-lg border border-gray-200 bg-gray-50 p-5">
            {/* Room */}
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-[#8A350E]">
                <Building2 className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500">Room</p>
                <p className="text-base font-semibold text-gray-900">
                  {roomRequestData.classroomName}
                </p>
              </div>
            </div>

            {/* Date */}
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-[#8A350E]">
                <Calendar className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500">Date</p>
                <p className="text-base font-semibold text-gray-900">
                  {new Date(roomRequestData.date).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    weekday: "long",
                  })}
                </p>
              </div>
            </div>

            {/* Time */}
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-[#8A350E]">
                <Clock className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500">Time</p>
                <p className="text-base font-semibold text-gray-900">
                  {TIME_MAP[toTimeInt(roomRequestData.startTime)]} – {TIME_MAP[toTimeInt(roomRequestData.endTime)]}
                </p>
              </div>
            </div>

            {/* Subject & Section */}
            {roomRequestData.subject && (
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-[#8A350E]">
                  <BookOpen className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500">Subject & Section</p>
                  <p className="text-base font-semibold text-gray-900">
                    {roomRequestData.subject} - {roomRequestData.section}
                  </p>
                </div>
              </div>
            )}

            {/* Original Owner */}
            {(roomRequestData.responderName && crossDepartment && isRequestedDeptHead) && (
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-[#8A350E]">
                  <UserCheck className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500">Room Owner</p>
                  <p className="text-base font-semibold text-gray-900">
                    {roomRequestData.responderName}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Details Section */}
          {roomRequestData.details && (
            <div className="rounded-lg border border-gray-200 bg-white p-5">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-[#8A350E]">
                  <FileText className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-medium text-gray-500 mb-2">Additional Details</p>
                  <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {roomRequestData.details}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-center gap-4 pt-2">
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
              className="flex-1 rounded-lg bg-green-600 px-6 py-3 text-base font-semibold text-white shadow-md transition-all hover:bg-green-700 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isPending || responded || (crossDepartment && !isRequestedDeptHead)}
            >
              {isPending ? (
                <span className="flex items-center gap-2">
                  <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Processing...
                </span>
              ) : (
                "Approve"
              )}
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
              className="flex-1 rounded-lg bg-red-600 px-6 py-3 text-base font-semibold text-white shadow-md transition-all hover:bg-red-700 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isPending || responded || (crossDepartment && !isRequestedDeptHead)}
            >
              {isPending ? (
                <span className="flex items-center gap-2">
                  <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Processing...
                </span>
              ) : (
                "Decline"
              )}
            </Button>
          </div>

          {/* Feedback Messages */}
          {responded && (
            <div className="rounded-lg border border-green-200 bg-green-50 p-4">
              <div className="flex items-center gap-3">
                <svg className="h-5 w-5 flex-shrink-0 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <p className="text-sm font-medium text-green-800">
                  This request has already been {requestStatus}.
                </p>
              </div>
            </div>
          )}

          {(!responded && (crossDepartment && !isRequestedDeptHead)) && (
            <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
              <div className="flex items-center gap-3">
                <svg className="h-5 w-5 flex-shrink-0 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <p className="text-sm font-medium text-blue-800">
                  This request is approvable by the department head.
                </p>
              </div>
            </div>
          )}

          {isError && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4">
              <div className="flex items-center gap-3">
                <svg className="h-5 w-5 flex-shrink-0 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <p className="text-sm font-medium text-red-800">
                  Failed to respond: {error.message}
                </p>
              </div>
            </div>
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