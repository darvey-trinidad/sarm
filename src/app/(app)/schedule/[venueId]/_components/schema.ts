import { z } from "zod";
import { RESERVATION_STATUS } from "@/constants/reservation-status";
import { file } from "better-auth";

export const VenueSchema = z.object({
  date: z.date(),
  startTime: z.number(),
  endTime: z.number(),
  purpose: z.string(),
  status: z.enum(RESERVATION_STATUS),
  borrowItems: z
    .array(
      z.object({
        id: z.string(),
        quantity: z.coerce.number(),
      }),
    )
    .optional(),
  fileUrl: z.string().optional(),
});
