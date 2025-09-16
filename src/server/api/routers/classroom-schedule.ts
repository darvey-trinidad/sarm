import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import {
  createClassroomSchedule,
  createClassroomVacancy,
  createClassroomBorrowing,
  deleteClassroomBorrowing
} from "@/lib/api/classroom-schedule/mutation";
import {
  createClassroomScheduleSchema,
  createClassroomVacancySchema,
  createClassroomBorrowingSchema,
  getWeeklyClassroomScheduleSchema,
  cancelClassroomBorrowingSchema,
  createRoomRequestSchema,
} from "@/server/api-utils/validators/classroom-schedule";
import { getWeeklyClassroomSchedule } from "@/lib/api/classroom-schedule/query";
import { mergeAdjacentTimeslots } from "@/lib/helper/classroom-schedule";
import z from "zod";
import { env } from "@/env";
import { Resend } from "resend";
import { RequestRoomEmail } from "@/emails/room-request";

const resend = new Resend(env.RESEND_API_KEY);

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
  getWeeklyClassroomSchedule: protectedProcedure
    .input(getWeeklyClassroomScheduleSchema)
    .query(async ({ input }) => {
      return getWeeklyClassroomSchedule(input.classroomId, input.startDate, input.endDate)
        .then((timeslots) => mergeAdjacentTimeslots(timeslots));
    }),
  cancelClassroomBorrowing: protectedProcedure
    .input(cancelClassroomBorrowingSchema)
    .mutation(({ input }) => {
      console.log(input);
      return deleteClassroomBorrowing(input);
    }),
  createRoomRequest: protectedProcedure
    .input(createRoomRequestSchema)
    .mutation(async ({ input }) => {
      console.log("Received Request to Borrow Classroom: ", input);
    }),
  sendRoomRequest: protectedProcedure
    .input(z.object({ email: z.string() }))
    .mutation(async ({ input }) => {
      const { data, error } = await resend.emails.send({
        from: "SARM Notification <onboarding@resend.dev>",
        to: input.email,
        subject: "Room Request",
        react: RequestRoomEmail(),
      })

      if (error) {
        console.error(error);
        return { error, status: 500 };
      }

      return { data, status: 200 };
    }),
});
