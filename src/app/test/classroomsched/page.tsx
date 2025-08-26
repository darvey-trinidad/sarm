"use client";
import { format, addDays, startOfWeek, addWeeks, subWeeks } from "date-fns";
import { api } from "@/trpc/react";
export default function Classroom() {
  const startDate = startOfWeek(new Date("2025-08-25"), { weekStartsOn: 1 });
  const endDate = addDays(new Date("2025-08-25"), 5);
  const { data } = api.classroomSchedule.getWeeklyClassroomSchedule.useQuery({
    classroomId: "426938b5-b503-4110-8713-e803f86eb1b6",
    startDate: startOfWeek(new Date("2025-08-25"), { weekStartsOn: 1 }),
    endDate: addDays(new Date("2025-08-30"), 5),
  });
  console.log(startDate);
  console.log(endDate);
  return <div>{JSON.stringify(data)}</div>;
}
