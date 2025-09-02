import { db, eq, and, or } from "@/server/db";
import { classroomSchedule, classroomVacancy, classroomBorrowing } from "@/server/db/schema/classroom-schedule";
import type { ClassroomScheduleWithoutId, ClassroomVacancyWithoutId, ClassroomBorrowingWithoutId } from "@/server/db/types/classroom-schedule";
import { splitScheduleToHourlyTimeslot, splitVacancyToHourlyTimeslot, splitBorrowingToHourlyTimeslot, splitTimeToHourlyTimeslot } from "@/lib/helper/classroom-schedule";
import { getClassroomScheduleConflicts, getClassroomVacancyConflicts, getClassroomBorrowingConflicts } from "@/lib/api/classroom-schedule/query";
import type { TimeInt } from "@/constants/timeslot";
import { TRPCError } from "@trpc/server";
import type { CancelClassroomBorrowingInput } from "@/server/api-utils/validators/classroom-schedule";

export const createClassroomSchedule = async (data: ClassroomScheduleWithoutId) => {
  try {
    // splitScheduleToHourlyTimeslot generates an id for each split timeslot, hence parameter must not have an id yet
    const splitSchedules = splitScheduleToHourlyTimeslot(data);

    const startTimes = splitSchedules.map((schedule) => schedule.startTime as TimeInt);
    const conflictSchedules = await getClassroomScheduleConflicts(data, startTimes);

    if (conflictSchedules.length > 0) {
      throw new TRPCError({
        code: "CONFLICT", // or "BAD_REQUEST", whichever fits best
        message: "Classroom schedule conflict detected",
        cause: conflictSchedules,
      });
    }

    return await db.insert(classroomSchedule).values(splitSchedules).run();
  } catch (err) {
    console.error("Failed to create classroom schedule:", err);

    if (err instanceof TRPCError) throw err; // rethrow if already handled

    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Could not create classroom schedule",
    });
  }
};

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

export const createClassroomBorrowing = async (data: ClassroomBorrowingWithoutId) => {
  try {
    const splitBorrowings = splitBorrowingToHourlyTimeslot(data);

    const startTimes = splitBorrowings.map((borrowing) => borrowing.startTime as TimeInt);
    const conflictBorrowings = await getClassroomBorrowingConflicts(data, startTimes);

    if (conflictBorrowings.length > 0) {
      return {
        success: false,
        conflict: true,
        conflictingBorrowings: conflictBorrowings,
      };
    }

    return await db.insert(classroomBorrowing).values(splitBorrowings).run();
  } catch (err) {
    console.error("Failed to create classroom borrowing:", err);
    throw new Error("Could not create classroom borrowing");
  }
}

export const deleteClassroomBorrowing = async (records: CancelClassroomBorrowingInput) => {
  try {
    const data: CancelClassroomBorrowingInput[] = splitTimeToHourlyTimeslot(records);
    console.log("INSIDE: \n", data);

    if (data.length === 0) return;

    // Build OR conditions
    const conditions = data.map((r) =>
      and(
        eq(classroomBorrowing.classroomId, r.classroomId),
        eq(classroomBorrowing.date, r.date),
        eq(classroomBorrowing.startTime, r.startTime),
        eq(classroomBorrowing.endTime, r.endTime),
      )
    );

    await db
      .delete(classroomBorrowing)
      .where(or(...conditions));
  } catch (err) {
    console.error("Failed to delete classroom borrowing:", err);
    throw new Error("Could not delete classroom borrowing");
  }
}