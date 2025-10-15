import { z } from "zod";
export const venueSchema = z.object({
  name: z.string().min(1, "Venue name is required"),
  description: z.string().optional(),
  capacity: z.coerce
    .number()
    .int()
    .positive("Capacity must be a positive number")
    .optional(),
});
