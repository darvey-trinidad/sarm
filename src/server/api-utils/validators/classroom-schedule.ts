import { z } from "zod";
import { timeIntSchema } from "@/constants/timeslot";
import { requiredDateSchema } from "@/server/api-utils/validators/date";
import { ROOM_REQUEST_STATUS } from "@/constants/room-request-status";
import { CLASSROOM_TYPE } from "@/constants/classroom-type";

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

/*
* Queries
*/
export const getClassroomScheduleSchema = z.object({
  classroomId: z.string(),
  date: requiredDateSchema()
});

export const getWeeklyClassroomScheduleSchema = z.object({
  classroomId: z.string(),
  startDate: requiredDateSchema(),
  endDate: requiredDateSchema()
})

export const getAvailableClassroomsSchema = z.object({
  date: requiredDateSchema(),
  startTime: timeIntSchema,
  endTime: timeIntSchema,
  filters: z.object({
    buildingId: z.string().optional(),
    type: z.enum(CLASSROOM_TYPE).optional(),
  }).optional()
})

export const cancelClassroomBorrowingSchema = z.object({
  classroomId: z.string(),
  date: requiredDateSchema(),
  startTime: timeIntSchema,
  endTime: timeIntSchema
});

export const createRoomRequestSchema = z.object({
  classroomId: z.string(),
  date: requiredDateSchema(),
  startTime: timeIntSchema,
  endTime: timeIntSchema,
  subject: z.string(),
  section: z.string(),

  requesterId: z.string(),
  responderId: z.string(),
});

export const respondToRoomRequestSchema = z.object({
  roomRequestId: z.string(),
  status: z.enum(ROOM_REQUEST_STATUS),
})

// classroomId: text("classroom_id").references(() => classroom.id).notNull(),

// date: integer("date", { mode: "timestamp" }).notNull(),
// startTime: integer("start_time").notNull(),
// endTime: integer("end_time").notNull(),
// subject: text("subject").notNull(),
// section: text("section").notNull(),

// requesterId: text("requester_id").references(() => user.id).notNull(), // the prof with no room
// responderId: integer("responder_id").references(() => user.id).notNull(), // who needs to respond (the current room owner)

// status: text("status", { enum: ROOM_REQUEST_STATUS }).$defaultFn(() => DEFAULT_ROOM_REQUEST_STATUS).notNull(),
// createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()).notNull(),
// respondedAt: integer("responded_at", { mode: "timestamp" }),

export type CreateClassroomScheduleInput = z.infer<typeof createClassroomScheduleSchema>;
export type CreateClassroomVacancyInput = z.infer<typeof createClassroomVacancySchema>;
export type CreateClassroomBorrowingInput = z.infer<typeof createClassroomBorrowingSchema>;

export type GetClassroomScheduleInput = z.infer<typeof getClassroomScheduleSchema>;

export type CancelClassroomBorrowingInput = z.infer<typeof cancelClassroomBorrowingSchema>;