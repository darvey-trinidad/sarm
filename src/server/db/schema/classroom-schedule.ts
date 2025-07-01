import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { classroom } from "@/server/db/schema/classroom";
import { user } from "@/server/db/schema/auth";
import { DAYS } from "@/constants/days";

export const classroomSchedule = sqliteTable("classroom_schedule", {
  id: text('id').primaryKey(),
  classroomId: text('classroom_id').notNull().references(()=> classroom.id, { onDelete: 'cascade' }),
  facultyId: text('faculty_id').notNull().references(()=> user.id, { onDelete: 'cascade' }),

  day: text('day', { enum: DAYS }).notNull(),
  startTime: integer('start_time', { mode: 'timestamp' }).notNull(),
  endTime: integer('end_time', { mode: 'timestamp' }).notNull(),
  subject: text('subject').notNull(),
  section: text('section').notNull(),
});

export const classroomVacancy = sqliteTable("classroom_vacancy", {
  id: text('id').primaryKey(),
  classroomId: text('classroom_id').notNull().references(()=> classroom.id, { onDelete: 'cascade' }),

  date: integer('date', { mode: 'timestamp' }).notNull(),
  startTime: integer('start_time', { mode: 'timestamp' }).notNull(),
  endTime: integer('end_time', { mode: 'timestamp' }).notNull(),
  reason: text('reason'),
});

export const classroomBorrowing = sqliteTable("classroom_borrowing", {
  id: text('id').primaryKey(),
  classroomId: text('classroom_id').notNull().references(()=> classroom.id, { onDelete: 'cascade' }),
  facultyId: text('faculty_id').notNull().references(()=> user.id, { onDelete: 'cascade' }),

  date: integer('date', { mode: 'timestamp' }).notNull(),
  startTime: integer('start_time', { mode: 'timestamp' }).notNull(),
  endTime: integer('end_time', { mode: 'timestamp' }).notNull(),
  subject: text('subject'),
  section: text('section'),
});