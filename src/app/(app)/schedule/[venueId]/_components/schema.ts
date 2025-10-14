import { z } from "zod";
import { RESERVATION_STATUS } from "@/constants/reservation-status";

export const VenueSchema = z.object({
  date: z.date(),
  startTime: z.number(),
  endTime: z.number(),
  purpose: z
    .string()
    .min(1, { message: "Please enter purpose for reservation" }),
  status: z.enum(RESERVATION_STATUS),
  representativeBorrower: z.string().optional(),
  borrowItems: z
    .array(
      z.object({
        id: z.string(),
        quantity: z.coerce.number(),
      }),
    )
    .optional(),
  fileUrl: z
    .string({ required_error: "Please upload a file" })
    .min(1, { message: "Please upload a file" }),
});
