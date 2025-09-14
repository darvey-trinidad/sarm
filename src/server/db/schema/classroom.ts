import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { CLASSROOM_TYPE } from "@/constants/classroom-type";
import { USABILITY } from "@/constants/usability";
import { DEFAULT_USABILITY } from "@/constants/usability";
import { DEFAULT_FLOOR } from "@/constants/floors";

export const building = sqliteTable("building", {
  id: text('id').primaryKey(),

  name: text('name').notNull(),
  description: text('description'),
});

export const classroom = sqliteTable("classroom", {
  id: text('id').primaryKey(),
  buildingId: text('building_id').notNull().references(() => building.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  type: text('type', { enum: CLASSROOM_TYPE }).notNull(),
  capacity: integer('capacity', { mode: 'number' }).notNull(),
  floor: text('floor').$defaultFn(() => DEFAULT_FLOOR).notNull(),
  usability: text('usability', { enum: USABILITY }).$defaultFn(() => DEFAULT_USABILITY).notNull(),
});