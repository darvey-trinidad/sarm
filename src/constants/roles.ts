export const TEACHING_PERSONNEL = [
  "faculty",
  "department_head",
  "pe_instructor",
] as const;

export const ROLES = [
  "facility_manager",
  "student_organization",
  "classroom_manager",
  ...TEACHING_PERSONNEL,
] as const;

export const ADMIN_ROLE = ROLES[0];

export const ROLES_OPTIONS = ROLES.map((role) => ({
  value: role,
  label: role
    .split("_")
    .map((word) => word[0]?.toUpperCase() + word.slice(1))
    .join(" "),
}));

export type Roles = (typeof ROLES)[number];

export const ROLE_LABELS: Record<string, string> = {
  facility_manager: "Facility Manager",
  student_organization: "Student Organization",
  classroom_manager: "Classroom Manager",
  faculty: "Faculty",
  department_head: "Department Head",
  pe_instructor: "P.E. Instructor",
};

export const Roles = {
  FacilityManager: ROLES[0],
  StudentOrganization: ROLES[1],
  ClassroomManager: ROLES[2],
  Faculty: ROLES[3],
  DepartmentHead: ROLES[4],
  PEInstructor: ROLES[5],
};
