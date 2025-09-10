import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { user } from "@/server/db/schema/auth";
import { REPORT_CATEGORY } from "@/constants/report-category";
import { PRIORITY_LEVEL } from "@/constants/priority-level";
import { REPORT_STATUS, DEFAULT_REPORT_STATUS } from "@/constants/report-status";

export const facilityIssueReport = sqliteTable("facility_issue_report", {
  id: text('id').primaryKey(),
  reportedBy: text('reported_by').notNull().references(() => user.id, { onDelete: 'cascade' }),

  category: text('category', { enum: REPORT_CATEGORY }).notNull(),
  priorityLevel: text('priority_level', { enum: PRIORITY_LEVEL }),

  dateReported: integer('date_reported', { mode: 'timestamp' }).$defaultFn(() => new Date()).notNull(),
  location: text('location').notNull(),

  description: text('description').notNull(),
  details: text('details'),
  status: text('status', { enum: REPORT_STATUS }).notNull().default(DEFAULT_REPORT_STATUS),
  dateUpdated: integer('date_updated', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});