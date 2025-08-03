import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { createClassroomSchedule, createClassroomVacancy } from "@/lib/api/classroom-schedule/mutation";
import { createClassroomScheduleSchema, createClassroomVacancySchema } from "@/server/api-utils/validators/classroom-schedule";
import { generateUUID } from "@/lib/utils";
import { z } from "zod";

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
});