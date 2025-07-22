import { db, and, eq, inArray } from "@/server/db";
import { classroomSchedule } from "@/server/db/schema/classroom-schedule";
import type { ClassroomScheduleWithoutId } from "@/server/db/types/classroom-schedule";
import type { TimeInt } from "@/constants/timeslot";

export const getClassroomScheduleConflicts = async (newSchedule: ClassroomScheduleWithoutId, startTimes: TimeInt[]) => {
  try {
    return await db
      .select()
      .from(classroomSchedule)
      .where(
        and(
          eq(classroomSchedule.day, newSchedule.day),
          eq(classroomSchedule.classroomId, newSchedule.classroomId),
          inArray(classroomSchedule.startTime, startTimes)
        )
      );
  } catch (error) {
    console.log("Failed to get potential classroom schedule conflicts:", error);
    throw new Error("Could not get potential classroom schedule conflicts");
  }
}