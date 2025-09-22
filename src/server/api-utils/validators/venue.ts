import z from "zod";
import { USABILITY } from "@/constants/usability";
import { RESERVATION_STATUS } from "@/constants/reservation-status";
import { requiredDateSchema } from "@/server/api-utils/validators/date";
import { createBorrowingTransactionSchema } from "@/server/api-utils/validators/resource";
import { venue } from "@/server/db/schema/venue";

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

export const getVenueScheduleSchema = z.object({
  venueId: z.string(),
  startDate: requiredDateSchema(),
  endDate: requiredDateSchema(),
})

export const getAllVenueReservationsSchema = z.object({
  status: z.enum(RESERVATION_STATUS).optional(),
  venueId: z.string().optional(),
  startDate: requiredDateSchema().optional(),
  endDate: requiredDateSchema().optional(),
})