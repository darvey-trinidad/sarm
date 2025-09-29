import { venue, venueReservation } from "@/server/db/schema/venue";
import { type InferInsertModel, type InferSelectModel } from "drizzle-orm";

export type Venue = InferInsertModel<typeof venue>;
export type VenueSelect = InferSelectModel<typeof venue>;
export type VenueReservation = InferInsertModel<typeof venueReservation>;
export type VenueReservationSelect = InferSelectModel<typeof venueReservation>;
export type EditVenueReservation = Partial<Omit<VenueReservation, "id">>;

export type VenueWithoutId = Omit<Venue, "id">;
export type VenueReservationWithoutId = Omit<VenueReservation, "id">;
