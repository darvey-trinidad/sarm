import { generateUUID } from "@/lib/utils";
import type { CreateClassroomScheduleInput, CreateClassroomVacancyInput } from "@/server/api-utils/validators/classroom-schedule";

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
