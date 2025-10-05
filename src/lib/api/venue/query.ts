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
      acc[row.venueReservationId] ??= {
        venueReservationId: row.venueReservationId,
        venueId: row.venueId ?? "",
        venueName: row.venueName,
        reserverId: row.reserverId ?? "",
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
            id: row.transactionId ?? "",
            venueReservationId: row.transactionVenueReservationId ?? "",
            representativeBorrower: row.representativeBorrower ?? "",
            status: row.transactionStatus ?? "",
            itemsBorrowed: [],
          }
          : null,
      };


      if (row.transactionId && row.resourceId) {
        acc[row.venueReservationId]?.borrowingTransaction?.itemsBorrowed.push({
          id: row.resourceId ?? "",
          name: row.resourceName ?? "",
          description: row.resourceDescription ?? "",
          quantity: row.resourceQuantity ?? 1,
        });
      }

      return acc;
    }, {}),
  );

  return result;
}

export const getAllVenueReservationsByUserId = async (userId: string) => {
  try {
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
      .where(eq(venueReservation.reserverId, userId))
      .orderBy(desc(venueReservation.createdAt));

    const result = Object.values(
      rows.reduce<Record<string, ReservationWithBorrowing>>((acc, row) => {
        acc[row.venueReservationId] ??= {
          venueReservationId: row.venueReservationId,
          venueId: row.venueId ?? "",
          venueName: row.venueName,
          reserverId: row.reserverId ?? "",
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
              id: row.transactionId ?? "",
              venueReservationId: row.transactionVenueReservationId ?? "",
              representativeBorrower: row.representativeBorrower ?? "",
              status: row.transactionStatus ?? "",
              itemsBorrowed: [],
            }
            : null,
        };


        if (row.transactionId && row.resourceId) {
          acc[row.venueReservationId]?.borrowingTransaction?.itemsBorrowed.push({
            id: row.resourceId ?? "",
            name: row.resourceName ?? "",
            description: row.resourceDescription ?? "",
            quantity: row.resourceQuantity ?? 1,
          });
        }

        return acc;
      }, {}),
    );

    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export const getAllUpcomingVenueReservations = async () => {
  try {
    const now = new Date();
    now.setHours(now.getHours() + 8);
    const midnightPH = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()))

    return await db
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
      })
      .from(venueReservation)
      .innerJoin(venue, eq(venueReservation.venueId, venue.id))
      .innerJoin(user, eq(venueReservation.reserverId, user.id))
      .where(and(
        eq(venueReservation.status, ReservationStatus.Approved),
        gte(venueReservation.date, midnightPH),
      ))
      .orderBy(asc(venueReservation.date), asc(venueReservation.startTime))
      .limit(5)
      .all();
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

export type ChartRow = { month: string } & Record<string, number>;

export async function getVenueReservationPastMonthsStats() {
  const now = new Date();

  // Compute start of 12-month window (inclusive)
  const start = new Date(now.getFullYear(), now.getMonth() - 11, 1, 0, 0, 0, 0);

  // Load reservations within window (with venue names)
  const reservations = await db
    .select({
      venueName: venue.name,
      date: venueReservation.date,
    })
    .from(venueReservation)
    .where(gte(venueReservation.date, start))
    .innerJoin(venue, eq(venue.id, venueReservation.venueId))
    .all();

  // ✅ Determine which venues to include (only those with ≥1 reservation in past 12 months)
  const activeVenueNames = Array.from(
    new Set(reservations.map((r) => r.venueName as string))
  );

  // If no reservations at all, return empty stats
  if (activeVenueNames.length === 0) {
    return [];
  }

  // Build 12-month buckets
  const months: { key: string; label: string; counts: Record<string, number> }[] = [];

  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${d.getMonth()}`;
    const label = d.toLocaleString("en-US", { month: "long" });

    months.push({
      key,
      label,
      counts: activeVenueNames.reduce<Record<string, number>>((acc, name) => {
        acc[name] = 0;
        return acc;
      }, {}),
    });
  }

  // Fill counts
  for (const r of reservations) {
    const d = r.date;
    const key = `${d.getFullYear()}-${d.getMonth()}`;
    const bucket = months.find((m) => m.key === key);
    if (bucket) {
      const name = r.venueName as string;
      bucket.counts[name] = (bucket.counts[name] || 0) + 1;
    }
  }

  // Convert to ChartRow[]
  return months.map((m) => ({
    month: m.label,
    ...m.counts,
  }));
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