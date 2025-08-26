"use client";

import { useState, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Info, Filter, ChevronLeft, ChevronRight } from "lucide-react";
import { format, addDays, startOfWeek, addWeeks, subWeeks } from "date-fns";
import type { FinalClassroomSchedule } from "@/types/clasroom-schedule";
import { api } from "@/trpc/react";
import { date } from "better-auth";

//6:00 to 24:00
const timeSlots = Array.from({ length: 25 }, (_, i) => {
  const hour = i + 6;
  const displayHour = hour > 24 ? hour - 24 : hour;
  return {
    time: `${displayHour.toString().padStart(2, "0")}:00`,
    minutes: hour * 60,
  };
});

const DaysofWeek = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

interface ClassroomCalendarViewProps {
  classroomId: string;
  buildingName?: string;
  roomName?: string;
}

export default function ScheduleCalendarView({
  classroomId,
}: ClassroomCalendarViewProps) {
  const [schedules, setSchedules] = useState<FinalClassroomSchedule[]>([]);
  const [setSelecteditems, setSelectedItems] = useState<
    FinalClassroomSchedule[]
  >([]);
  const [currentWeek, setCurrentWeek] = useState(() => new Date());
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const startDate = startOfWeek(currentWeek, { weekStartsOn: 1 });
  const endDate = addDays(startDate, 5);

  // Fetch schedule data
  const { data: scheduleData, isLoading } =
    api.classroomSchedule.getWeeklyClassroomSchedule.useQuery({
      classroomId: classroomId,
      startDate: startDate,
      endDate: endDate,
    });
}
