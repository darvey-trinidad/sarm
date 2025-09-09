import { db } from "@/server/db";
import { venue, venueReservation } from "@/server/db/schema/venue";

import type { Venue, VenueReservation } from "@/server/db/types/venue";

export const createVenue = async (data: Venue) => {
  try {
    return await db.insert(venue).values(data).returning().get();
  } catch (error) {
    console.error(error);
    throw error;
  }
}