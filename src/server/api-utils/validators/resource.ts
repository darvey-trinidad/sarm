import z from "zod";
import type { NewResourceBorrowing } from "@/server/db/types/resource";
import { RESOURCE_CATEGORY } from "@/constants/resource-category";
import { timeIntSchema } from "@/constants/timeslot";
import { BORROWING_STATUS } from "@/constants/borrowing-status";
import { requiredDateSchema } from "./date";

export const createResourceSchema = z.object({
  name: z.string(),
  category: z.enum(RESOURCE_CATEGORY),
  description: z.string().optional(),
  stock: z.number().optional(),
});

export const addResourceQuantitySchema = z.object({
  id: z.string(),
  quantity: z.number(),
});

export const createResourceBorrowingSchema = z.object({
  borrowerId: z.string(),
  startTime: timeIntSchema,
  endTime: timeIntSchema,
  resourceId: z.string(),
  representativeBorrower: z.string(),
  status: z.enum(BORROWING_STATUS).optional(),
  quantity: z.number(),
  dateBorrowed: requiredDateSchema(),
  purpose: z.string(),

  venueReservationId: z.string().optional(),
  fileUrl: z.string().optional(),
});
