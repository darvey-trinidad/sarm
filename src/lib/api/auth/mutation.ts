import type { Roles } from "@/constants/roles";
import { db, eq } from "@/server/db";
import { user } from "@/server/db/schema/auth";
import type { UpdateUser } from "@/server/db/types/auth";
import { TRPCError } from "@trpc/server";

export const toggleUserIsActive = async (id: string, isActive: boolean) => {
  try {
    return await db.update(user).set({ isActive }).where(eq(user.id, id)).run();
  } catch (error) {
    throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Could not update user status" });
  }
};

export const editUserProfile = async (id: string, data: UpdateUser) => {
  try {
    if (data.name?.length === 0) data.name = undefined;
    if (data.departmentOrOrganization?.length === 0) data.departmentOrOrganization = undefined;

    if (data.name === undefined && data.departmentOrOrganization === undefined) {
      return; // nothing to update
    }

    await db.update(user)
      .set(data)
      .where(eq(user.id, id))
      .run();

  } catch (error) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Could not update user",
    });
  }
};

export const editUserRole = async (id: string, role: Roles) => {
  try {
    return await db.update(user).set({ role }).where(eq(user.id, id)).returning().get();
  } catch (error) {
    throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Could not update user role" });
  }
};