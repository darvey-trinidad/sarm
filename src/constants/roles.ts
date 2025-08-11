export const TEACHING_PERSONNEL = ["faculty", "department_head"] as const;

export const ROLES = [
  "facility_manager",
  "student_organization",
  "classroom_manager",
  ...TEACHING_PERSONNEL,
] as const;

export const ROLES_OPTIONS = ROLES.map((role) => ({
  value: role,
  label: role
    .split("_")
    .map((word) => word[0]?.toUpperCase() + word.slice(1))
    .join(" "),
}));

export type Roles = (typeof ROLES)[number];
