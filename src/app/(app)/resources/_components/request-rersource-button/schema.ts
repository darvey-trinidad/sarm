import { z } from "zod";
import { BORROWING_STATUS } from "@/constants/borrowing-status";

export const ResourceScehma = z.object({
  dateBorrowed: z.date(),
  startTime: z.string(),
  endTime: z.string(),
  purpose: z
    .string()
    .min(1, { message: "Please enter purpose for reservation" }),
  status: z.enum(BORROWING_STATUS),
  representativeBorrower: z
    .string()
    .min(1, { message: "Please enter representative's name" }),
  fileUrl: z
    .string({ required_error: "Please upload a file" })
    .min(1, { message: "Please upload a file" }),
  itemsBorrowed: z.array(
    z.object({
      id: z.string(),
      quantity: z.coerce.number(),
    }),
  ),
});
