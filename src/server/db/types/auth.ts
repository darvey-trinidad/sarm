import { type InferInsertModel } from "drizzle-orm";
import { user } from "@/server/db/schema/auth";

export type User = InferInsertModel<typeof user>;
export type UpdateUser = {id: string} & Partial<Omit<User, "id">>;