import z from "zod";
import { USABILITY } from "@/constants/usability";
import { RESERVATION_STATUS } from "@/constants/reservation-status";

export const createVenueSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  capacity: z.number(),
  usability: z.enum(USABILITY).optional(),
});

export const createVenueReservationSchema = z.object({
  venueId: z.string(),
  reserverId: z.string(),
  date: z.date(),
  startTime: z.date(),
  endTime: z.date(),
  purpose: z.string(),
  status: z.enum(RESERVATION_STATUS),
});