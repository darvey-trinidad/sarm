export const BORROWING_STATUS = [
  "pending",
  "approved",
  "returned",
  "rejected",
  "canceled",
] as const;

export const BorrowingStatus = {
  Pending: BORROWING_STATUS[0],
  Approved: BORROWING_STATUS[1],
  Returned: BORROWING_STATUS[2],
  Rejected: BORROWING_STATUS[3],
  Canceled: BORROWING_STATUS[4],
};

export const DEFAULT_BORROWING_STATUS = BORROWING_STATUS[0];

export type BorrowingStatus = (typeof BORROWING_STATUS)[number];

export const BORROWING_STATUS_OPTIONS = BORROWING_STATUS.map((status) => ({
  value: status,
  label: status.charAt(0).toUpperCase() + status.slice(1),
}));
