import { db, and, eq, inArray } from "@/server/db";
import { classroomSchedule, classroomVacancy } from "@/server/db/schema/classroom-schedule";
import type { ClassroomScheduleWithoutId, ClassroomVacancyWithoutId } from "@/server/db/types/classroom-schedule";
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
    console.log("Failed to get classroom schedule conflicts:", error);
    throw new Error("Could not get classroom schedule conflicts");
  }
}

export const getClassroomVacancyConflicts = async (newVacancy: ClassroomVacancyWithoutId, startTimes: TimeInt[]) => {
  try {
    return await db
      .select()
      .from(classroomVacancy)
      .where(
        and(
          eq(classroomVacancy.date, newVacancy.date),
          eq(classroomVacancy.classroomId, newVacancy.classroomId),
          inArray(classroomVacancy.startTime, startTimes)
        )
      );
  } catch (error) {
    console.log("Failed to get classroom vacancy conflicts:", error);
    throw new Error("Could not get classroom vacancy conflicts");
  }
}