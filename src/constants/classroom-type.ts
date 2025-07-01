export const CLASSROOM_TYPE = [
  "lecture",
  "laboratory"
] as const;

export type ClassroomType = (typeof CLASSROOM_TYPE)[number];