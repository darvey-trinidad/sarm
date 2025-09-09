import { db, eq } from "@/server/db";
import { venueReservation } from "@/server/db/schema/venue";

import type { VenueReservationWithoutId } from "@/server/db/types/venue";

export const getAllVenueReservations = async () => {
  try {
    return await db.select().from(venueReservation).all();
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export const getVenueReservationsByDate = async (date: Date) => {
  try {
    return await db
      .select()
      .from(venueReservation)
      .where(eq(venueReservation.date, date))
      .all();
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export const checkVenueReservationConflicts = async (newReservation: VenueReservationWithoutId) => {
  try {
    const currentReservations = await getVenueReservationsByDate(newReservation.date);

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
