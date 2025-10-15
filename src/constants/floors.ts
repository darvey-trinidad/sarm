export const FLOORS = [
  "ground",
  "first",
  "second",
  "third",
  "fourth",
  "fifth",
] as const;

export type FloorType = (typeof FLOORS)[number];

//make dropdown option
export const FLOORS_OPTIONS = FLOORS.map((floor) => ({
  value: floor,
  label: floor.charAt(0).toUpperCase() + floor.slice(1),
}));

export const DEFAULT_FLOOR = "first";
