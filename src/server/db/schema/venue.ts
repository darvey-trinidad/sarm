import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { user } from "@/server/db/schema/auth";

import { USABILITY } from "@/constants/usability";
import { RESERVATION_STATUS } from "@/constants/reservation-status";

export const venue = sqliteTable("venue", {
  id: text('id').primaryKey(),
  
  name: text('name').notNull(),
  description: text('description'),
  capacity: integer('capacity', { mode: 'number' }),
  
  usability: text('usability', { enum: USABILITY }).default("operational").notNull(),
});

export const venueReservation = sqliteTable("venue_reservation", {
  id: text('id').primaryKey(),

  venueId: text('venue_id').notNull().references(()=> venue.id, { onDelete: 'cascade' }),
  reserverId: text('faculty_id').notNull().references(()=> user.id, { onDelete: 'cascade' }),
  
  date: integer('date', { mode: 'timestamp' }).notNull(),
  startTime: integer('start_time', { mode: 'timestamp' }).notNull(),
  endTime: integer('end_time', { mode: 'timestamp' }).notNull(),
  purpose: text('purpose').notNull(),
  status: text('status', { enum: RESERVATION_STATUS }).notNull(),

  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()).notNull(),
});