import { db, eq } from "@/server/db";
import type { NewResource } from "@/server/db/types/resource";
import { resource } from "@/server/db/schema/resource";

export const createResource = async (data: NewResource) => {
  try {
    return await db.insert(resource).values(data).returning().get();
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const addResourceQuantity = async (id: string, quantity: number) => {
  try {
    const current = await db.select().from(resource).where(eq(resource.id, id)).get();

    if (!current) throw new Error("Resource not found");

    return await db.update(resource).set({ stock: current.stock + quantity }).where(eq(resource.id, id)).returning().get();
  } catch (error) {
    console.error(error);
    throw error;
  }
};