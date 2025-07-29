export const ROLES = [
  "facility_manager",
  "department_head",
  "faculty",
  "student_organization",
  "classroom_manager",
] as const;

export const ROLES_OPTIONS = ROLES.map((role) => ({
  value: role,
  label: role
    .split("_")
    .map((word) => word[0]?.toUpperCase() + word.slice(1))
    .join(" "),
}));

export type Roles = (typeof ROLES)[number];
