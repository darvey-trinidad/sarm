import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { user } from "@/server/db/schema/auth";

import { RESOURCE_CATEGORY } from "@/constants/resource-category";
import { BORROWING_STATUS, DEFAULT_BORROWING_STATUS } from "@/constants/borrowing-status";
import { venueReservation } from "@/server/db/schema/venue";

export const resource = sqliteTable("resource", {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  category: text('category', { enum: RESOURCE_CATEGORY }).notNull(),
  description: text('description'),
  stock: integer('stock', { mode: 'number' }).$defaultFn(() => 0).notNull(),
});

export const resourceBorrowing = sqliteTable("resource_borrowing", {
  id: text('id').primaryKey(),
  borrowerId: text('borrower_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
  resourceId: text('resource_id').notNull().references(() => resource.id, { onDelete: 'cascade' }),
  venueReservationId: text('venue_reservation_id').references(() => venueReservation.id, { onDelete: 'no action' }),

  purpose: text('purpose').$defaultFn(() => '').notNull(),
  status: text('status', { enum: BORROWING_STATUS }).$defaultFn(() => DEFAULT_BORROWING_STATUS).notNull(),
  representativeBorrower: text('representative_borrower').notNull(),

  startTime: integer('start_time').notNull(),
  endTime: integer('end_time').notNull(),

  fileUrl: text("file_url"),

  dateRequested: integer('date_requested', { mode: 'timestamp' }).$defaultFn(() => new Date()).notNull(),
  dateBorrowed: integer('date_borrowed', { mode: 'timestamp' }),
  dateReturned: integer('date_returned', { mode: 'timestamp' }),
});