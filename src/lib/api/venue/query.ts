import { db, eq, and } from "@/server/db";
import { venue, venueReservation } from "@/server/db/schema/venue";

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
    return await db.select().from(venueReservation).all();
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
