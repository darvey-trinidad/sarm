import { sqliteTable, text, integer, index } from "drizzle-orm/sqlite-core";
import { user } from "@/server/db/schema/auth";

import { USABILITY, DEFAULT_USABILITY } from "@/constants/usability";
import { RESERVATION_STATUS, DEFAULT_RESERVATION_STATUS } from "@/constants/reservation-status";

export const venue = sqliteTable("venue", {
  id: text('id').primaryKey(),

  name: text('name').notNull(),
  description: text('description'),
  capacity: integer('capacity', { mode: 'number' }),

  usability: text('usability', { enum: USABILITY }).$defaultFn(() => DEFAULT_USABILITY).notNull(),
});

export const venueReservation = sqliteTable("venue_reservation", {
  id: text('id').primaryKey(),

  venueId: text('venue_id').notNull().references(() => venue.id, { onDelete: 'cascade' }),
  reserverId: text('reserver_id').notNull().references(() => user.id, { onDelete: 'cascade' }),

  date: integer('date', { mode: 'timestamp' }).notNull(),
  startTime: integer('start_time').notNull(),
  endTime: integer('end_time').notNull(),
  purpose: text('purpose').notNull(),
  status: text('status', { enum: RESERVATION_STATUS }).$defaultFn(() => DEFAULT_RESERVATION_STATUS).notNull(),

  fileUrl: text("file_url"),

  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
}, (table) => ({
  venueIdx: index("venue_res_venue_idx").on(table.venueId),
  reserverIdx: index("venue_res_reserver_idx").on(table.reserverId),
  statusDateIdx: index("venue_res_status_date_idx").on(table.status, table.date),
  dateIdx: index("venue_res_date_idx").on(table.date),
}));