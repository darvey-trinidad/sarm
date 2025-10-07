import { db, and, eq, inArray, gte, lte, asc, sql, count } from "@/server/db";
import { building, classroom } from "@/server/db/schema/classroom";
import {
  classroomSchedule,
  classroomVacancy,
  classroomBorrowing,
  roomRequests,
} from "@/server/db/schema/classroom-schedule";
import type {
  ClassroomScheduleWithoutId,
  ClassroomVacancyWithoutId,
  ClassroomBorrowingWithoutId,
} from "@/server/db/types/classroom-schedule";
import { type TimeInt, TIME_ENTRIES } from "@/constants/timeslot";
import { SCHEDULE_SOURCE } from "@/constants/schedule";
import { TIME_INTERVAL } from "@/constants/timeslot";
import type {
  FinalClassroomSchedule,
  InitialClassroomSchedule,
} from "@/types/clasroom-schedule";
import { user } from "@/server/db/schema/auth";
import { toTimeInt } from "@/lib/utils";
import { alias } from "drizzle-orm/sqlite-core";
import type { ClassroomType } from "@/constants/classroom-type";
import { RoomRequestStatus } from "@/constants/room-request-status";
import type { c } from "node_modules/better-auth/dist/shared/better-auth.ClXlabtY";

// single day schedule
export const getInitialClassroomSchedule = async (
  classroomId: string,
  date: Date,
) => {
  try {
    return await db
      .select()
      .from(classroomSchedule)
      .where(
        and(
          eq(classroomSchedule.classroomId, classroomId),
          eq(classroomSchedule.day, date.getDay()),
        ),
      )
      .orderBy(classroomSchedule.startTime);
  } catch (error) {
    console.log("Failed to get final classroom schedule:", error);
    throw new Error("Could not get final classroom schedule");
  }
};

export const getClassroomVacancy = async (classroomId: string, date: Date) => {
  try {
    return await db
      .select()
      .from(classroomVacancy)
      .where(
        and(
          eq(classroomVacancy.classroomId, classroomId),
          eq(classroomVacancy.date, date),
        ),
      )
      .orderBy(classroomVacancy.startTime);
  } catch (error) {
    console.log("Failed to get classroom vacancy:", error);
    throw new Error("Could not get classroom vacancy");
  }
};

export const getClassroomBorrowing = async (
  classroomId: string,
  date: Date,
) => {
  try {
    return await db
      .select()
      .from(classroomBorrowing)
      .where(
        and(
          eq(classroomBorrowing.classroomId, classroomId),
          eq(classroomBorrowing.date, date),
        ),
      )
      .orderBy(classroomBorrowing.startTime);
  } catch (error) {
    console.log("Failed to get classroom borrowing:", error);
    throw new Error("Could not get classroom borrowing");
  }
};

export const getRoomRequestById = async (id: string) => {
  try {
    const requestor = alias(user, "requestor");
    const responder = alias(user, "responder");

    return await db
      .select({
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
        status: roomRequests.status,
        createdAt: roomRequests.createdAt,
        respondedAt: roomRequests.respondedAt,
      })
      .from(roomRequests)
      .where(eq(roomRequests.id, id))
      .innerJoin(requestor, eq(roomRequests.requesterId, requestor.id))
      .innerJoin(responder, eq(roomRequests.responderId, responder.id))
      .innerJoin(classroom, eq(roomRequests.classroomId, classroom.id))
      .get();
  } catch (error) {
    console.log("Failed to get room request:", error);
    throw new Error("Could not get room request");
  }
};

