import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { user } from "@/server/db/schema/auth";
import { REPORT_CATEGORY } from "@/constants/report-category";
import { REPORT_STATUS, DEFAULT_REPORT_STATUS } from "@/constants/report-status";
import { building, classroom } from "@/server/db/schema/classroom";

export const facilityIssueReport = sqliteTable("facility_issue_report", {
  id: text('id').primaryKey(),
  reportedBy: text('reported_by').notNull().references(() => user.id, { onDelete: 'cascade' }),

  category: text('category', { enum: REPORT_CATEGORY }).notNull(),

  buildingId: text('building_id').references(() => building.id, { onDelete: 'cascade' }),
  classroomId: text('classroom_id').references(() => classroom.id, { onDelete: 'cascade' }),
  location: text('location').notNull(),

  description: text('description').notNull(),
  details: text('details'),
  status: text('status', { enum: REPORT_STATUS }).notNull().default(DEFAULT_REPORT_STATUS),
  imageUrl: text('image_url'),

  dateReported: integer('date_reported', { mode: 'timestamp' }).$defaultFn(() => new Date()).notNull(),
  dateUpdated: integer('date_updated', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});