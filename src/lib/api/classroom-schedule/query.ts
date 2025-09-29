import { db, and, eq, inArray, gte, lte } from "@/server/db";
import { building, classroom } from "@/server/db/schema/classroom";
import { classroomSchedule, classroomVacancy, classroomBorrowing, roomRequests } from "@/server/db/schema/classroom-schedule";
import type { ClassroomScheduleWithoutId, ClassroomVacancyWithoutId, ClassroomBorrowingWithoutId } from "@/server/db/types/classroom-schedule";
import { type TimeInt, TIME_ENTRIES } from "@/constants/timeslot";
import { SCHEDULE_SOURCE } from "@/constants/schedule";
import { TIME_INTERVAL } from "@/constants/timeslot";
import type { FinalClassroomSchedule, InitialClassroomSchedule } from "@/types/clasroom-schedule";
import { user } from "@/server/db/schema/auth";
import { toTimeInt } from "@/lib/utils";
import { alias } from "drizzle-orm/sqlite-core";
import type { ClassroomType } from "@/constants/classroom-type";

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
        status: roomRequests.status,
        createdAt: roomRequests.createdAt,
        respondedAt: roomRequests.respondedAt,
      }
    )
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

export const getWeeklyInitialClassroomSchedule = async (classroomId: string) => {
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
          (s) => s.startTime === time && s.day === day
        );

        if (schedule) {
          const { startTime, endTime, ...rest } = schedule;
          results.push({
            startTime: toTimeInt(startTime),
            endTime: toTimeInt(endTime),
            ...rest
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

/*
*** available classrooms 
*/
export const getAvailableClassrooms = async (
  date: Date,
  startTime: number,
  endTime: number,
  filters?: { buildingId?: string; type?: ClassroomType }
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
          filters?.buildingId ? eq(classroom.buildingId, filters.buildingId) : undefined,
          filters?.type ? eq(classroom.type, filters.type) : undefined
        )
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
          eq(classroomSchedule.day, systemDay)
        )
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
          eq(classroomVacancy.date, date)
        )
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
          eq(classroomBorrowing.date, date)
        )
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
            b.endTime > start
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
            v.endTime > start
        );
        if (vacated) {
          continue;
        }

        // Initial schedule check (treated as OCCUPIED if no vacancy overrides it)
        const scheduled = initialSchedules.some(
          (s) =>
            s.classroomId === room.classroomId &&
            s.startTime < end &&
            s.endTime > start
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
          buildingName: buildingMap.get(room.buildingId) || "",
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
      g.classrooms.sort((a, b) => a.classroomName.localeCompare(b.classroomName));
    }
    const grouped: GroupedAvailable[] = Array.from(groups.values())
      .sort((a, b) => a.buildingName.localeCompare(b.buildingName));

    return grouped;
  } catch (error) {
    console.error("Failed to get available classrooms:", error);
    throw new Error("Could not fetch available classrooms");
  }
};