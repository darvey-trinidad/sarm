import { db } from "@/server/db";
import { classroomSchedule, classroomVacancy } from "@/server/db/schema/classroom-schedule";
import type { ClassroomScheduleWithoutId, ClassroomVacancyWithoutId } from "@/server/db/types/classroom-schedule";
import { splitScheduleToHourlyTimeslot, splitVacancyToHourlyTimeslot } from "@/lib/helper/classroom-schedule";
import { getClassroomScheduleConflicts, getClassroomVacancyConflicts } from "@/lib/api/classroom-schedule/query";
import type { TimeInt } from "@/constants/timeslot";

export const createClassroomSchedule = async (data: ClassroomScheduleWithoutId) => {
  try {
    //splitScheduleToHourlyTimeslot generates an id for each split timeslot, hence parameter must not have an id yet
    const splitSchedules = splitScheduleToHourlyTimeslot(data);

    const startTimes = splitSchedules.map((schedule) => schedule.startTime as TimeInt);
    const conflictSchedules = await getClassroomScheduleConflicts(data, startTimes);

    if (conflictSchedules.length > 0) {
      return {
        success: false,
        conflict: true,
        conflictingSchedules: conflictSchedules,
      };
    }

    return await db.insert(classroomSchedule).values(splitSchedules).run();
  } catch (err) {
    console.error("Failed to create classroom schedule:", err);
    throw new Error("Could not create classroom schedule");
  }
}

export const createClassroomVacancy = async (data: ClassroomVacancyWithoutId) => {
  try {
    const splitVacancies = splitVacancyToHourlyTimeslot(data);

    const startTimes = splitVacancies.map((vacancy) => vacancy.startTime as TimeInt);
    const conflictVacancies = await getClassroomVacancyConflicts(data, startTimes);

    if (conflictVacancies.length > 0) {
      return {
        success: false,
        conflict: true,
        conflictingVacancies: conflictVacancies,
      };
    }

    return await db.insert(classroomVacancy).values(splitVacancies).run();
  } catch (err) {
    console.error("Failed to create classroom vacancy:", err);
    throw new Error("Could not create classroom vacancy");
  }
}
