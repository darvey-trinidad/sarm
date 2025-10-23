import React from "react";
import { CalendarIcon, Clock, User, CheckCircle } from "lucide-react";
import { SCHEDULE_SOURCE } from "@/constants/schedule";

export interface ScheduleTypeInfo {
  icon: React.ReactElement;
  label: string;
  color: string;
}

export const getScheduleTypeInfo = (source: string): ScheduleTypeInfo => {
  switch (source) {
    case SCHEDULE_SOURCE.InitialSchedule:
      return {
        icon: <CalendarIcon className="text-primary h-4 w-4" />,
        label: "Scheduled Class",
        color: "bg-blue-100 text-blue-800",
      };
    case SCHEDULE_SOURCE.Vacancy:
      return {
        icon: <CheckCircle className="text-primary h-4 w-4" />,
        label: "Available (Vacant)",
        color: "bg-green-100 text-green-800",
      };
    case SCHEDULE_SOURCE.Borrowing:
      return {
        icon: <User className="text-primary h-4 w-4" />,
        label: "Borrowed",
        color: "bg-orange-100 text-orange-800",
      };
    case SCHEDULE_SOURCE.Unoccupied:
      return {
        icon: <Clock className="text-primary h-4 w-4" />,
        label: "Unoccupied",
        color: "bg-gray-100 text-gray-800",
      };
    default:
      return {
        icon: <Clock className="text-primary h-4 w-4" />,
        label: "Unknown",
        color: "bg-gray-100 text-gray-800",
      };
  }
};
