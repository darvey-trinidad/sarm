import { db, and, eq, inArray, gte, lte } from "@/server/db";
import { classroom } from "@/server/db/schema/classroom";
import { classroomSchedule, classroomVacancy, classroomBorrowing, roomRequests } from "@/server/db/schema/classroom-schedule";
import type { ClassroomScheduleWithoutId, ClassroomVacancyWithoutId, ClassroomBorrowingWithoutId } from "@/server/db/types/classroom-schedule";
import { type TimeInt, TIME_ENTRIES } from "@/constants/timeslot";
import { SCHEDULE_SOURCE } from "@/constants/schedule";
import { TIME_INTERVAL } from "@/constants/timeslot";
import type { FinalClassroomSchedule } from "@/types/clasroom-schedule";
import { user } from "@/server/db/schema/auth";
import { toTimeInt } from "@/lib/utils";
import { alias } from "drizzle-orm/sqlite-core";

// single day schedule
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
      )
      .orderBy(classroomSchedule.startTime);
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
      )
      .orderBy(classroomVacancy.startTime);
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
      )
      .orderBy(classroomBorrowing.startTime);
  } catch (error) {
    console.log("Failed to get classroom borrowing:", error);
    throw new Error("Could not get classroom borrowing");
  }
}

export const getRoomRequestById = async (id: string) => {
  try {
    const requestor = alias(user, "requestor");
    const responder = alias(user, "responder");

    return await db.select(
      {
        id: roomRequests.id,
        classroomId: roomRequests.classroomId,
        classroomName: classroom.name,
        date: roomRequests.date,
        startTime: roomRequests.startTime,
        endTime: roomRequests.endTime,
        subject: roomRequests.subject,
        section: roomRequests.section,
        requestorId: requestor.id,
        requestorName: requestor.name,
        requestorEmail: requestor.email,
        responderId: responder.id,
        responderName: responder.name,
        responderEmail: responder.email,
      }
    )
      .from(roomRequests)
      .where(eq(roomRequests.id, id))
      .leftJoin(requestor, eq(roomRequests.requesterId, requestor.id))
      .leftJoin(responder, eq(roomRequests.responderId, responder.id))
      .innerJoin(classroom, eq(roomRequests.classroomId, classroom.id))
      .get();
  } catch (error) {
    console.log("Failed to get room request:", error);
    throw new Error("Could not get room request");
  }
}

/**
 * Get classroom schedule for a week
 */

export const getWeeklyClassroomSchedule = async (
  classroomId: string,
  startDate: Date, // Monday
  endDate: Date    // Saturday
): Promise<FinalClassroomSchedule[]> => {
  try {
    const [initialSchedule, vacancies, borrowings] = await Promise.all([
      db
        .select({
          id: classroomSchedule.id,
          classroomId: classroomSchedule.classroomId,
          facultyId: classroomSchedule.facultyId,
          facultyName: user.name,
          day: classroomSchedule.day,
          startTime: classroomSchedule.startTime,
          endTime: classroomSchedule.endTime,
          subject: classroomSchedule.subject,
          section: classroomSchedule.section,
        })
        .from(classroomSchedule)
        .leftJoin(user, eq(classroomSchedule.facultyId, user.id))
        .where(
          and(
            eq(classroomSchedule.classroomId, classroomId),
            gte(classroomSchedule.day, startDate.getDay()),
            lte(classroomSchedule.day, endDate.getDay())
          )
        )
        .orderBy(classroomSchedule.day, classroomSchedule.startTime),

      db
        .select({
          id: classroomVacancy.id,
          classroomId: classroomVacancy.classroomId,
          date: classroomVacancy.date,
          startTime: classroomVacancy.startTime,
          endTime: classroomVacancy.endTime,
          reason: classroomVacancy.reason,
        })
        .from(classroomVacancy)
        .where(
          and(
            eq(classroomVacancy.classroomId, classroomId),
            gte(classroomVacancy.date, startDate),
            lte(classroomVacancy.date, endDate)
          )
        )
        .orderBy(classroomVacancy.date, classroomVacancy.startTime),

      db
        .select({
          id: classroomBorrowing.id,
          classroomId: classroomBorrowing.classroomId,
          facultyId: classroomBorrowing.facultyId,
          facultyName: user.name,
          date: classroomBorrowing.date,
          startTime: classroomBorrowing.startTime,
          endTime: classroomBorrowing.endTime,
          subject: classroomBorrowing.subject,
          section: classroomBorrowing.section,
        })
        .from(classroomBorrowing)
        .leftJoin(user, eq(classroomBorrowing.facultyId, user.id))
        .where(
          and(
            eq(classroomBorrowing.classroomId, classroomId),
            gte(classroomBorrowing.date, startDate),
            lte(classroomBorrowing.date, endDate)
          )
        )
        .orderBy(classroomBorrowing.date, classroomBorrowing.startTime),
    ]);

    const results: FinalClassroomSchedule[] = [];
    let current = new Date(startDate);

    while (current <= endDate) {
      const day = current.getDay();

      TIME_ENTRIES.slice(0, -1).forEach(([time]) => {
        const initial = initialSchedule.find(
          (s) => s.startTime === time && s.day === day
        );
        const vacancy = vacancies.find(
          (v) =>
            v.startTime === time &&
            v.date.toDateString() === current.toDateString()
        );
        const borrowing = borrowings.find(
          (b) =>
            b.startTime === time &&
            b.date.toDateString() === current.toDateString()
        );

        if (borrowing) {
          const { startTime, endTime, ...rest } = borrowing;
          results.push({
            startTime: toTimeInt(startTime),
            endTime: toTimeInt(endTime),
            ...rest,
            source: SCHEDULE_SOURCE.Borrowing,
          });
        } else if (vacancy) {
          const { startTime, endTime, reason, ...rest } = vacancy;
          results.push({
            startTime: toTimeInt(startTime),
            endTime: toTimeInt(endTime),
            ...rest,
            facultyId: null,
            facultyName: null,
            subject: null,
            section: null,
            source: SCHEDULE_SOURCE.Vacancy,
          });
        } else if (initial) {
          const { day, startTime, endTime, ...rest } = initial;
          results.push({
            startTime: toTimeInt(startTime),
            endTime: toTimeInt(endTime),
            ...rest,
            date: new Date(current),
            source: SCHEDULE_SOURCE.InitialSchedule,
          });
        } else {
          results.push({
            id: null,
            classroomId: classroomId,
            facultyId: null,
            facultyName: null,
            subject: null,
            section: null,
            date: new Date(current), // clone to avoid mutation issues
            startTime: time,
            endTime: toTimeInt(time + TIME_INTERVAL),
            source: SCHEDULE_SOURCE.Unoccupied,
          });
        }
      });

      current.setDate(current.getDate() + 1);
    }

    return results;
  } catch (error) {
    console.log("Failed to get weekly classroom schedule:", error);
    throw new Error("Could not get weekly classroom schedule");
  }
};



/*
*** Conflicts
*/
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