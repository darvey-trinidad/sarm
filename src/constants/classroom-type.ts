export const CLASSROOM_TYPE = [
  "lecture",
  "laboratory"
] as const;

export type classroomType = (typeof CLASSROOM_TYPE)[number];