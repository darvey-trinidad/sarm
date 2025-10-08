export const DEPARTMENT_OR_ORGANIZATION = [
  // departments
  "itds",
  "bindtech",
  "gate",
  "gba",
  "htm",
  // organizations
  "elites",
  "abacus",
  "abatharm",
  "aise",
  "student_council",
  "laurel_publication"
] as const;

export const DEPARTMENT_OR_ORGANIZATION_OPTIONS = DEPARTMENT_OR_ORGANIZATION.map((item) => ({
  value: item,
  label: item
    .split("_")
    .map((word) => word[0]?.toUpperCase() + word.slice(1))
    .join(" "),
}));

export type DepartmentOrOrganization = typeof DEPARTMENT_OR_ORGANIZATION[number];