import type { TimeInt } from "@/constants/timeslot";
import {
  db,
  eq,
  sql,
  and,
  inArray,
  lte,
  gte,
  asc,
  desc,
  or,
} from "@/server/db";
import {
  resource,
  resourceBorrowing,
  borrowingTransaction,
} from "@/server/db/schema/resource";
import { user } from "@/server/db/schema/auth";
import {
  BORROWING_STATUS,
  BorrowingStatus,
} from "@/constants/borrowing-status";
import { venueReservation } from "@/server/db/schema/venue";

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
  requestedEndTime: number,
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
        eq(borrowingTransaction.id, resourceBorrowing.transactionId),
      );

    const isSameDay = (a: Date, b: Date) =>
      a.getFullYear() === b.getFullYear() &&
      a.getMonth() === b.getMonth() &&
      a.getDate() === b.getDate();

    // filter borrowings for this exact date + overlapping times
    const filtered = borrowings.filter(
      (b) =>
        b.dateBorrowed !== null &&
        isSameDay(b.dateBorrowed, requestedDate) &&
        b.status === "approved" &&
        b.startTime < requestedEndTime &&
        b.endTime > requestedStartTime,
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

export const getAllBorrowingTransactions = async ({
  status,
  startDate,
  endDate,
}: {
  status?: BorrowingStatus;
  startDate?: Date; // filter reservations on/after this date
  endDate?: Date; // filter reservations on/before this date
}) => {
  try {
    const conditions = [];
    if (status) conditions.push(eq(borrowingTransaction.status, status));
    if (startDate)
      conditions.push(gte(borrowingTransaction.dateBorrowed, startDate));
    if (endDate)
      conditions.push(lte(borrowingTransaction.dateBorrowed, endDate));

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
        venueReservationId: borrowingTransaction.venueReservationId,
        venueReservationStatus: venueReservation.status,

        resourceBorrowingId: resourceBorrowing.id,
        resourceId: resourceBorrowing.resourceId,
        resourceName: resource.name,
        resourceDescription: resource.description,
        quantity: resourceBorrowing.quantity,
      })
      .from(borrowingTransaction)
      .innerJoin(user, eq(borrowingTransaction.borrowerId, user.id))
      .leftJoin(
        resourceBorrowing,
        eq(resourceBorrowing.transactionId, borrowingTransaction.id),
      )
      .leftJoin(resource, eq(resourceBorrowing.resourceId, resource.id))
      .leftJoin(
        venueReservation,
        eq(borrowingTransaction.venueReservationId, venueReservation.id),
      )
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(desc(borrowingTransaction.dateRequested))
      .all();

    // ---- Group by transactionId ----
    const borrowings = Object.values(
      rows.reduce<Record<string, BorrowingTransaction>>((acc, row) => {
        // Initialize group if missing
        const group = (acc[row.transactionId] ??= {
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
          venueReservationId: row.venueReservationId,
          venueReservationStatus: row.venueReservationStatus,
          borrowedItems: [],
        });

        // Push borrowed items if present
        if (row.resourceBorrowingId) {
          group.borrowedItems.push({
            id: row.resourceBorrowingId,
            resourceId: row.resourceId ?? "",
            resourceName: row.resourceName ?? "",
            resourceDescription: row.resourceDescription ?? "",
            quantity: row.quantity ?? 0,
          });
        }

        return acc;
      }, {}),
    );

    return borrowings;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getUpcomingBorrowingTransactions = async (
  borrowerId?: string,
  approvedOnly = true,
) => {
  try {
    const now = new Date();
    now.setHours(now.getHours() + 8);
    const midnightPH = new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()),
    );

    const conditions = [];
    conditions.push(gte(borrowingTransaction.dateBorrowed, midnightPH));

    if (approvedOnly)
      conditions.push(
        eq(borrowingTransaction.status, BorrowingStatus.Approved),
      );
    else
      conditions.push(
        or(
          eq(borrowingTransaction.status, BorrowingStatus.Approved),
          eq(borrowingTransaction.status, BorrowingStatus.Pending),
        ),
      );

    if (borrowerId)
      conditions.push(eq(borrowingTransaction.borrowerId, borrowerId));

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
        venueReservationId: borrowingTransaction.venueReservationId,
        venueReservationStatus: venueReservation.status,

        resourceBorrowingId: resourceBorrowing.id,
        resourceId: resourceBorrowing.resourceId,
        resourceName: resource.name,
        resourceDescription: resource.description,
        quantity: resourceBorrowing.quantity,
      })
      .from(borrowingTransaction)
      .innerJoin(user, eq(borrowingTransaction.borrowerId, user.id))
      .leftJoin(
        resourceBorrowing,
        eq(resourceBorrowing.transactionId, borrowingTransaction.id),
      )
      .leftJoin(resource, eq(resourceBorrowing.resourceId, resource.id))
      .leftJoin(
        venueReservation,
        eq(borrowingTransaction.venueReservationId, venueReservation.id),
      )
      .where(and(...conditions))
      .orderBy(
        asc(borrowingTransaction.dateBorrowed),
        asc(borrowingTransaction.startTime),
      )
      .all();

    // ---- Group by transactionId ----
    const borrowings = Object.values(
      rows.reduce<Record<string, BorrowingTransaction>>((acc, row) => {
        // Initialize group if missing
        const group = (acc[row.transactionId] ??= {
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
          venueReservationId: row.venueReservationId,
          venueReservationStatus: row.venueReservationStatus,
          borrowedItems: [],
        });

        // Push borrowed items if present
        if (row.resourceBorrowingId) {
          group.borrowedItems.push({
            id: row.resourceBorrowingId,
            resourceId: row.resourceId ?? "",
            resourceName: row.resourceName ?? "",
            resourceDescription: row.resourceDescription ?? "",
            quantity: row.quantity ?? 0,
          });
        }
        return acc;
      }, {}),
    );

    return borrowings.slice(0, 5);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getAllBorrowingTransactionsByUserId = async (userId: string) => {
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
        venueReservationId: borrowingTransaction.venueReservationId,
        venueReservationStatus: venueReservation.status,

        resourceBorrowingId: resourceBorrowing.id,
        resourceId: resourceBorrowing.resourceId,
        resourceName: resource.name,
        resourceDescription: resource.description,
        quantity: resourceBorrowing.quantity,
      })
      .from(borrowingTransaction)
      .innerJoin(user, eq(borrowingTransaction.borrowerId, user.id))
      .leftJoin(
        resourceBorrowing,
        eq(resourceBorrowing.transactionId, borrowingTransaction.id),
      )
      .leftJoin(resource, eq(resourceBorrowing.resourceId, resource.id))
      .leftJoin(
        venueReservation,
        eq(borrowingTransaction.venueReservationId, venueReservation.id),
      )
      .where(eq(borrowingTransaction.borrowerId, userId))
      .orderBy(desc(borrowingTransaction.dateRequested))
      .all();

    // ---- Group by transactionId ----
    const borrowings = Object.values(
      rows.reduce<Record<string, BorrowingTransaction>>((acc, row) => {
        // Initialize group if missing
        const group = (acc[row.transactionId] ??= {
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
          venueReservationId: row.venueReservationId,
          venueReservationStatus: row.venueReservationStatus,
          borrowedItems: [],
        });

        // Push borrowed items if present
        if (row.resourceBorrowingId) {
          group.borrowedItems.push({
            id: row.resourceBorrowingId,
            resourceId: row.resourceId ?? "",
            resourceName: row.resourceName ?? "",
            resourceDescription: row.resourceDescription ?? "",
            quantity: row.quantity ?? 0,
          });
        }

        return acc;
      }, {}),
    );

    return borrowings;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

type BorrowedItems = {
  id: string;
  resourceId: string;
  resourceName: string;
  resourceDescription: string;
  quantity: number;
};

type BorrowingTransaction = {
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
  venueReservationId: string | null;
  venueReservationStatus: string | null;
  borrowedItems: BorrowedItems[];
};
