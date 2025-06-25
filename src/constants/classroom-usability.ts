export const CLASSROOM_USABILITY = [
  "operational", 
  "non-operational"
] as const;

export type classroomUsability = (typeof CLASSROOM_USABILITY)[number];