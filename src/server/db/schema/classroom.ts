import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { CLASSROOM_TYPE } from "@/constants/classroom-type";

export const building = sqliteTable("building", {
  id: text('id').primaryKey(),
  
  name: text('name').notNull(),
  description: text('description'),
});

export const classroom = sqliteTable("classroom", {
  id: text('id').primaryKey(),
  buildingId: text('building_id').notNull().references(()=> building.id, { onDelete: 'cascade' }),

  name: text('name').notNull(),
  type: text('type', { enum: CLASSROOM_TYPE}).notNull(),
  capacity: integer('capacity', { mode: 'number' }).notNull(),
  
  usability: text('usability', { enum: ["operational", "non-operational"]}).default("operational").notNull(),
});