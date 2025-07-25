export const ROLES = [
  "facility_manager",
  "department_head",
  "faculty",
  "student_organization",
  "classroom_manager",
] as const;

export type Roles = (typeof ROLES)[number];
