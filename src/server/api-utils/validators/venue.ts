import z from "zod";
import { USABILITY } from "@/constants/usability";
import { RESERVATION_STATUS } from "@/constants/reservation-status";
import { requiredDateSchema } from "@/server/api-utils/validators/date";

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
});

export const getVenueScheduleSchema = z.object({
  venueId: z.string(),
  startDate: requiredDateSchema(),
  endDate: requiredDateSchema(),
})