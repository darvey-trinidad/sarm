import { type InferInsertModel } from "drizzle-orm";
import { user } from "@/server/db/schema/auth";

export type User = InferInsertModel<typeof user>;
export type UpdateUser = Partial<Omit<User, "id" | "email" | "emailVerified" | "createdAt" | "updatedAt" | "isActive" | "role">>;