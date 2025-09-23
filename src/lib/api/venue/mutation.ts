import { db, eq } from "@/server/db";
import { venue, venueReservation } from "@/server/db/schema/venue";
import { checkVenueReservationConflicts } from "@/lib/api/venue/query";
import { TRPCError } from "@trpc/server";
import type { EditVenueReservation, Venue, VenueReservation } from "@/server/db/types/venue";

export const createVenue = async (data: Venue) => {
  try {
    return await db.insert(venue).values(data).returning().get();
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export const createVenueReservation = async (data: VenueReservation) => {
  try {
    const conflicts = await checkVenueReservationConflicts(data);

    if (conflicts.length > 0) {
      throw new TRPCError({
        code: "CONFLICT", // or "BAD_REQUEST", whichever fits best
        message: "Venue reservation conflict detected",
        cause: conflicts,
      });
    }

    return await db.insert(venueReservation).values(data).returning().get();
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export const editVenueReservation = async (id: string, data: EditVenueReservation) => {
  try {
    return await db.update(venueReservation).set(data).where(eq(venueReservation.id, id)).returning().get();
  } catch (error) {
    console.error(error);
    throw error;
  }
}