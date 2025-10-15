import { db, eq } from "@/server/db";
import { classroom, building } from "@/server/db/schema/classroom";
import type { Building, EditBuilding, Classroom, ChangeClassroomUsability, EditClassroom } from "@/server/db/types/classroom";
import { TRPCError } from "@trpc/server";

export const createBuilding = async (data: Building) => {
  try {
    const existing = await db.select({ buildingName: building.name }).from(building).all();

    if (existing.some((b) => b.buildingName.replace(" ", "").toLowerCase() === data.name.replace(" ", "").toLowerCase())) {
      throw new TRPCError({
        code: "CONFLICT",
        message: "Building name already exists",
      })
    }

    return await db.insert(building).values(data).run();
  } catch (err) {
    console.error("Failed to create building:", err);
    throw err;
  }
};
export const editBuilding = async (data: EditBuilding) => {
  try {
    const { id, ...rest } = data;
    return await db.update(building).set(rest).where(eq(building.id, id)).run();
  } catch (err) {
    console.error("Failed to edit building:", err);
    throw new Error("Could not edit building");
  }
}
export const deleteBuilding = async (id: string) => {
  try {
    return await db.delete(building).where(eq(building.id, id)).run();
  } catch (err) {
    console.error("Failed to delete building:", err);
    throw err;
  }
}
/*
  Classrooms
*/
export const createClassroom = async (data: Classroom) => {
  try {
    const existing = await db.select({ classroomName: classroom.name }).from(classroom).where(eq(classroom.buildingId, data.buildingId)).all();

    if (existing.some((c) => c.classroomName.replace(" ", "").toLowerCase() === data.name.replace(" ", "").toLowerCase())) {
      throw new TRPCError({
        code: "CONFLICT",
        message: "Classroom name already exists",
      })
    }

    return await db.insert(classroom).values(data).run();
  } catch (err) {
    console.error("Failed to create classroom:", err);
    throw new Error("Could not create classroom");
  }
};
export const editClassroom = async (data: EditClassroom) => {
  try {
    const { id, ...rest } = data;
    return await db.update(classroom).set(rest).where(eq(classroom.id, id)).run();
  } catch (err) {
    console.error("Failed to edit classroom:", err);
    throw new Error("Could not edit classroom");
  }
}
export const changeClassroomUsability = async (data: ChangeClassroomUsability) => {
  try {
    const current = await db.select().from(classroom).where(eq(classroom.id, data.id)).get();

    if (!current) throw new Error("Classroom not found");

    return await db.update(classroom).set({ usability: data.usability }).where(eq(classroom.id, data.id)).run();
  } catch (err) {
    console.error("Failed to change classroom usability:", err);
    throw new Error("Could not change classroom usability");
  }
};
export const deleteClassroom = async (id: string) => {
  try {
    return await db.delete(classroom).where(eq(classroom.id, id)).run();
  } catch (err) {
    console.error("Failed to delete classroom:", err);
    throw new Error("Could not delete classroom");
  }
}