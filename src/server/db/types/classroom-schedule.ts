import { classroomSchedule, classroomVacancy, classroomBorrowing } from "@/server/db/schema/classroom-schedule";
import { type InferInsertModel } from "drizzle-orm";

export type ClassroomSchedule = InferInsertModel<typeof classroomSchedule>;
export type ClassroomScheduleWithoutId = Omit<ClassroomSchedule, "id">;

export type ClassroomVacancy = InferInsertModel<typeof classroomVacancy>;
export type ClassroomVacancyWithoutId = Omit<ClassroomVacancy, "id">;

export type ClassroomBorrowing = InferInsertModel<typeof classroomBorrowing>;
export type ClassroomBorrowingWithoutId = Omit<ClassroomBorrowing, "id">;

export type EditClassroomSchedule = { id: string } & Partial<Omit<ClassroomSchedule, "id">>;
export type EditClassroomVacancy = { id: string } & Partial<Omit<ClassroomVacancy, "id">>;
export type EditClassroomBorrowing = { id: string } & Partial<Omit<ClassroomBorrowing, "id">>;  