import type { ReactNode } from "react";
import { XCircle, AlertCircle, CheckCircle, CircleOff } from "lucide-react";
import {
  type RoomRequestStatusType,
  RoomRequestStatus,
} from "@/constants/room-request-status";

export function getStatusIconRoomRequest(
  status: RoomRequestStatusType,
): ReactNode {
  switch (status) {
    case RoomRequestStatus.Accepted:
      return <CheckCircle className="h-4 w-4 text-green-600" />;
    case RoomRequestStatus.Declined:
      return <XCircle className="h-4 w-4 text-red-600" />;
    case RoomRequestStatus.Canceled:
      return <CircleOff className="h-4 w-4 text-orange-600" />;
    default:
      return <AlertCircle className="h-4 w-4 text-yellow-600" />;
  }
}

export function getStatusColorRoomRequest(
  status: RoomRequestStatusType,
): string {
  switch (status) {
    case RoomRequestStatus.Accepted:
      return "bg-green-100 text-green-800 border-green-200";
    case RoomRequestStatus.Declined:
      return "bg-red-100 text-red-800 border-red-200";
    case RoomRequestStatus.Canceled:
      return "bg-orange-100 text-orange-800 border-orange-200";
    default:
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
  }
}
