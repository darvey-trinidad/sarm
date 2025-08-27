export const DAYS = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday"
] as const;

export type Days = (typeof DAYS)[number];

export const DAYS_OPTIONS = DAYS.map((day, index) => ({
  value: index + 1,
  label: day.charAt(0).toUpperCase() + day.slice(1),
}));