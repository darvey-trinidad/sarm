import { db, eq } from "@/server/db";
import { classroom, building } from "@/server/db/schema/classroom";
import type { Building, EditBuilding, Classroom, ChangeClassroomUsability, EditClassroom } from "@/server/db/types/classroom";

export const createBuilding = async (data: Building) => {
  try {
    return await db.insert(building).values(data).run();
  } catch (err) {
    console.error("Failed to create building:", err);
    throw new Error("Could not create building");
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

export const createClassroom = async (data: Classroom) => {
  try {
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

    if(!current) throw new Error("Classroom not found");

    return await db.update(classroom).set({ usability: data.usability }).where(eq(classroom.id, data.id)).run();
  } catch (err) {
    console.error("Failed to change classroom usability:", err);
    throw new Error("Could not change classroom usability");
  }
};