import { z } from "zod";
import { BORROWING_STATUS } from "@/constants/borrowing-status";

export const ResourceScehma = z.object({
  dateBorrowed: z.date(),
  startTime: z.string(),
  endTime: z.string(),
  purpose: z.string(),
  status: z.enum(BORROWING_STATUS),
  representativeBorrower: z.string().optional(),
  fileUrl: z.string().optional(),
  itemsBorrowed: z.array(
    z.object({
      id: z.string(),
      quantity: z.coerce.number(),
    }),
  ),
});
