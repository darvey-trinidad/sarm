import { db, eq } from "@/server/db";
import type { EditBorrowingTransaction, EditResourceBorrowing, NewBorrowingTransaction, NewResource, NewResourceBorrowing } from "@/server/db/types/resource";
import { borrowingTransaction, resource, resourceBorrowing } from "@/server/db/schema/resource";

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

export const createBorrowingTransaction = async (data: NewBorrowingTransaction) => {
  try {
    return await db.insert(borrowingTransaction).values(data).returning().get();
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export const editBorrowingTransaction = async (id: string, data: EditBorrowingTransaction) => {
  try {
    return await db.update(borrowingTransaction).set(data).where(eq(borrowingTransaction.id, id)).returning().get();
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export const createResourceBorrowing = async (data: NewResourceBorrowing[]) => {
  try {
    return await db.insert(resourceBorrowing).values(data).returning().get();
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const editResourceBorrowing = async (id: string, data: EditResourceBorrowing) => {
  try {
    return await db.update(resourceBorrowing).set(data).where(eq(resourceBorrowing.id, id)).returning().get();
  } catch (error) {
    console.error(error);
    throw error;
  }
};