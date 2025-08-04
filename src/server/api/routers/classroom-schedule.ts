import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { createClassroomSchedule, createClassroomVacancy, createClassroomBorrowing } from "@/lib/api/classroom-schedule/mutation";
import { createClassroomScheduleSchema, createClassroomVacancySchema, createClassroomBorrowingSchema } from "@/server/api-utils/validators/classroom-schedule";

export const classroomScheduleRouter = createTRPCRouter({
  createClassroomSchedule: protectedProcedure
    .input(createClassroomScheduleSchema)
    .mutation(({ input }) => {
      return createClassroomSchedule(input);
    }),
  createClassroomVacancy: protectedProcedure
    .input(createClassroomVacancySchema)
    .mutation(({ input }) => {
      return createClassroomVacancy(input);
    }),
  createClassroomBorrowing: protectedProcedure
    .input(createClassroomBorrowingSchema)
    .mutation(({ input }) => {
      return createClassroomBorrowing(input);
    }),
});