export const getRoomRequestsByResponderId = async (responderId: string) => {
  try {
    const now = new Date();
    now.setHours(now.getHours() + 8);
    const midnightPH = new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()),
    );

    return await db
      .select({
        id: roomRequests.id,
        classroomId: roomRequests.classroomId,
        classroomName: classroom.name,
        date: roomRequests.date,
        startTime: roomRequests.startTime,
        endTime: roomRequests.endTime,
        subject: roomRequests.subject,
        section: roomRequests.section,
        requestorId: user.id,
        requestorName: user.name,
        status: roomRequests.status,
        createdAt: roomRequests.createdAt,
      })
      .from(roomRequests)
      .where(
        and(
          eq(roomRequests.responderId, responderId),
          eq(roomRequests.status, RoomRequestStatus.Pending),
          gte(roomRequests.date, midnightPH),
        ),
      )
      .innerJoin(user, eq(roomRequests.requesterId, user.id))
      .innerJoin(classroom, eq(roomRequests.classroomId, classroom.id))
      .orderBy(asc(roomRequests.date), asc(roomRequests.startTime))
      .all();
  } catch (error) {
    console.log("Failed to get room request:", error);
    throw new Error("Could not get room request");
  }
};

export const getRoomRequestsByRequesterId = async (requesterId: string) => {
  try {
    const now = new Date();
    now.setHours(now.getHours() + 8);
    const midnightPH = new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()),
    );

    console.log(midnightPH);

    return await db
      .select({
        id: roomRequests.id,
        classroomId: roomRequests.classroomId,
        classroomName: classroom.name,
        date: roomRequests.date,
        startTime: roomRequests.startTime,
        endTime: roomRequests.endTime,
        subject: roomRequests.subject,
        section: roomRequests.section,
        requestorId: user.id,
        requestorName: user.name,
        status: roomRequests.status,
        createdAt: roomRequests.createdAt,
      })
      .from(roomRequests)
      .where(
        and(
          eq(roomRequests.requesterId, requesterId),
          gte(roomRequests.date, midnightPH),
        ),
      )
      .innerJoin(user, eq(roomRequests.requesterId, user.id))
      .innerJoin(classroom, eq(roomRequests.classroomId, classroom.id))
      .orderBy(asc(roomRequests.date), asc(roomRequests.startTime))
      .all();
  } catch (error) {
    console.log("Failed to get room request:", error);
    throw new Error("Could not get room request");
  }
};

/**
 * Get classroom schedule for a week
 */

