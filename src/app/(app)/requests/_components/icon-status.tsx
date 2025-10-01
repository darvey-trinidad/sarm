import {
  AlertCircle,
  CheckCircle,
  CircleOff,
  XCircle,
  Undo2,
} from "lucide-react";
import type { ReactNode } from "react";

export function getStatusIconVenue(status: string): ReactNode {
  switch (status) {
    case "approved":
      return <CheckCircle className="h-4 w-4 text-green-600" />;
    case "rejected":
      return <XCircle className="h-4 w-4 text-red-600" />;
    case "canceled":
      return <CircleOff className="h-4 w-4 text-orange-600" />;
    default:
      return <AlertCircle className="h-4 w-4 text-yellow-600" />;
  }
}

export function getStatusColorVenue(status: string): string {
  switch (status) {
    case "approved":
      return "bg-green-100 text-green-800 border-green-200";
    case "rejected":
      return "bg-red-100 text-red-800 border-red-200";
    case "canceled":
      return "bg-orange-100 text-orange-800 border-orange-200";
    default:
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
  }
}

export function getStatusIconResource(status: string): ReactNode {
  switch (status) {
    case "approved":
      return <CheckCircle className="h-4 w-4 text-green-600" />;
    case "rejected":
      return <XCircle className="h-4 w-4 text-red-600" />;
    case "canceled":
      return <CircleOff className="h-4 w-4 text-orange-600" />;
    case "returned":
      return <Undo2 className="h-4 w-4 text-blue-600" />;
    default:
      return <AlertCircle className="h-4 w-4 text-yellow-600" />;
  }
}

export function getStatusColorResource(status: string): string {
  switch (status) {
    case "approved":
      return "bg-green-100 text-green-800 border-green-200";
    case "rejected":
      return "bg-red-100 text-red-800 border-red-200";
    case "canceled":
      return "bg-orange-100 text-orange-800 border-orange-200";
    case "returned":
      return "bg-blue-100 text-blue-800 border-blue-200";
    default:
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
  }
}
