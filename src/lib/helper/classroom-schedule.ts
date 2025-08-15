import { generateUUID } from "@/lib/utils";
import type { CreateClassroomScheduleInput, CreateClassroomVacancyInput, CreateClassroomBorrowingInput } from "@/server/api-utils/validators/classroom-schedule";
import type { FinalClassroomSchedule } from "@/types/clasroom-schedule";

export function splitScheduleToHourlyTimeslot(input: CreateClassroomScheduleInput) {
  const chunks = [];

  for (let time = input.startTime; time < input.endTime; time += 100) {
    chunks.push({
      id: generateUUID(),
      classroomId: input.classroomId,
      facultyId: input.facultyId,
      day: input.day,
      startTime: time,
      endTime: time + 100,
      subject: input.subject,
      section: input.section,
    });
  }
  return chunks;
}

export function splitVacancyToHourlyTimeslot(input: CreateClassroomVacancyInput) {
  const chunks = [];

  for (let time = input.startTime; time < input.endTime; time += 100) {
    chunks.push({
      id: generateUUID(),
      classroomId: input.classroomId,
      date: input.date,
      startTime: time,
      endTime: time + 100,
      reason: input.reason,
    });
  }
  return chunks;
}

export const splitBorrowingToHourlyTimeslot = (input: CreateClassroomBorrowingInput) => {
  const chunks = [];

  for (let time = input.startTime; time < input.endTime; time += 100) {
    chunks.push({
      id: generateUUID(),
      classroomId: input.classroomId,
      facultyId: input.facultyId,
      date: input.date,
      startTime: time,
      endTime: time + 100,
      subject: input.subject,
      section: input.section,
    });
  }
  return chunks;
}

export function mergeAdjacentTimeslots(slots: FinalClassroomSchedule[]): FinalClassroomSchedule[] {
  if (slots.length === 0) return [];

  const merged: FinalClassroomSchedule[] = [];
  let current = slots[0]!;

  for (let i = 1; i < slots.length; i++) {
    const next = slots[i]!;

    const isAdjacent =
      current.endTime === next.startTime &&
      current.classroomId === next.classroomId &&
      current.facultyId === next.facultyId &&
      current.subject === next.subject &&
      current.section === next.section &&
      current.source === next.source;

    if (isAdjacent) {
      // Extend the current block
      current.endTime = next.endTime;
    } else {
      // Push current block and start a new one
      merged.push(current);
      current = { ...next };
    }
  }

  merged.push(current);
  return merged;
}