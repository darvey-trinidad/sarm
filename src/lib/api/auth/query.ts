import { db, inArray, and, eq } from "@/server/db";
import { user } from "@/server/db/schema/auth";
import { TEACHING_PERSONNEL } from "@/constants/roles";

export const getAllFaculty = async () => {
  return await db.select().from(user).where(
    and(
      inArray(user.role, [...TEACHING_PERSONNEL]),
      eq(user.isActive, true)
    )
  ).all();
}

export const getAllUsers = async () => {
  return await db.select().from(user).orderBy(user.name).all();
}