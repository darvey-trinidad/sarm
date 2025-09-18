export const CLASSROOM_TYPE = ["lecture", "laboratory"] as const;

export type ClassroomType = (typeof CLASSROOM_TYPE)[number];

export const CLASSROOM_TYPE_OPTIONS = CLASSROOM_TYPE.map((type) => ({
  value: type,
  label: type.charAt(0).toUpperCase() + type.slice(1),
}));