export const getWeeklyClassroomSchedule = async (
  classroomId: string,
  startDate: Date, // Monday
  endDate: Date, // Saturday
): Promise<FinalClassroomSchedule[]> => {
  try {
    const [initialSchedule, vacancies, borrowings] = await Promise.all([
      db
        .select({
          id: classroomSchedule.id,
          classroomId: classroomSchedule.classroomId,
          classroomName: classroom.name,
          buildingId: classroom.buildingId,
          buildingName: building.name,
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
        .innerJoin(classroom, eq(classroomSchedule.classroomId, classroom.id))
        .innerJoin(building, eq(classroom.buildingId, building.id))
        .where(
          and(
            eq(classroomSchedule.classroomId, classroomId),
            gte(classroomSchedule.day, startDate.getDay()),
            lte(classroomSchedule.day, endDate.getDay()),
          ),
        )
        .orderBy(classroomSchedule.day, classroomSchedule.startTime),

      db
        .select({
          id: classroomVacancy.id,
          classroomId: classroomVacancy.classroomId,
          classroomName: classroom.name,
          buildingId: classroom.buildingId,
          buildingName: building.name,
          date: classroomVacancy.date,
          startTime: classroomVacancy.startTime,
          endTime: classroomVacancy.endTime,
          reason: classroomVacancy.reason,
        })
        .from(classroomVacancy)
        .innerJoin(classroom, eq(classroomVacancy.classroomId, classroom.id))
        .innerJoin(building, eq(classroom.buildingId, building.id))
        .where(
          and(
            eq(classroomVacancy.classroomId, classroomId),
            gte(classroomVacancy.date, startDate),
            lte(classroomVacancy.date, endDate),
          ),
        )
        .orderBy(classroomVacancy.date, classroomVacancy.startTime),

      db
        .select({
          id: classroomBorrowing.id,
          classroomId: classroomBorrowing.classroomId,
          classroomName: classroom.name,
          buildingId: classroom.buildingId,
          buildingName: building.name,
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
        .innerJoin(classroom, eq(classroomBorrowing.classroomId, classroom.id))
        .innerJoin(building, eq(classroom.buildingId, building.id))
        .where(
          and(
            eq(classroomBorrowing.classroomId, classroomId),
            gte(classroomBorrowing.date, startDate),
            lte(classroomBorrowing.date, endDate),
          ),
        )
        .orderBy(classroomBorrowing.date, classroomBorrowing.startTime),
    ]);

    const results: FinalClassroomSchedule[] = [];
    let current = new Date(startDate);

    while (current <= endDate) {
      const day = current.getDay();

      TIME_ENTRIES.slice(0, -1).forEach(([time]) => {
        const initial = initialSchedule.find(
          (s) => s.startTime === time && s.day === day,
        );
        const vacancy = vacancies.find(
          (v) =>
            v.startTime === time &&
            v.date.toDateString() === current.toDateString(),
        );
        const borrowing = borrowings.find(
          (b) =>
            b.startTime === time &&
            b.date.toDateString() === current.toDateString(),
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
            classroomName: "classroomNameFiller",
            buildingId: "buildingIdFiller",
            buildingName: "buildingNameFiller",
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

      const nextDay = new Date(current);
      nextDay.setDate(nextDay.getDate() + 1);
      current = nextDay;
    }

    return results;
  } catch (error) {
    console.log("Failed to get weekly classroom schedule:", error);
    throw new Error("Could not get weekly classroom schedule");
  }
};

export const getWeeklyInitialClassroomSchedule = async (
  classroomId: string,
) => {
  try {
    const rows = await db
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
      .where(eq(classroomSchedule.classroomId, classroomId))
      .orderBy(classroomSchedule.day, classroomSchedule.startTime);

    const results: InitialClassroomSchedule[] = [];

    // Loop over days (Mon–Sat)
    for (let day = 1; day <= 6; day++) {
      TIME_ENTRIES.slice(0, -1).forEach(([time]) => {
        const schedule = rows.find(
          (s) => s.startTime === time && s.day === day,
        );

        if (schedule) {
          const { startTime, endTime, ...rest } = schedule;
          results.push({
            startTime: toTimeInt(startTime),
            endTime: toTimeInt(endTime),
            ...rest,
          });
        } else {
          results.push({
            id: null,
            classroomId,
            facultyId: null,
            facultyName: null,
            subject: null,
            section: null,
            day,
            startTime: time,
            endTime: toTimeInt(time + TIME_INTERVAL),
          });
        }
      });
    }

    return results;
  } catch (error) {
    console.log("Failed to get weekly initial classroom schedule:", error);
    throw new Error("Could not get weekly initial classroom schedule");
  }
};

export const getProfessorSchedulesForDate = async (
  professorId: string,
  date: Date,
): Promise<FinalClassroomSchedule[]> => {
  try {
    const systemDay = date.getDay();

    const initialSchedules = await db
      .select({
        id: classroomSchedule.id,
        classroomId: classroomSchedule.classroomId,
        classroomName: classroom.name,
        buildingId: classroom.buildingId,
        buildingName: building.name,
        facultyId: classroomSchedule.facultyId,
        facultyName: user.name,
        startTime: classroomSchedule.startTime,
        endTime: classroomSchedule.endTime,
        subject: classroomSchedule.subject,
        section: classroomSchedule.section,
      })
      .from(classroomSchedule)
      .leftJoin(user, eq(classroomSchedule.facultyId, user.id))
      .innerJoin(classroom, eq(classroomSchedule.classroomId, classroom.id))
      .innerJoin(building, eq(classroom.buildingId, building.id))
      .where(
        and(
          eq(classroomSchedule.facultyId, professorId),
          eq(classroomSchedule.day, systemDay),
        ),
      )
      .orderBy(classroomSchedule.startTime);

    const borrowings = await db
      .select({
        id: classroomBorrowing.id,
        classroomId: classroomBorrowing.classroomId,
        classroomName: classroom.name,
        buildingId: classroom.buildingId,
        buildingName: building.name,
        facultyId: classroomBorrowing.facultyId,
        facultyName: user.name,
        startTime: classroomBorrowing.startTime,
        endTime: classroomBorrowing.endTime,
        subject: classroomBorrowing.subject,
        section: classroomBorrowing.section,
      })
      .from(classroomBorrowing)
      .leftJoin(user, eq(classroomBorrowing.facultyId, user.id))
      .innerJoin(classroom, eq(classroomBorrowing.classroomId, classroom.id))
      .innerJoin(building, eq(classroom.buildingId, building.id))
      .where(
        and(
          eq(classroomBorrowing.facultyId, professorId),
          eq(classroomBorrowing.date, date),
        ),
      )
      .orderBy(classroomBorrowing.startTime);

    //  If there are initial schedules, fetch vacancies that could override them.
    //  We only need vacancies for the classrooms present in initialSchedules.
    const initialClassroomIds = Array.from(
      new Set(initialSchedules.map((s) => s.classroomId)),
    );

    let vacancies: {
      classroomId: string;
      startTime: number;
      endTime: number;
      date: Date;
    }[] = [];

    if (initialClassroomIds.length > 0) {
      vacancies = await db
        .select({
          classroomId: classroomVacancy.classroomId,
          startTime: classroomVacancy.startTime,
          endTime: classroomVacancy.endTime,
          date: classroomVacancy.date,
        })
        .from(classroomVacancy)
        .where(
          and(
            inArray(classroomVacancy.classroomId, initialClassroomIds),
            eq(classroomVacancy.date, date),
          ),
        );
    }

    // 4) Build results:
    const results: FinalClassroomSchedule[] = [];

    // Add borrowings first (always included)
    for (const b of borrowings) {
      results.push({
        id: b.id,
        classroomId: b.classroomId,
        classroomName: b.classroomName,
        buildingId: b.buildingId,
        buildingName: b.buildingName,
        facultyId: b.facultyId ?? null,
        facultyName: b.facultyName ?? null,
        subject: b.subject ?? null,
        section: b.section ?? null,
        date: new Date(date), // clone
        startTime: toTimeInt(b.startTime),
        endTime: toTimeInt(b.endTime),
        source: "Borrowing",
      });
    }

    // Add initial schedules only if NOT overridden by a vacancy for that classroom/date/time
    for (const s of initialSchedules) {
      const isOverriddenByVacancy = vacancies.some(
        (v) =>
          v.classroomId === s.classroomId &&
          v.startTime <= s.startTime &&
          v.endTime >= s.endTime,
      );

      // If vacancy fully covers (or overlaps) this initial schedule block, skip it.
      if (isOverriddenByVacancy) continue;

      results.push({
        id: s.id,
        classroomId: s.classroomId,
        classroomName: s.classroomName,
        buildingId: s.buildingId,
        buildingName: s.buildingName,
        facultyId: s.facultyId ?? null,
        facultyName: s.facultyName ?? null,
        subject: s.subject ?? null,
        section: s.section ?? null,
        date: new Date(date),
        startTime: toTimeInt(s.startTime),
        endTime: toTimeInt(s.endTime),
        source: "Initial Schedule",
      });
    }

    // 5) Sort results by startTime ascending
    results.sort((a, b) => a.startTime - b.startTime);

    return results;
  } catch (error) {
    console.error("Failed to fetch professor schedules for date:", error);
    throw new Error("Could not get professor schedules for date");
  }
};

/*
 *** Conflicts
 */
export const getClassroomScheduleConflicts = async (
  newSchedule: ClassroomScheduleWithoutId,
  startTimes: TimeInt[],
) => {
  try {
    return await db
      .select()
      .from(classroomSchedule)
      .where(
        and(
          eq(classroomSchedule.day, newSchedule.day),
          eq(classroomSchedule.classroomId, newSchedule.classroomId),
          inArray(classroomSchedule.startTime, startTimes),
        ),
      );
  } catch (error) {
    console.log("Failed to get classroom schedule conflicts:", error);
    throw new Error("Could not get classroom schedule conflicts");
  }
};

export const getClassroomVacancyConflicts = async (
  newVacancy: ClassroomVacancyWithoutId,
  startTimes: TimeInt[],
) => {
  try {
    return await db
      .select()
      .from(classroomVacancy)
      .where(
        and(
          eq(classroomVacancy.date, newVacancy.date),
          eq(classroomVacancy.classroomId, newVacancy.classroomId),
          inArray(classroomVacancy.startTime, startTimes),
        ),
      );
  } catch (error) {
    console.log("Failed to get classroom vacancy conflicts:", error);
    throw new Error("Could not get classroom vacancy conflicts");
  }
};
export const getClassroomBorrowingConflicts = async (
  newBorrowing: ClassroomBorrowingWithoutId,
  startTimes: TimeInt[],
) => {
  try {
    return await db
      .select()
      .from(classroomBorrowing)
      .where(
        and(
          eq(classroomBorrowing.date, newBorrowing.date),
          eq(classroomBorrowing.classroomId, newBorrowing.classroomId),
          inArray(classroomBorrowing.startTime, startTimes),
        ),
      );
  } catch (error) {
    console.log("Failed to get classroom vacancy conflicts:", error);
    throw new Error("Could not get classroom vacancy conflicts");
  }
};

/*
 *** available classrooms
 */
export const getAvailableClassrooms = async (
  date: Date,
  startTime: number,
  endTime: number,
  filters?: { buildingId?: string; type?: ClassroomType },
) => {
  try {
    // 1️⃣ Fetch all classrooms (with filters)
    const classrooms = await db
      .select({
        classroomId: classroom.id,
        classroomName: classroom.name,
        buildingId: classroom.buildingId,
        type: classroom.type,
        capacity: classroom.capacity,
        floor: classroom.floor,
      })
      .from(classroom)
      .where(
        and(
          filters?.buildingId
            ? eq(classroom.buildingId, filters.buildingId)
            : undefined,
          filters?.type ? eq(classroom.type, filters.type) : undefined,
        ),
      );

    if (!classrooms.length) return [];

    const classroomIds = classrooms.map((c) => c.classroomId);
    const systemDay = date.getDay(); // 1–6 only, no Sundays

    // 2️⃣ Bulk fetch all related schedule data

    // Initial schedules
    const initialSchedules = await db
      .select({
        classroomId: classroomSchedule.classroomId,
        day: classroomSchedule.day,
        startTime: classroomSchedule.startTime,
        endTime: classroomSchedule.endTime,
      })
      .from(classroomSchedule)
      .where(
        and(
          inArray(classroomSchedule.classroomId, classroomIds),
          eq(classroomSchedule.day, systemDay),
        ),
      );

    // Vacancies
    const vacancies = await db
      .select({
        classroomId: classroomVacancy.classroomId,
        date: classroomVacancy.date,
        startTime: classroomVacancy.startTime,
        endTime: classroomVacancy.endTime,
      })
      .from(classroomVacancy)
      .where(
        and(
          inArray(classroomVacancy.classroomId, classroomIds),
          eq(classroomVacancy.date, date),
        ),
      );

    // Borrowings
    const borrowings = await db
      .select({
        classroomId: classroomBorrowing.classroomId,
        date: classroomBorrowing.date,
        startTime: classroomBorrowing.startTime,
        endTime: classroomBorrowing.endTime,
      })
      .from(classroomBorrowing)
      .where(
        and(
          inArray(classroomBorrowing.classroomId, classroomIds),
          eq(classroomBorrowing.date, date),
        ),
      );

    // 3️⃣ Prepare 30-minute blocks
    const timeBlocks: { start: number; end: number }[] = [];
    for (let t = startTime; t < endTime; t += TIME_INTERVAL) {
      timeBlocks.push({ start: t, end: t + TIME_INTERVAL });
    }

    const availableClassrooms: {
      classroomId: string;
      classroomName: string;
      buildingId: string;
      buildingName: string;
      type: string;
      capacity: number;
      floor: string;
    }[] = [];

    // Preload building names
    const buildings = await db.select().from(building);
    const buildingMap = new Map(buildings.map((b) => [b.id, b.name]));

    // 4️⃣ Check each room across all blocks
    for (const room of classrooms) {
      let isAvailable = true;

      for (const block of timeBlocks) {
        const { start, end } = block;

        // Borrowing check (highest priority, treated as OCCUPIED)
        const borrowed = borrowings.some(
          (b) =>
            b.classroomId === room.classroomId &&
            b.startTime < end &&
            b.endTime > start,
        );
        if (borrowed) {
          isAvailable = false;
          break;
        }

        // Vacancy check (treated as AVAILABLE, overrides schedule)
        const vacated = vacancies.some(
          (v) =>
            v.classroomId === room.classroomId &&
            v.startTime < end &&
            v.endTime > start,
        );
        if (vacated) {
          continue;
        }

        // Initial schedule check (treated as OCCUPIED if no vacancy overrides it)
        const scheduled = initialSchedules.some(
          (s) =>
            s.classroomId === room.classroomId &&
            s.startTime < end &&
            s.endTime > start,
        );
        if (scheduled) {
          isAvailable = false;
          break;
        }

        // Otherwise unoccupied => AVAILABLE, continue
      }

      if (isAvailable) {
        availableClassrooms.push({
          classroomId: room.classroomId,
          classroomName: room.classroomName,
          buildingId: room.buildingId,
          buildingName: buildingMap.get(room.buildingId) ?? "",
          type: room.type,
          capacity: room.capacity,
          floor: room.floor,
        });
      }
    }

    type GroupedAvailable = {
      buildingId: string;
      buildingName: string;
      classrooms: {
        classroomId: string;
        classroomName: string;
        type: string;
        capacity: number;
        floor: string;
      }[];
    };

    const groups = new Map<string, GroupedAvailable>();

    for (const room of availableClassrooms) {
      if (!groups.has(room.buildingId)) {
        groups.set(room.buildingId, {
          buildingId: room.buildingId,
          buildingName: room.buildingName,
          classrooms: [],
        });
      }

      const group = groups.get(room.buildingId); // safe because we just set it
      if (!group) continue; // should never happen
      group.classrooms.push({
        classroomId: room.classroomId,
        classroomName: room.classroomName,
        type: room.type,
        capacity: room.capacity,
        floor: room.floor,
      });
    }

    // (optional) sort classrooms by name, buildings by name
    for (const g of groups.values()) {
      g.classrooms.sort((a, b) =>
        a.classroomName.localeCompare(b.classroomName),
      );
    }
    const grouped: GroupedAvailable[] = Array.from(groups.values()).sort(
      (a, b) => a.buildingName.localeCompare(b.buildingName),
    );

    return grouped;
  } catch (error) {
    console.error("Failed to get available classrooms:", error);
    throw new Error("Could not fetch available classrooms");
  }
};

type GroupedCurrentAvailable = {
  buildingId: string;
  buildingName: string;
  classrooms: {
    classroomId: string;
    classroomName: string;
    type: string;
    capacity: number;
    floor: string;
    availableFrom: number;
    availableUntil: number;
  }[];
};

export const getCurrentlyAvailableClassrooms = async (
  date: Date,
  startBlock: number,
) => {
  try {
    // 1️⃣ Fetch all classrooms (no filters)
    const classrooms = await db
      .select({
        classroomId: classroom.id,
        classroomName: classroom.name,
        buildingId: classroom.buildingId,
        type: classroom.type,
        capacity: classroom.capacity,
        floor: classroom.floor,
      })
      .from(classroom);

    if (!classrooms.length) return [];

    const classroomIds = classrooms.map((c) => c.classroomId);
    const systemDay = date.getDay();

    // 2️⃣ Fetch related schedule data
    const initialSchedules = await db
      .select({
        classroomId: classroomSchedule.classroomId,
        day: classroomSchedule.day,
        startTime: classroomSchedule.startTime,
        endTime: classroomSchedule.endTime,
      })
      .from(classroomSchedule)
      .where(
        and(
          inArray(classroomSchedule.classroomId, classroomIds),
          eq(classroomSchedule.day, systemDay),
        ),
      );

    const vacancies = await db
      .select({
        classroomId: classroomVacancy.classroomId,
        date: classroomVacancy.date,
        startTime: classroomVacancy.startTime,
        endTime: classroomVacancy.endTime,
      })
      .from(classroomVacancy)
      .where(
        and(
          inArray(classroomVacancy.classroomId, classroomIds),
          eq(classroomVacancy.date, date),
        ),
      );

    const borrowings = await db
      .select({
        classroomId: classroomBorrowing.classroomId,
        date: classroomBorrowing.date,
        startTime: classroomBorrowing.startTime,
        endTime: classroomBorrowing.endTime,
      })
      .from(classroomBorrowing)
      .where(
        and(
          inArray(classroomBorrowing.classroomId, classroomIds),
          eq(classroomBorrowing.date, date),
        ),
      );

    // ✅ 3️⃣ Create time blocks ONLY from startBlock → 2050
    const TIME_INTERVAL = 50;
    const FINAL_BLOCK = 2050;
    const timeBlocks: { start: number; end: number }[] = [];

    for (let t = startBlock; t <= FINAL_BLOCK; t += TIME_INTERVAL) {
      timeBlocks.push({ start: t, end: t + TIME_INTERVAL });
    }

    // ✅ Preload building names
    const buildings = await db.select().from(building);
    const buildingMap = new Map(buildings.map((b) => [b.id, b.name]));

    type AvailableRoom = {
      classroomId: string;
      classroomName: string;
      buildingId: string;
      buildingName: string;
      type: string;
      capacity: number;
      floor: string;
      availableFrom: number;
      availableUntil: number;
    };

    const result: AvailableRoom[] = [];

    // ✅ 4️⃣ Process each room
    for (const room of classrooms) {
      // Check the FIRST block is available
      const firstBlock = timeBlocks[0];
      if (!firstBlock) continue;
      const { start: blockStart } = firstBlock;

      // Borrowing check
      const borrowed = borrowings.some(
        (b) =>
          b.classroomId === room.classroomId &&
          b.startTime < blockStart + TIME_INTERVAL &&
          b.endTime > blockStart,
      );
      if (borrowed) continue;

      // Vacancy check
      const vacated = vacancies.some(
        (v) =>
          v.classroomId === room.classroomId &&
          v.startTime < blockStart + TIME_INTERVAL &&
          v.endTime > blockStart,
      );
      if (!vacated) {
        const scheduled = initialSchedules.some(
          (s) =>
            s.classroomId === room.classroomId &&
            s.startTime < blockStart + TIME_INTERVAL &&
            s.endTime > blockStart,
        );
        if (scheduled) continue;
      }

      // ✅ First block is free → extend availability forward
      let availableUntil = blockStart + TIME_INTERVAL;
      for (let i = 1; i < timeBlocks.length; i++) {
        const nextBlock = timeBlocks[i];
        if (!nextBlock) break; // safety guard
        const { start, end } = nextBlock;

        const blockedBorrow = borrowings.some(
          (b) =>
            b.classroomId === room.classroomId &&
            b.startTime < end &&
            b.endTime > start,
        );
        if (blockedBorrow) break;

        const isVacant = vacancies.some(
          (v) =>
            v.classroomId === room.classroomId &&
            v.startTime < end &&
            v.endTime > start,
        );
        if (!isVacant) {
          const isScheduled = initialSchedules.some(
            (s) =>
              s.classroomId === room.classroomId &&
              s.startTime < end &&
              s.endTime > start,
          );
          if (isScheduled) break;
        }

        availableUntil = end;
      }

      result.push({
        classroomId: room.classroomId,
        classroomName: room.classroomName,
        buildingId: room.buildingId,
        buildingName: buildingMap.get(room.buildingId) ?? "",
        type: room.type,
        capacity: room.capacity,
        floor: room.floor,
        availableFrom: blockStart,
        availableUntil,
      });
    }

    // ✅ Group per building
    const groupedResult: GroupedCurrentAvailable[] = Object.values(
      result.reduce((acc: Record<string, GroupedCurrentAvailable>, room) => {
        let group = acc[room.buildingId];

        if (!group) {
          group = {
            buildingId: room.buildingId,
            buildingName: room.buildingName,
            classrooms: [],
          };
          acc[room.buildingId] = group;
        }

        group.classrooms.push({
          classroomId: room.classroomId,
          classroomName: room.classroomName,
          type: room.type,
          capacity: room.capacity,
          floor: room.floor,
          availableFrom: room.availableFrom,
          availableUntil: room.availableUntil,
        });

        return acc;
      }, {}),
    );

    return groupedResult;
  } catch (error) {
    console.error("Failed to get currently available classrooms:", error);
    throw new Error("Could not fetch current availability");
  }
};

export async function getRoomRequestStatsPerDepartment() {
  const now = new Date();

  // Start of current month
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);

  // Start of next month (exclusive upper bound)
  const nextMonthStart = new Date(
    now.getFullYear(),
    now.getMonth() + 1,
    1,
    0,
    0,
    0,
    0,
  );

  const results = await db
    .select({
      department: user.departmentOrOrganization,
      count: sql<number>`COUNT(*)`,
    })
    .from(roomRequests)
    .innerJoin(user, eq(roomRequests.requesterId, user.id))
    .where(
      and(
        gte(roomRequests.date, monthStart),
        lte(roomRequests.date, nextMonthStart),
      ),
    )
    .groupBy(user.departmentOrOrganization);

  // Filter out null departments (if any users didn't have one)
  return results
    .filter((r) => r.department !== null)
    .map((r) => ({
      department: r.department,
      requests: r.count,
    }))
    .sort((a, b) => b.requests - a.requests); // Optional: sort descending
}

export async function getRoomRequestStatsPerClassroomType() {
  const now = new Date();

  // Start of current month
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);

  // Start of next month (exclusive upper bound)
  const nextMonthStart = new Date(
    now.getFullYear(),
    now.getMonth() + 1,
    1,
    0,
    0,
    0,
    0,
  );

  const results = await db
    .select({
      classroomType: classroom.type,
      count: sql<number>`COUNT(*)`,
    })
    .from(roomRequests)
    .innerJoin(classroom, eq(roomRequests.classroomId, classroom.id))
    .where(
      and(
        gte(roomRequests.date, monthStart),
        lte(roomRequests.date, nextMonthStart),
      ),
    )
    .groupBy(classroom.type);

  // Filter out null departments (if any users didn't have one)
  return results
    .filter((r) => r.classroomType !== null)
    .map((r) => ({
      classroomType: r.classroomType,
      requests: r.count,
    }))
    .sort((a, b) => b.requests - a.requests); // Optional: sort descending
}
