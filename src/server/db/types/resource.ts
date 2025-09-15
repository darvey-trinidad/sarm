import { type InferInsertModel, type InferSelectModel } from "drizzle-orm";
import { resource } from "@/server/db/schema/resource";

export type Resource = InferSelectModel<typeof resource>;
export type NewResource = InferInsertModel<typeof resource>;