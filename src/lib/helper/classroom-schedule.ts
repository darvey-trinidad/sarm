import { generateUUID } from "@/lib/utils";
import type { CreateClassroomScheduleInput } from "@/server/api-utils/validators/classroom-schedule";

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

