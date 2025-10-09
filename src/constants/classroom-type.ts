export const CLASSROOM_TYPE = [
  "lecture",
  "laboratory",
  "computer_laboratory",
  "hm_laboratory",
  "chemistry_laboratory",
  "biology_laboratory",
  "physics_laboratory",
  "electronics_laboratory",
  "drafting_laboratory"
] as const;

export const ClassroomTypeValues = {
  Lecture: CLASSROOM_TYPE[0],
  Laboratory: CLASSROOM_TYPE[1],
  ComputerLaboratory: CLASSROOM_TYPE[2],
  HMLaboratory: CLASSROOM_TYPE[3],
  ChemistryLaboratory: CLASSROOM_TYPE[4],
  BiologyLaboratory: CLASSROOM_TYPE[5],
  PhysicsLaboratory: CLASSROOM_TYPE[6],
  ElectronicsLaboratory: CLASSROOM_TYPE[7],
  DraftingLaboratory: CLASSROOM_TYPE[8],
}

export type ClassroomType = (typeof CLASSROOM_TYPE)[number];

export const CLASSROOM_TYPE_LABELS: Record<ClassroomType, string> = Object.fromEntries(
  CLASSROOM_TYPE.map((type) => [
    type,
    type
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" "),
  ])
) as Record<ClassroomType, string>;

export const CLASSROOM_TYPE_OPTIONS = CLASSROOM_TYPE.map((type) => ({
  value: type,
  label: type.split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" "),
}));
