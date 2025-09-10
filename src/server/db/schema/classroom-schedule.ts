import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { classroom } from "@/server/db/schema/classroom";
import { user } from "@/server/db/schema/auth";
import { ROOM_REQUEST_STATUS, DEFAULT_ROOM_REQUEST_STATUS } from "@/constants/room-request-status";

export const classroomSchedule = sqliteTable("classroom_schedule", {
  id: text('id').primaryKey(),
  classroomId: text('classroom_id').notNull().references(() => classroom.id, { onDelete: 'cascade' }),
  facultyId: text('faculty_id').notNull().references(() => user.id, { onDelete: 'cascade' }),

  day: integer('day').notNull(),
  startTime: integer('start_time').notNull(),
  endTime: integer('end_time').notNull(),
  subject: text('subject').notNull(),
  section: text('section').notNull(),
});

export const classroomVacancy = sqliteTable("classroom_vacancy", {
  id: text('id').primaryKey(),
  classroomId: text('classroom_id').notNull().references(() => classroom.id, { onDelete: 'cascade' }),

  date: integer('date', { mode: 'timestamp' }).notNull(),
  startTime: integer('start_time').notNull(),
  endTime: integer('end_time').notNull(),
  reason: text('reason'),
});

export const classroomBorrowing = sqliteTable("classroom_borrowing", {
  id: text('id').primaryKey(),
  classroomId: text('classroom_id').notNull().references(() => classroom.id, { onDelete: 'cascade' }),
  facultyId: text('faculty_id').notNull().references(() => user.id, { onDelete: 'cascade' }),

  date: integer('date', { mode: 'timestamp' }).notNull(),
  startTime: integer('start_time').notNull(),
  endTime: integer('end_time').notNull(),
  subject: text('subject'),
  section: text('section'),
});

export const roomRequests = sqliteTable("room_requests", {
  id: text("id").primaryKey(),
  classroomId: text("classroom_id").references(() => classroom.id).notNull(),

  date: integer("date", { mode: "timestamp" }).notNull(),
  startTime: integer("start_time").notNull(),
  endTime: integer("end_time").notNull(),
  subject: text("subject").notNull(),
  section: text("section").notNull(),

  requesterId: text("requester_id").references(() => user.id).notNull(), // the prof with no room
  responderId: integer("responder_id").references(() => user.id).notNull(), // who needs to respond (the current room owner)

  status: text("status", { enum: ROOM_REQUEST_STATUS }).$defaultFn(() => DEFAULT_ROOM_REQUEST_STATUS).notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()).notNull(),
  respondedAt: integer("responded_at", { mode: "timestamp" }),
});