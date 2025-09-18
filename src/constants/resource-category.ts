export const RESOURCE_CATEGORY = [
  "electrical",
  "electronics",
  "audio",
  "visual",
  "furniture",
  "event_materials",
  "office_supply",
  "cleaning_equipment",
  "laboratory_equipment",
] as const;

export const DEFAULT_RESOURCE_CATEGORY = RESOURCE_CATEGORY[0];

export const RESOURCE_OPTIONS = RESOURCE_CATEGORY.map((category) => ({
  value: category,
  label: category
    .split("_")
    .map((word) => word[0]?.toUpperCase() + word.slice(1))
    .join(" "),
}));
