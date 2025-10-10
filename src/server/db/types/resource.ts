import { type InferInsertModel, type InferSelectModel } from "drizzle-orm";
import { resource, resourceBorrowing, borrowingTransaction } from "@/server/db/schema/resource";

export type Resource = InferSelectModel<typeof resource>;
export type NewResource = InferInsertModel<typeof resource>;

export type NewBorrowingTransaction = InferInsertModel<typeof borrowingTransaction>;
export type EditBorrowingTransaction = Partial<Omit<BorrowingTransaction, "id">>;

export type ResourceBorrowing = InferSelectModel<typeof resourceBorrowing>;
export type NewResourceBorrowing = InferInsertModel<typeof resourceBorrowing>;

export type EditResourceBorrowing = Partial<Omit<ResourceBorrowing, "id">>;

export type BorrowedItems = {
  id: string;
  resourceId: string;
  resourceName: string;
  resourceDescription: string;
  quantity: number;
};

export type BorrowingTransaction = {
  id: string;
  borrowerId: string;
  borrowerName: string;
  startTime: number;
  endTime: number;
  purpose: string;
  status: string;
  representativeBorrower: string;
  dateRequested: Date;
  dateBorrowed: Date | null;
  dateReturned: Date | null;
  fileUrl: string | null;
  venueReservationId: string | null;
  venueReservationStatus: string | null;
  borrowedItems: BorrowedItems[];
};