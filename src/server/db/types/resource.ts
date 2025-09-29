import { type InferInsertModel, type InferSelectModel } from "drizzle-orm";
import { resource, resourceBorrowing, borrowingTransaction } from "@/server/db/schema/resource";

export type Resource = InferSelectModel<typeof resource>;
export type NewResource = InferInsertModel<typeof resource>;

export type BorrowingTransaction = InferSelectModel<typeof borrowingTransaction>;
export type NewBorrowingTransaction = InferInsertModel<typeof borrowingTransaction>;
export type EditBorrowingTransaction = Partial<Omit<BorrowingTransaction, "id">>;

export type ResourceBorrowing = InferSelectModel<typeof resourceBorrowing>;
export type NewResourceBorrowing = InferInsertModel<typeof resourceBorrowing>;

export type EditResourceBorrowing = Partial<Omit<ResourceBorrowing, "id">>;