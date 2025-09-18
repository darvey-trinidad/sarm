import { z } from "zod";
import { USABILITY } from "@/constants/usability";
export const VenueSchema = z.object({
  name: z.string().min(1, { message: "Please enter a name" }),
  description: z.string({
    required_error: "Please enter a description",
  }),
  capacity: z.coerce
    .number({ invalid_type_error: "Capacity must be a number" })
    .min(1, { message: "Please enter a capacity" }),
  usability: z.enum(USABILITY, {
    errorMap: () => ({ message: "Please select a valid usability" }),
  }),
});
