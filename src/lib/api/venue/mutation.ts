import { db, eq } from "@/server/db";
import { venue, venueReservation } from "@/server/db/schema/venue";
import { checkVenueReservationConflicts } from "@/lib/api/venue/query";
import { TRPCError } from "@trpc/server";
import type { EditVenueReservation, Venue, VenueReservation } from "@/server/db/types/venue";
import { ReservationStatus } from "@/constants/reservation-status";

export const createVenue = async (data: Venue) => {
  try {
    const existingVenue = await db.select().from(venue).all();

    if (existingVenue.some((v) => v.name.replace(" ", "").toLowerCase() === data.name.replace(" ", "").toLowerCase())) {
      throw new TRPCError({
        code: "CONFLICT",
        message: "Venue name already exists",
      });
    }

    return await db.insert(venue).values(data).returning().get();
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export const editVenue = async (id: string, data: {
  name?: string | undefined;
  description?: string | undefined;
  capacity?: number | undefined;
  usability?: "operational" | "non-operational" | undefined;
}) => {
  try {
    return await db.update(venue).set(data).where(eq(venue.id, id)).returning().get();
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
    const reservationRecord = await db.select().from(venueReservation).where(eq(venueReservation.id, id)).get();

    if (!reservationRecord) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Venue reservation not found",
      });
    }

    if (data?.status === ReservationStatus.Approved) {
      const { id: reservationId, ...rest } = reservationRecord;

      const conflicts = await checkVenueReservationConflicts(rest);

      if (conflicts.length > 0) {
        throw new TRPCError({
          code: "CONFLICT", // or "BAD_REQUEST", whichever fits best
          message: "Venue reservation conflict detected",
          cause: conflicts,
        });
      }
    }

    return await db.update(venueReservation).set(data).where(eq(venueReservation.id, id)).returning().get();
  } catch (error) {
    console.error(error);
    throw error;
  }
}