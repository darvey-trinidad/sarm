import { z } from "zod";
import { timeIntSchema } from "@/constants/timeslot";

export const createClassroomScheduleSchema = z.object({
  classroomId: z.string(),
  facultyId: z.string(),

  day: z.number(),
  startTime: timeIntSchema,
  endTime: timeIntSchema,

  subject: z.string(),
  section: z.string(),
}).refine(
  (data) => {
    return data.endTime > data.startTime;
  },
  {
    message: "End time must be later than start time",
    path: ["endTime"],
  }
);

export const createClassroomVacancySchema = z.object({
  classroomId: z.string(),
  date: z.date(),
  startTime: timeIntSchema,
  endTime: timeIntSchema,
  reason: z.string().optional().nullable(),
}).refine(
  (data) => {
    return data.endTime > data.startTime;
  },
  {
    message: "End time must be later than start time",
    path: ["endTime"],
  }
);

export type CreateClassroomScheduleInput = z.infer<typeof createClassroomScheduleSchema>;
export type CreateClassroomVacancyInput = z.infer<typeof createClassroomVacancySchema>;