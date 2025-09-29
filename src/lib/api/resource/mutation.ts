import { db, eq } from "@/server/db";
import type { EditBorrowingTransaction, NewBorrowingTransaction, NewResource, NewResourceBorrowing } from "@/server/db/types/resource";
import { borrowingTransaction, resource, resourceBorrowing } from "@/server/db/schema/resource";
import { en } from "zod/v4/locales";
import { getAllAvailableResources } from "./query";
import { TRPCError } from "@trpc/server";

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
    if (data.status === "approved") {
      const current = await db.select({
        transactionId: borrowingTransaction.id,
        dateBorrowed: borrowingTransaction.dateBorrowed,
        startTime: borrowingTransaction.startTime,
        endTime: borrowingTransaction.endTime,
        borrowingId: resourceBorrowing.id,
        resourceId: resourceBorrowing.resourceId,
        quantity: resourceBorrowing.quantity
      })
        .from(borrowingTransaction)
        .innerJoin(resourceBorrowing, eq(borrowingTransaction.id, resourceBorrowing.transactionId))
        .where(eq(borrowingTransaction.id, id));

      if (!current[0]?.dateBorrowed) return null;

      const availableResources = await getAllAvailableResources(current[0].dateBorrowed, current[0].startTime, current[0].endTime);

      for (const item of current) {
        const match = availableResources.find(r => r.id === item.resourceId);
        console.log("MATCH: ", match);
        console.log("ITEM: ", item);

        if (!match || item.quantity > match.available) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: `Not enough available stock for resource: ${match?.name || item.resourceId}. `
          })
        }
      }
    }

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

export const editBorrowingTransactionByVenueReservationId = async (reservationId: string, data: EditBorrowingTransaction) => {
  try {
    const current = await db.select().from(borrowingTransaction).where(eq(borrowingTransaction.venueReservationId, reservationId)).get();

    if (!current) return null;

    const updated = await db
      .update(borrowingTransaction)
      .set(data)
      .where(eq(borrowingTransaction.venueReservationId, reservationId))
      .returning()
      .get();

    return updated;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export const editBorrowingTransactionByTransactionId = async (transactionId: string, data: EditBorrowingTransaction) => {
  try {
    return await db.update(borrowingTransaction).set(data).where(eq(borrowingTransaction.id, transactionId)).returning().get();
  } catch (error) {
    console.error(error);
    throw error;
  }
}