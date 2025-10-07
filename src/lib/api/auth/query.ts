import { db, inArray, and, eq } from "@/server/db";
import { user } from "@/server/db/schema/auth";
import { TEACHING_PERSONNEL, ADMIN_ROLE } from "@/constants/roles";

export const getAllFaculty = async () => {
  return await db.select().from(user).where(
    and(
      inArray(user.role, [...TEACHING_PERSONNEL]),
      eq(user.isActive, true)
    )
  ).all();
}

export const getUserById = async (id: string) => {
  return await db.select().from(user).where(eq(user.id, id)).get();
}

export const getAllPeInstructors = async () => {
  return await db.select().from(user).where(
    and(
      eq(user.role, "pe_instructor"),
      eq(user.isActive, true)
    )
  ).all();
}

export const getAllSchedulableFaculty = async (role: string, departmentOrOrganization: string) => {
  if (role === ADMIN_ROLE) return await getAllFaculty();

  const faculty = await db.select().from(user).where(
    and(
      inArray(user.role, [...TEACHING_PERSONNEL]),
      eq(user.isActive, true),
      eq(user.departmentOrOrganization, departmentOrOrganization)
    )
  ).all();

  const facilityManager = await db.select().from(user).where(
    and(
      eq(user.role, "facility_manager"),
      eq(user.isActive, true),
      eq(user.departmentOrOrganization, departmentOrOrganization)
    )
  ).all();

  return [...faculty, ...facilityManager];
}

export const getAllUsers = async () => {
  return await db.select().from(user).orderBy(user.name).all();
}