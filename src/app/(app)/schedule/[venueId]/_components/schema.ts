import { z } from "zod";
import { RESERVATION_STATUS } from "@/constants/reservation-status";

export const VenueSchema = z.object({
  date: z.date(),
  startTime: z.number(),
  endTime: z.number(),
  purpose: z.string(),
  status: z.enum(RESERVATION_STATUS),
});
