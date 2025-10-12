import { z } from "zod";

export const RejectionSchema = z.object({
  reason: z.string().min(1, { message: "Please enter a reason for rejection" }),
});
