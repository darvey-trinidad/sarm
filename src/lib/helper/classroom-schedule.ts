import type { TimeInt } from "@/constants/timeslot";
import { generateUUID } from "@/lib/utils";
import type {
  CreateClassroomScheduleInput,
  CreateClassroomVacancyInput,
  CreateClassroomBorrowingInput,
  CancelClassroomBorrowingInput,
  DeleteClassroomScheduleSchemaType,
} from "@/server/api-utils/validators/classroom-schedule";
import type {
  FinalClassroomSchedule,
  InitialClassroomSchedule,
} from "@/types/clasroom-schedule";
import { TIME_INTERVAL } from "@/constants/timeslot";

export function splitScheduleToHourlyTimeslot(
  input: CreateClassroomScheduleInput,
) {
  const chunks = [];

  for (
    let time = input.startTime;
    time < input.endTime;
    time += TIME_INTERVAL
  ) {
    chunks.push({
      id: generateUUID(),
      classroomId: input.classroomId,
      facultyId: input.facultyId,
      day: input.day,
      startTime: time,
      endTime: time + TIME_INTERVAL,
      subject: input.subject,
      section: input.section,
    });
  }
  return chunks;
}

export function splitVacancyToHourlyTimeslot(
  input: CreateClassroomVacancyInput,
) {
  const chunks = [];

  for (
    let time = input.startTime;
    time < input.endTime;
    time += TIME_INTERVAL
  ) {
    chunks.push({
      id: generateUUID(),
      classroomId: input.classroomId,
      date: input.date,
      startTime: time,
      endTime: time + TIME_INTERVAL,
      reason: input.reason,
    });
  }
  return chunks;
}

export const splitBorrowingToHourlyTimeslot = (
  input: CreateClassroomBorrowingInput,
) => {
  const chunks = [];

  for (
    let time = input.startTime;
    time < input.endTime;
    time += TIME_INTERVAL
  ) {
    chunks.push({
      id: generateUUID(),
      ...input,
      startTime: time,
      endTime: time + TIME_INTERVAL,
    });
  }
  return chunks;
};

export const splitTimeToHourlyTimeslot = (
  input: CancelClassroomBorrowingInput,
) => {
  const chunks: CancelClassroomBorrowingInput[] = [];

  for (
    let time = input.startTime;
    time < input.endTime;
    time += TIME_INTERVAL
  ) {
    chunks.push({
      classroomId: input.classroomId,
      date: input.date,
      startTime: time,
      endTime: time + TIME_INTERVAL,
    });
  }
  return chunks;
};

export const splitTimeToHourlyTimeslotSchedule = (
  input: DeleteClassroomScheduleSchemaType,
) => {
  const chunks: DeleteClassroomScheduleSchemaType[] = [];

  for (
    let time = input.startTime;
    time < input.endTime;
    time += TIME_INTERVAL
  ) {
    chunks.push({
      classroomId: input.classroomId,
      day: input.day,
      startTime: time,
      endTime: time + TIME_INTERVAL,
    });
  }
  return chunks;
};

export function mergeAdjacentTimeslots(
  slots: FinalClassroomSchedule[],
): FinalClassroomSchedule[] {
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

export const mergeAdjacentInitialSchedules = (
  schedules: InitialClassroomSchedule[],
) => {
  if (schedules.length === 0) return [];

  const merged: InitialClassroomSchedule[] = [];
  let current = schedules[0]!;

  for (let i = 1; i < schedules.length; i++) {
    const next = schedules[i]!;

    const isAdjacent =
      current.endTime === next.startTime &&
      current.classroomId === next.classroomId &&
      current.facultyId === next.facultyId &&
      current.subject === next.subject &&
      current.section === next.section;

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
};
