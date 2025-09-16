import { classroomSchedule, classroomVacancy, classroomBorrowing, roomRequests } from "@/server/db/schema/classroom-schedule";
import { type InferInsertModel } from "drizzle-orm";
import { r } from "node_modules/better-auth/dist/shared/better-auth.ClXlabtY";

export type ClassroomSchedule = InferInsertModel<typeof classroomSchedule>;
export type ClassroomScheduleWithoutId = Omit<ClassroomSchedule, "id">;

export type ClassroomVacancy = InferInsertModel<typeof classroomVacancy>;
export type ClassroomVacancyWithoutId = Omit<ClassroomVacancy, "id">;

export type ClassroomBorrowing = InferInsertModel<typeof classroomBorrowing>;
export type ClassroomBorrowingWithoutId = Omit<ClassroomBorrowing, "id">;

export type EditClassroomSchedule = { id: string } & Partial<Omit<ClassroomSchedule, "id">>;
export type EditClassroomVacancy = { id: string } & Partial<Omit<ClassroomVacancy, "id">>;
export type EditClassroomBorrowing = { id: string } & Partial<Omit<ClassroomBorrowing, "id">>;

export type RoomRequest = InferInsertModel<typeof roomRequests>;