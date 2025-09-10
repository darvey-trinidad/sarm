
export const RESERVATION_STATUS = [
  "pending",
  "for_submission",
  "reserved",
  "rejected",
  "canceled"
] as const;

type ReservationStatusKeys = Capitalize<
  typeof RESERVATION_STATUS[number]
>;

// helper to convert snake_case → PascalCase
const toPascal = (str: string) =>
  str
    .split("_")
    .map(s => s.charAt(0).toUpperCase() + s.slice(1))
    .join("");

export const ReservationStatus = Object.fromEntries(
  RESERVATION_STATUS.map(status => [toPascal(status), status])
) as Record<ReservationStatusKeys, typeof RESERVATION_STATUS[number]>;

// SAME AS:
// export const ReservationStatus = {
//   Pending: "pending",
//   ForSubmission: "for_submission",
//   Reserved: "reserved",
//   Rejected: "rejected",
//   Canceled: "canceled",
// } as const;


export const DEFAULT_RESERVATION_STATUS = RESERVATION_STATUS[0];

export type ReservationStatus = (typeof RESERVATION_STATUS)[number];