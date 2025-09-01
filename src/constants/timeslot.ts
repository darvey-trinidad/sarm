import { z } from "zod";

/**
 * This is your single source of truth for all timeslot values.
 * Each tuple: [numeric value, label]
 * Example: [100, "1:00 AM"] maps 100 -> "1:00 AM"
 */
export const TIME_ENTRIES = [
  [700, "7:00 AM"],
  [800, "8:00 AM"],
  [900, "9:00 AM"],
  [1000, "10:00 AM"],
  [1100, "11:00 AM"],
  [1200, "12:00 PM"],
  [1300, "1:00 PM"],
  [1400, "2:00 PM"],
  [1500, "3:00 PM"],
  [1600, "4:00 PM"],
  [1700, "5:00 PM"],
  [1800, "6:00 PM"],
  [1900, "7:00 PM"],
] as const;

export const START_TIME = TIME_ENTRIES[0][0];
export const END_TIME = TIME_ENTRIES.at(-1)?.[0];
export const TIME_INTERVAL = 100;

// TIME_MAP for rendering
export const TIME_MAP: Record<TimeInt, string> = TIME_ENTRIES.reduce(
  (acc, [key, value]) => {
    acc[key] = value;
    return acc;
  },
  {} as Record<TimeInt, TimeString>,
);

export const TIME_KEYS = TIME_ENTRIES.map(([value]) => value) as number[];

export type TimeInt = (typeof TIME_ENTRIES)[number][0];
export type TimeString = (typeof TIME_ENTRIES)[number][1];
export const TIME_KEY_SET = new Set<number>(TIME_KEYS);

export const timeIntSchema = z
  .enum(TIME_KEYS.map(String) as [string, ...string[]])
  .transform(Number);

/* TIME_OPTIONS for dropdowns, etc.
  Example:
  [
    { value: 700, label: "7:00 AM" },
    { value: 800, label: "8:00 AM" },
  ]
  example usage:
  <select>
    {TIME_OPTIONS.map(opt => (
      <option key={opt.value} value={opt.value}>
        {opt.label}
      </option>
    ))}
  </select>
*/
export const TIME_OPTIONS = TIME_ENTRIES.map(([value, label]) => ({
  value,
  label,
}));
