
export const RESERVATION_STATUS = [
  "pending",
  "for_submission",
  "reserved",
  "rejected",
  "canceled"
] as const;

export const DEFAULT_RESERVATION_STATUS = RESERVATION_STATUS[0];

export type ReservationStatus = (typeof RESERVATION_STATUS)[number];