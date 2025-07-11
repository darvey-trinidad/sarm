import { db, eq } from "@/server/db";
import { classroom, building } from "@/server/db/schema/classroom";

export const getBuilding = async (id: string) => {
  try {
    return await db.select().from(building).where(eq(building.id, id)).get();
  } catch (err) {
    console.error("Failed to get building:", err);
    throw new Error("Could not get building");
  }
};

export const getAllBuildings = async () => {
  try {
    return await db.select().from(building).all();
  } catch (err) {
    console.error("Failed to get all buildings:", err);
    throw new Error("Could not get all buildings");
  }
}

export const getClassroom = async (id: string) => {
  try {
    return await db.select().from(classroom).where(eq(classroom.id, id)).get();
  } catch (err) {
    console.error("Failed to get classroom:", err);
    throw new Error("Could not get classroom");
  }
};

export const getAllClassrooms = async () => {
  try {
    return await db.select().from(classroom).all();
  } catch (err) {
    console.error("Failed to get all classrooms:", err);
    throw new Error("Could not get all classrooms");
  }
}