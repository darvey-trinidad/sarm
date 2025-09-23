import { db, eq, and, desc, asc, gte, lte } from "@/server/db";
import { venue, venueReservation } from "@/server/db/schema/venue";
import { user } from "@/server/db/schema/auth";
import { ReservationStatus } from "@/constants/reservation-status";
import { borrowingTransaction, resource, resourceBorrowing } from "@/server/db/schema/resource";

import type { VenueReservationWithoutId } from "@/server/db/types/venue";

export const getAllVenues = async () => {
  try {
    return await db.select().from(venue).all();
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getAllVenueReservations({
  status,
  venueId,
  startDate,
  endDate,
}: {
  status?: ReservationStatus;
  venueId?: string;
  startDate?: Date;   // filter reservations on/after this date
  endDate?: Date;     // filter reservations on/before this date
}): Promise<ReservationWithBorrowing[]> {
  // --- Build conditions dynamically ---
  const conditions = [];
  if (status) conditions.push(eq(venueReservation.status, status));
  if (venueId) conditions.push(eq(venueReservation.venueId, venueId));
  if (startDate) conditions.push(gte(venueReservation.date, startDate));
  if (endDate) conditions.push(lte(venueReservation.date, endDate));

  const rows = await db
    .select({
      venueReservationId: venueReservation.id,
      venueId: venue.id,
      venueName: venue.name,
      reserverId: user.id,
      reserverName: user.name,

      date: venueReservation.date,
      startTime: venueReservation.startTime,
      endTime: venueReservation.endTime,
      purpose: venueReservation.purpose,
      status: venueReservation.status,
      createdAt: venueReservation.createdAt,
      fileUrl: venueReservation.fileUrl,

      transactionId: borrowingTransaction.id,
      transactionStatus: borrowingTransaction.status,
      transactionVenueReservationId: borrowingTransaction.venueReservationId,
      representativeBorrower: borrowingTransaction.representativeBorrower,

      resourceId: resource.id,
      resourceName: resource.name,
      resourceDescription: resource.description,
      resourceQuantity: resourceBorrowing.quantity,
    })
    .from(venueReservation)
    .innerJoin(venue, eq(venueReservation.venueId, venue.id))
    .innerJoin(user, eq(venueReservation.reserverId, user.id))
    .leftJoin(
      borrowingTransaction,
      eq(borrowingTransaction.venueReservationId, venueReservation.id),
    )
    .leftJoin(
      resourceBorrowing,
      eq(resourceBorrowing.transactionId, borrowingTransaction.id),
    )
    .leftJoin(resource, eq(resourceBorrowing.resourceId, resource.id))
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(desc(venueReservation.createdAt));

  const result = Object.values(
    rows.reduce<Record<string, ReservationWithBorrowing>>((acc, row) => {
      if (!acc[row.venueReservationId]) {
        acc[row.venueReservationId] = {
          venueReservationId: row.venueReservationId,
          venueId: row.venueId || "",
          venueName: row.venueName,
          reserverId: row.reserverId || "",
          reserverName: row.reserverName,
          date: row.date,
          startTime: row.startTime,
          endTime: row.endTime,
          purpose: row.purpose,
          status: row.status,
          fileUrl: row.fileUrl,
          createdAt: row.createdAt,
          borrowingTransaction: row.transactionId
            ? {
              id: row.transactionId || "",
              venueReservationId: row.transactionVenueReservationId || "",
              representativeBorrower: row.representativeBorrower || "",
              status: row.transactionStatus || "",
              itemsBorrowed: [],
            }
            : null,
        };
      }

      if (row.transactionId && row.resourceId) {
        acc[row.venueReservationId]?.borrowingTransaction?.itemsBorrowed.push({
          id: row.resourceId || "",
          name: row.resourceName || "",
          description: row.resourceDescription || "",
          quantity: row.resourceQuantity || 1,
        });
      }

      return acc;
    }, {}),
  );

  return result;
}

export const getAllPendingVenueReservations = async () => {
  try {
    const reservations = await getAllVenueReservations({
      status: ReservationStatus.Pending,
      // startDate: new Date("2025-09-22"),
      // endDate: new Date("2025-09-23"),
    });
    return reservations;

  } catch (error) {
    console.error(error);
    throw error;
  }
}

export const getReservedVenueReservationsByDate = async (venueId: string, date: Date) => {
  try {
    return await db
      .select()
      .from(venueReservation)
      .where(and(
        eq(venueReservation.venueId, venueId),
        eq(venueReservation.date, date),
        eq(venueReservation.status, ReservationStatus.Approved)))
      .all();
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export const checkVenueReservationConflicts = async (newReservation: VenueReservationWithoutId) => {
  try {
    const currentReservations = await getReservedVenueReservationsByDate(newReservation.venueId, newReservation.date);

    if (currentReservations.length === 0) {
      return [];
    }

    return currentReservations.filter((reservation) => {
      return (
        reservation.startTime < newReservation.endTime &&
        newReservation.startTime < reservation.endTime
      );
    });

  } catch (error) {
    console.error(error);
    throw error;
  }
}

// types
type BorrowedItem = {
  id: string;
  name: string;
  description: string;
  quantity: number;
};

type BorrowingTransaction = {
  id: string;
  venueReservationId: string;
  representativeBorrower: string;
  itemsBorrowed: BorrowedItem[];
  status: string;
} | null;

type ReservationWithBorrowing = {
  venueReservationId: string;
  venueId: string;
  venueName: string | null;
  reserverId: string;
  reserverName: string | null;
  date: Date;
  startTime: number;
  endTime: number;
  purpose: string;
  status: string;
  createdAt: Date;
  fileUrl: string | null;
  borrowingTransaction: BorrowingTransaction;
};