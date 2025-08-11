import { db, and, eq, inArray } from "@/server/db";
import { classroomSchedule, classroomVacancy, classroomBorrowing } from "@/server/db/schema/classroom-schedule";
import type { ClassroomScheduleWithoutId, ClassroomVacancyWithoutId, ClassroomBorrowingWithoutId } from "@/server/db/types/classroom-schedule";
import { type TimeInt, TIME_ENTRIES } from "@/constants/timeslot";
import { SCHEDULE_SOURCE } from "@/constants/schedule";
import { TIME_INTERVAL } from "@/constants/timeslot";
import type { FinalClassroomSchedule } from "@/types/clasroom-schedule";

export const getInitialClassroomSchedule = async (classroomId: string, date: Date) => {
  try {
    return await db
      .select()
      .from(classroomSchedule)
      .where(
        and(
          eq(classroomSchedule.classroomId, classroomId),
          eq(classroomSchedule.day, date.getDay())
        )
      );
  } catch (error) {
    console.log("Failed to get final classroom schedule:", error);
    throw new Error("Could not get final classroom schedule");
  }
}

export const getClassroomVacancy = async (classroomId: string, date: Date) => {
  try {
    return await db
      .select()
      .from(classroomVacancy)
      .where(
        and(
          eq(classroomVacancy.classroomId, classroomId),
          eq(classroomVacancy.date, date)
        )
      );
  } catch (error) {
    console.log("Failed to get classroom vacancy:", error);
    throw new Error("Could not get classroom vacancy");
  }
}

export const getClassroomBorrowing = async (classroomId: string, date: Date) => {
  try {
    return await db
      .select()
      .from(classroomBorrowing)
      .where(
        and(
          eq(classroomBorrowing.classroomId, classroomId),
          eq(classroomBorrowing.date, date)
        )
      );
  } catch (error) {
    console.log("Failed to get classroom borrowing:", error);
    throw new Error("Could not get classroom borrowing");
  }
}

export const getClassroomSchedule = async (classroomId: string, date: Date): Promise<FinalClassroomSchedule[]> => {
  try {
    const day = date.getDay();

    const [initialSchedule, vacancies, borrowings] = await Promise.all([
      getInitialClassroomSchedule(classroomId, date),
      getClassroomVacancy(classroomId, date),
      getClassroomBorrowing(classroomId, date),
    ]);

    return TIME_ENTRIES.map(([time]) => {
      const initial = initialSchedule.find((schedule) => schedule.startTime === time && schedule.day === day);
      const vacancy = vacancies.find((vacancy) => vacancy.startTime === time);
      const borrowing = borrowings.find((borrowing) => borrowing.startTime === time);

      if (borrowing) {
        return {
          id: borrowing.id,
          classroomId: borrowing.classroomId,
          facultyId: borrowing.facultyId,
          subject: borrowing.subject,
          section: borrowing.section,
          date: borrowing.date,
          startTime: borrowing.startTime,
          endTime: borrowing.endTime,
          source: SCHEDULE_SOURCE.Borrowing,
        }
      }
      if (vacancy) {
        return {
          id: vacancy.id,
          classroomId: vacancy.classroomId,
          facultyId: null,
          subject: null,
          section: null,
          date: vacancy.date,
          startTime: vacancy.startTime,
          endTime: vacancy.endTime,
          source: SCHEDULE_SOURCE.Vacancy
        }
      }
      if (initial) {
        return {
          id: initial.id,
          classroomId: initial.classroomId,
          facultyId: initial.facultyId,
          subject: initial.subject,
          section: initial.section,
          date: date,
          startTime: initial.startTime,
          endTime: initial.endTime,
          source: SCHEDULE_SOURCE.InitialSchedule
        }
      }
      return {
        id: null,
        classroomId: null,
        facultyId: null,
        subject: null,
        section: null,
        date: date,
        startTime: time,
        endTime: time + TIME_INTERVAL,
        source: SCHEDULE_SOURCE.Unoccupied
      };
    })

  } catch (error) {
    console.log("Failed to get classroom schedule:", error);
    throw new Error("Could not get classroom schedule");
  }
};

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
export const getClassroomBorrowingConflicts = async (newBorrowing: ClassroomBorrowingWithoutId, startTimes: TimeInt[]) => {
  try {
    return await db
      .select()
      .from(classroomBorrowing)
      .where(
        and(
          eq(classroomBorrowing.date, newBorrowing.date),
          eq(classroomBorrowing.classroomId, newBorrowing.classroomId),
          inArray(classroomBorrowing.startTime, startTimes)
        )
      );
  } catch (error) {
    console.log("Failed to get classroom vacancy conflicts:", error);
    throw new Error("Could not get classroom vacancy conflicts");
  }
}