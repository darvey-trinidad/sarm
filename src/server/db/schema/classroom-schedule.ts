import { sqliteTable, text, integer, index } from "drizzle-orm/sqlite-core";
import { classroom } from "@/server/db/schema/classroom";
import { user } from "@/server/db/schema/auth";
import { ROOM_REQUEST_STATUS, DEFAULT_ROOM_REQUEST_STATUS } from "@/constants/room-request-status";
import { DEPARTMENTS } from "@/constants/dept-org";

export const classroomSchedule = sqliteTable("classroom_schedule", {
  id: text('id').primaryKey(),
  classroomId: text('classroom_id').notNull().references(() => classroom.id, { onDelete: 'cascade' }),
  facultyId: text('faculty_id').notNull().references(() => user.id, { onDelete: 'cascade' }),

  day: integer('day').notNull(),
  startTime: integer('start_time').notNull(),
  endTime: integer('end_time').notNull(),
  subject: text('subject').notNull(),
  section: text('section').notNull(),
}, (table) => ({
  classroomDayIdx: index("schedule_classroom_day_idx").on(table.classroomId, table.day),
  facultyDayIdx: index("schedule_faculty_day_idx").on(table.facultyId, table.day),
}));

export const classroomVacancy = sqliteTable("classroom_vacancy", {
  id: text('id').primaryKey(),
  classroomId: text('classroom_id').notNull().references(() => classroom.id, { onDelete: 'cascade' }),

  date: integer('date', { mode: 'timestamp' }).notNull(),
  startTime: integer('start_time').notNull(),
  endTime: integer('end_time').notNull(),
  reason: text('reason'),
}, (table) => ({
  classroomDateIdx: index("vacancy_classroom_date_idx").on(table.classroomId, table.date),
}));

export const classroomBorrowing = sqliteTable("classroom_borrowing", {
  id: text('id').primaryKey(),
  classroomId: text('classroom_id').notNull().references(() => classroom.id, { onDelete: 'cascade' }),
  facultyId: text('faculty_id').notNull().references(() => user.id, { onDelete: 'cascade' }),

  date: integer('date', { mode: 'timestamp' }).notNull(),
  startTime: integer('start_time').notNull(),
  endTime: integer('end_time').notNull(),
  subject: text('subject'),
  section: text('section'),
  details: text('details'),
}, (table) => ({
  classroomDateIdx: index("borrowing_classroom_date_idx").on(table.classroomId, table.date),
  facultyDateIdx: index("borrowing_faculty_date_idx").on(table.facultyId, table.date),
}));

export const roomRequests = sqliteTable("room_requests", {
  id: text("id").primaryKey(),
  classroomId: text("classroom_id").references(() => classroom.id).notNull(),

  date: integer("date", { mode: "timestamp" }).notNull(),
  startTime: integer("start_time").notNull(),
  endTime: integer("end_time").notNull(),
  subject: text("subject").notNull(),
  section: text("section").notNull(),

  requesterId: text("requester_id").references(() => user.id).notNull(), // the prof with no room
  responderId: text("responder_id").references(() => user.id).notNull(), // who needs to respond (the current room owner)

  departmentRequestedTo: text("department_requested_to", { enum: DEPARTMENTS }), // department the room belongs to, if requester is from different dept
  fileUrl: text("file_url"),
  details: text("details"),

  status: text("status", { enum: ROOM_REQUEST_STATUS }).$defaultFn(() => DEFAULT_ROOM_REQUEST_STATUS).notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()).notNull(),
  respondedAt: integer("responded_at", { mode: "timestamp" }),
}, (table) => ({
  classroomIdx: index("room_req_classroom_idx").on(table.classroomId),
  requesterIdx: index("room_req_requester_idx").on(table.requesterId),
  responderStatusDateIdx: index("room_req_responder_status_date_idx")
    .on(table.responderId, table.status, table.date),
  dateIdx: index("room_req_date_idx").on(table.date),
}));