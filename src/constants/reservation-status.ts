
export const RESERVATION_STATUS = [
  "pending", 
  "for_submission", 
  "reserved", 
  "rejected",
  "canceled"
] as const;

export type ReservationStatus = (typeof RESERVATION_STATUS)[number];