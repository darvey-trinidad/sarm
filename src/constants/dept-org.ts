export const DEPARTMENTS = [
  "itds",
  "bindtech",
  "gate",
  "gba",
  "htm",
] as const

export const DEPARTMENT_OR_ORGANIZATION = [
  // departments
  ...DEPARTMENTS,
  // organizations
  "elites",
  "abacus",
  "abatharm",
  "aise",
  "student_council",
  "laurel_publication"
] as const;

export const DepartmentValues = {
  ITDS: DEPARTMENTS[0],
  BINDTECH: DEPARTMENTS[1],
  GATE: DEPARTMENTS[2],
  GBA: DEPARTMENTS[3],
  HTM: DEPARTMENTS[4],
}


export const DEPARTMENT_OR_ORGANIZATION_OPTIONS = DEPARTMENT_OR_ORGANIZATION.map((item) => ({
  value: item,
  label: item
    .split("_")
    .map((word) => word[0]?.toUpperCase() + word.slice(1))
    .join(" "),
}));

export const DeptOrOrgValues = {
  ITDS: DEPARTMENT_OR_ORGANIZATION[0],
  BINDTECH: DEPARTMENT_OR_ORGANIZATION[1],
  GATE: DEPARTMENT_OR_ORGANIZATION[2],
  GBA: DEPARTMENT_OR_ORGANIZATION[3],
  HTM: DEPARTMENT_OR_ORGANIZATION[4],
  ELITES: DEPARTMENT_OR_ORGANIZATION[5],
  ABACUS: DEPARTMENT_OR_ORGANIZATION[6],
  ABATHARM: DEPARTMENT_OR_ORGANIZATION[7],
  AISE: DEPARTMENT_OR_ORGANIZATION[8],
  STUDENT_COUNCIL: DEPARTMENT_OR_ORGANIZATION[9],
  LAUREL_PUBLICATION: DEPARTMENT_OR_ORGANIZATION[10],
}

export type Department = typeof DEPARTMENTS[number];

export type DepartmentOrOrganization = typeof DEPARTMENT_OR_ORGANIZATION[number];