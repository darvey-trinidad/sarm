import { db, eq } from "@/server/db";
import { resource } from "@/server/db/schema/resource";

export const getAllResources = async () => {
  try {
    return await db.select().from(resource).orderBy(resource.name).all();
  } catch (error) {
    console.error(error);
    throw error;
  }
};
