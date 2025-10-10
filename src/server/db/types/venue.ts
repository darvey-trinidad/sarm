import { venue, venueReservation } from "@/server/db/schema/venue";
import { type InferInsertModel, type InferSelectModel } from "drizzle-orm";

export type Venue = InferInsertModel<typeof venue>;
export type VenueSelect = InferSelectModel<typeof venue>;
export type VenueReservation = InferInsertModel<typeof venueReservation>;
export type VenueReservationSelect = InferSelectModel<typeof venueReservation>;
export type EditVenueReservation = Partial<Omit<VenueReservation, "id">>;

export type VenueWithoutId = Omit<Venue, "id">;
export type VenueReservationWithoutId = Omit<VenueReservation, "id">;

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

export type ReservationWithBorrowing = {
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