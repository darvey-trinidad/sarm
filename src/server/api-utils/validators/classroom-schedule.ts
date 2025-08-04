import { z } from "zod";
import { timeIntSchema } from "@/constants/timeslot";
import { requiredDateSchema } from "@/server/api-utils/validators/date";

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
  date: requiredDateSchema(),
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

export const createClassroomBorrowingSchema = z.object({
  classroomId: z.string(),
  facultyId: z.string(),

  date: requiredDateSchema(),
  startTime: timeIntSchema,
  endTime: timeIntSchema,
  subject: z.string().optional().nullable(),
  section: z.string().optional().nullable(),
});

export type CreateClassroomScheduleInput = z.infer<typeof createClassroomScheduleSchema>;
export type CreateClassroomVacancyInput = z.infer<typeof createClassroomVacancySchema>;
export type CreateClassroomBorrowingInput = z.infer<typeof createClassroomBorrowingSchema>;