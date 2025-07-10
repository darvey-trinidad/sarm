import { db } from "@/server/db";
import { classroom, building } from "@/server/db/schema/classroom";
import { type Classroom, type Building } from "@/server/db/types/classroom";

export const createBuilding = async (data: Building) => {
  try {
    return await db.insert(building).values(data).run();
  } catch (err) {
    console.error("Failed to create building:", err);
    throw new Error("Could not create building");
  }
};

export const createClassroom = async (data: Classroom) => {
  try {
    return await db.insert(classroom).values(data).run();
  } catch (err) {
    console.error("Failed to create classroom:", err);
    throw new Error("Could not create classroom");
  }
};