import z from "zod";
import { USABILITY } from "@/constants/usability";
import { RESERVATION_STATUS } from "@/constants/reservation-status";
import { requiredDateSchema } from "@/server/api-utils/validators/date";
import { createBorrowingTransactionSchema, editBorrowingTransactionSchema } from "@/server/api-utils/validators/resource";
import { venue } from "@/server/db/schema/venue";
import { timeIntSchema } from "@/constants/timeslot";

export const createVenueSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  capacity: z.number(),
  usability: z.enum(USABILITY).optional(),
});

export const createVenueReservationSchema = z.object({
  venueId: z.string(),
  reserverId: z.string(),
  date: requiredDateSchema(),
  startTime: z.number(),
  endTime: z.number(),
  purpose: z.string(),
  status: z.enum(RESERVATION_STATUS),
  fileUrl: z.string(),
});

export const createVenueReservationWithBorrowingSchema = z.object({
  venue: createVenueReservationSchema,
  borrowing: createBorrowingTransactionSchema
})

export const getAllVenueReservationsSchema = z.object({
  status: z.enum(RESERVATION_STATUS).optional(),
  venueId: z.string().optional(),
  startDate: requiredDateSchema().optional(),
  endDate: requiredDateSchema().optional(),
})

type venueRes = {
  status?: "pending" | "approved" | "rejected" | "canceled" | undefined;
  venueId?: string | undefined;
  reserverId?: string | undefined;
  date?: Date | undefined;
  startTime?: number | undefined;
  endTime?: number | undefined;
  purpose?: string | undefined;
  fileUrl?: string | null | undefined;
  createdAt?: Date | undefined;
  updatedAt?: Date | null | undefined;
}

export const editVenueReservationSchema = z.object({
  id: z.string(),
  status: z.enum(RESERVATION_STATUS).optional(),
  venueId: z.string().optional(),
  reserverId: z.string().optional(),
  date: requiredDateSchema().optional(),
  startTime: timeIntSchema.optional(),
  endTime: timeIntSchema.optional(),
  purpose: z.string().optional(),
  fileUrl: z.string().optional(),
})

export const editVenueReservationWithBorrowingSchema = z.object({
  venue: editVenueReservationSchema,
  borrowing: editBorrowingTransactionSchema.optional()
})