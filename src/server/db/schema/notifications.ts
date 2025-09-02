import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { user } from "@/server/db/schema/auth";
import { generateUUID } from "@/lib/utils";

export const pushSubscriptions = sqliteTable("push_subscriptions", {
  id: text("id").primaryKey().$defaultFn(() => generateUUID()),
  userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  endpoint: text("endpoint").notNull(),
  expirationTime: integer("expiration_time"), // nullable
  p256dh: text("p256dh").notNull(),
  auth: text("auth").notNull(),
  createdAt: integer("created_at").$defaultFn(() => Date.now()),
});
