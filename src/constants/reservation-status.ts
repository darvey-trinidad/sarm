
export const RESERVATION_STATUS = [
  "pending", 
  "for_submission", 
  "reserved", 
  "canceled"
] as const;

export type reservationStatus = (typeof RESERVATION_STATUS)[number];