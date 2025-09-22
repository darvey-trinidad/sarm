import type { TimeInt } from "@/constants/timeslot";
import { db, eq, sql, and, inArray, lt, gt, desc } from "@/server/db";
import { resource, resourceBorrowing, borrowingTransaction } from "@/server/db/schema/resource";
import { user } from "@/server/db/schema/auth";

export const getAllResources = async () => {
  try {
    return await db.select().from(resource).orderBy(resource.name).all();
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getAllAvailableResources = async (
  requestedDate: Date,
  requestedStartTime: number,
  requestedEndTime: number
) => {
  try {
    // fetch all resources
    const resources = await db
      .select({
        id: resource.id,
        name: resource.name,
        stock: resource.stock,
        category: resource.category,
        description: resource.description,
      })
      .from(resource);

    // fetch all borrowings with transactions
    const borrowings = await db
      .select({
        resourceId: resourceBorrowing.resourceId,
        quantity: resourceBorrowing.quantity,
        dateBorrowed: borrowingTransaction.dateBorrowed,
        startTime: borrowingTransaction.startTime,
        endTime: borrowingTransaction.endTime,
        status: borrowingTransaction.status,
      })
      .from(resourceBorrowing)
      .innerJoin(
        borrowingTransaction,
        eq(borrowingTransaction.id, resourceBorrowing.transactionId)
      );

    // filter borrowings for this exact date + overlapping times
    const filtered = borrowings.filter(
      (b) =>
        b.dateBorrowed !== null &&
        b.dateBorrowed.getTime() === requestedDate.getTime() &&
        b.status === "approved" &&
        b.startTime < requestedEndTime &&
        b.endTime > requestedStartTime
    );

    // sum quantities per resource
    const usedByResource: Record<string, number> = {};
    for (const b of filtered) {
      usedByResource[b.resourceId] =
        (usedByResource[b.resourceId] ?? 0) + b.quantity;
    }

    // compute available
    return resources.map((r) => ({
      ...r,
      available: Math.max(r.stock - (usedByResource[r.id] ?? 0), 0),
    }));
  } catch (error) {
    console.error(error);
    throw error;
  }
};


export const getAllResourceBorrowings = async () => {
  try {
    const rows = await db
      .select({
        transactionId: borrowingTransaction.id,
        borrowerId: borrowingTransaction.borrowerId,
        borrowerName: user.name,
        startTime: borrowingTransaction.startTime,
        endTime: borrowingTransaction.endTime,
        purpose: borrowingTransaction.purpose,
        status: borrowingTransaction.status,
        representativeBorrower: borrowingTransaction.representativeBorrower,
        dateRequested: borrowingTransaction.dateRequested,
        dateBorrowed: borrowingTransaction.dateBorrowed,
        dateReturned: borrowingTransaction.dateReturned,
        fileUrl: borrowingTransaction.fileUrl,

        resourceBorrowingId: resourceBorrowing.id,
        resourceId: resourceBorrowing.resourceId,
        resourceName: resource.name,
        quantity: resourceBorrowing.quantity,
      })
      .from(borrowingTransaction)
      .innerJoin(user, eq(borrowingTransaction.borrowerId, user.id))
      .leftJoin(
        resourceBorrowing,
        eq(resourceBorrowing.transactionId, borrowingTransaction.id)
      )
      .leftJoin(resource, eq(resourceBorrowing.resourceId, resource.id))
      .orderBy(desc(borrowingTransaction.dateRequested))
      .all();

    // ---- Group by transactionId ----
    const borrowings = Object.values(
      rows.reduce<Record<string, BorrowingGroup>>((acc, row) => {
        // Initialize group if missing
        const group =
          acc[row.transactionId] ??= {
            id: row.transactionId,
            borrowerId: row.borrowerId,
            borrowerName: row.borrowerName ?? "",
            startTime: row.startTime,
            endTime: row.endTime,
            purpose: row.purpose,
            status: row.status,
            representativeBorrower: row.representativeBorrower,
            dateRequested: row.dateRequested,
            dateBorrowed: row.dateBorrowed,
            dateReturned: row.dateReturned,
            fileUrl: row.fileUrl,
            borrowedItems: [],
          };

        // Push borrowed items if present
        if (row.resourceBorrowingId) {
          group.borrowedItems.push({
            id: row.resourceBorrowingId,
            resourceId: row.resourceId ?? "",
            resourceName: row.resourceName ?? "",
            quantity: row.quantity ?? 0,
          });
        }

        return acc;
      }, {})
    );

    return borrowings;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

type BorrowingItem = {
  id: string;
  resourceId: string;
  resourceName: string;
  quantity: number;
};

type BorrowingGroup = {
  id: string;
  borrowerId: string;
  borrowerName: string;
  startTime: number;
  endTime: number;
  purpose: string;
  status: string;
  representativeBorrower: string;
  dateRequested: Date;
  dateBorrowed: Date | null;
  dateReturned: Date | null;
  fileUrl: string | null;
  borrowedItems: BorrowingItem[];
};
