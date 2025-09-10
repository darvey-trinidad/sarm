import { db, eq, and, desc, asc } from "@/server/db";
import { venue, venueReservation } from "@/server/db/schema/venue";
import { user } from "@/server/db/schema/auth";

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
    return await db.select({
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
      .orderBy(
        desc(venueReservation.date),
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

export const getVenueReservationsByDate = async (venueId: string, date: Date) => {
  try {
    return await db
      .select()
      .from(venueReservation)
      .where(and(
        eq(venueReservation.venueId, venueId),
        eq(venueReservation.date, date)))
      .all();
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export const checkVenueReservationConflicts = async (newReservation: VenueReservationWithoutId) => {
  try {
    const currentReservations = await getVenueReservationsByDate(newReservation.venueId, newReservation.date);

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
