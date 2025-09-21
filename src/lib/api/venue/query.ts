import { db, eq, and, desc, asc, gte, lte } from "@/server/db";
import { venue, venueReservation } from "@/server/db/schema/venue";
import { user } from "@/server/db/schema/auth";
import { ReservationStatus } from "@/constants/reservation-status";
import { resource, resourceBorrowing } from "@/server/db/schema/resource";

import type { VenueReservationWithoutId } from "@/server/db/types/venue";

export const getAllVenues = async () => {
  try {
    return await db.select().from(venue).all();
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export const getAllVenueReservations = async () => {
  try {
    const rows = await db
      .select({
        venueReservationId: venueReservation.id,
        venueId: venueReservation.venueId,
        venueName: venue.name,
        date: venueReservation.date,
        startTime: venueReservation.startTime,
        endTime: venueReservation.endTime,
        reserverId: venueReservation.reserverId,
        reserverName: user.name,
        purpose: venueReservation.purpose,
        status: venueReservation.status,
        createdAt: venueReservation.createdAt,
        fileUrl: venueReservation.fileUrl,

        // borrowing fields
        resourceBorrowingId: resourceBorrowing.id,
        resourceId: resourceBorrowing.resourceId,
        resourceName: resource.name,
        quantity: resourceBorrowing.quantity,
        representativeBorrower: resourceBorrowing.representativeBorrower,
      })
      .from(venueReservation)
      .orderBy(desc(venueReservation.date), asc(venueReservation.startTime))
      .innerJoin(venue, eq(venueReservation.venueId, venue.id))
      .innerJoin(user, eq(venueReservation.reserverId, user.id))
      .leftJoin(
        resourceBorrowing,
        eq(venueReservation.id, resourceBorrowing.venueReservationId)
      )
      .leftJoin(resource, eq(resourceBorrowing.resourceId, resource.id))
      .all();

    // ---- Post-process: group by reservationId ----
    const reservations = Object.values(
      rows.reduce((acc, row) => {
        const id = row.venueReservationId;

        if (!acc[id]) {
          acc[id] = {
            venueReservationId: row.venueReservationId,
            venueId: row.venueId,
            venueName: row.venueName,
            date: row.date,
            startTime: row.startTime,
            endTime: row.endTime,
            reserverId: row.reserverId,
            reserverName: row.reserverName,
            purpose: row.purpose,
            status: row.status,
            createdAt: row.createdAt,
            fileUrl: row.fileUrl,
            borrowings: [],
          };
        }

        if (row.resourceBorrowingId) {
          acc[id].borrowings.push({
            resourceBorrowingId: row.resourceBorrowingId,
            resourceId: row.resourceId,
            resourceName: row.resourceName,
            quantity: row.quantity,
            representativeBorrower: row.representativeBorrower,
          });
        }

        return acc;
      }, {} as Record<string, any>)
    );

    return reservations;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

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

export const getVenueSchedule = async (venueId: string, startDate: Date, endDate: Date) => {
  try {
    return await db
      .select({
        venueReservationId: venueReservation.id,
        venueId: venueReservation.venueId,
        venueName: venue.name,
        date: venueReservation.date,
        startTime: venueReservation.startTime,
        endTime: venueReservation.endTime,
        reserverId: venueReservation.reserverId,
        reserverName: user.name,
        purpose: venueReservation.purpose,
        status: venueReservation.status,
        createdAt: venueReservation.createdAt
      })
      .from(venueReservation)
      .where(and(
        eq(venueReservation.venueId, venueId),
        gte(venueReservation.date, startDate),
        lte(venueReservation.date, endDate),
        eq(venueReservation.status, ReservationStatus.Approved)
      ))
      .orderBy(
        asc(venueReservation.date),
        asc(venueReservation.startTime)
      )
      .innerJoin(venue, eq(venueReservation.venueId, venue.id))
      .innerJoin(user, eq(venueReservation.reserverId, user.id))
      .all();
  } catch (error) {
    console.error(error);
    throw error;
  }
}