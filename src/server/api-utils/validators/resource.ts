import z from "zod";
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

export const getAllAvailableResourcesSchema = z.object({
  requestedDate: requiredDateSchema(),
  requestedStartTime: timeIntSchema,
  requestedEndTime: timeIntSchema
})

export const EditResourceBorrowingSchema = z.object({
  id: z.string(),
  borrowerId: z.string().optional(),
  startTime: timeIntSchema.optional(),
  endTime: timeIntSchema.optional(),
  resourceId: z.string().optional(),
  representativeBorrower: z.string().optional(),
  status: z.enum(BORROWING_STATUS).optional(),
  quantity: z.number().optional(),
  dateBorrowed: requiredDateSchema().optional(),
  purpose: z.string().optional(),
  dateReturned: requiredDateSchema().optional().default(new Date()),

  venueReservationId: z.string().optional(),
  fileUrl: z.string().optional(),
});




export const createBorrowingTransactionSchema = z.object({
  borrowerId: z.string(),
  startTime: timeIntSchema,
  endTime: timeIntSchema,
  purpose: z.string(),
  status: z.enum(BORROWING_STATUS),
  fileUrl: z.string().optional(),
  venueReservationId: z.string().optional(),
  representativeBorrower: z.string(),
  dateRequested: requiredDateSchema().optional(),
  dateBorrowed: requiredDateSchema().optional(),
  dateReturned: requiredDateSchema().optional(),
  itemsBorrowed: z.array(
    z.object({
      resourceId: z.string(),
      quantity: z.number().optional(),
    })
  ),
});

export const getAllBorrowingTransactionsSchema = z.object({
  status: z.enum(BORROWING_STATUS).optional(),
  startDate: requiredDateSchema().optional(),
  endDate: requiredDateSchema().optional(),
})

export const editBorrowingTransactionSchema = z.object({
  id: z.string(),
  borrowerId: z.string().optional(),
  startTime: timeIntSchema.optional(),
  endTime: timeIntSchema.optional(),
  purpose: z.string().optional(),
  status: z.enum(BORROWING_STATUS).optional(),
  fileUrl: z.string().optional(),
  rejectionReason: z.string().optional(),
  venueReservationId: z.string().optional(),
  representativeBorrower: z.string().optional(),
  dateRequested: requiredDateSchema().optional(),
  dateBorrowed: requiredDateSchema().optional(),
  dateReturned: requiredDateSchema().optional(),
})

export const createResourceBorrowingSchema = z.array(
  z.object({
    id: z.string(),
    resourceId: z.string(),
    transactionId: z.string(),
    quantity: z.number().optional(),
  })
);
