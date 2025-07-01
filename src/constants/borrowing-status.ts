export const BORROWING_STATUS = [
  "pending", 
  "for_submission", 
  "borrowed", 
  "returned",
  "rejected"
] as const;

export const DEFAULT_BORROWING_STATUS = BORROWING_STATUS[0];

export type BorrowingStatus = (typeof BORROWING_STATUS)[number];