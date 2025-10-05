export const RESERVATION_STATUS = [
  "pending",
  "approved",
  "rejected",
  "canceled",
] as const;

type ReservationStatusKeys = Capitalize<(typeof RESERVATION_STATUS)[number]>;

// helper to convert snake_case → PascalCase
const toPascal = (str: string) =>
  str
    .split("_")
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join("");

export const ReservationStatus = Object.fromEntries(
  RESERVATION_STATUS.map((status) => [toPascal(status), status]),
) as Record<ReservationStatusKeys, (typeof RESERVATION_STATUS)[number]>;

export const DEFAULT_RESERVATION_STATUS = RESERVATION_STATUS[0];

export type ReservationStatus = (typeof RESERVATION_STATUS)[number];

export const RESERVATION_STATUS_OPTIONS = RESERVATION_STATUS.map((status) => ({
  value: status,
  label: status.charAt(0).toUpperCase() + status.slice(1),
}));
