import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { createClassroomSchedule, createClassroomVacancy, createClassroomBorrowing } from "@/lib/api/classroom-schedule/mutation";
import { createClassroomScheduleSchema, createClassroomVacancySchema, createClassroomBorrowingSchema, getClassroomScheduleSchema } from "@/server/api-utils/validators/classroom-schedule";
import { getClassroomSchedule } from "@/lib/api/classroom-schedule/query";
import { mergeAdjacentTimeslots } from "@/lib/helper/classroom-schedule";

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
  getClassroomSchedule: protectedProcedure
    .input(getClassroomScheduleSchema)
    .query(async ({ input }) => {
      return getClassroomSchedule(input.classroomId, input.date).then((timeslots) => mergeAdjacentTimeslots(timeslots));
    }),
});