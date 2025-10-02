import { db, eq } from "@/server/db";
import { user } from "@/server/db/schema/auth";
import { TRPCError } from "@trpc/server";

export const toggleUserIsActive = async (id: string, isActive: boolean) => {
  try {
    return await db.update(user).set({ isActive }).where(eq(user.id, id)).run();
  } catch (error) {
    throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Could not update user status" });
  }
};