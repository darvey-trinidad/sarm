import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import {
  createClassroomSchedule,
  createClassroomVacancy,
  createClassroomBorrowing,
  deleteClassroomBorrowing,
  createRoomRequest
} from "@/lib/api/classroom-schedule/mutation";
import {
  createClassroomScheduleSchema,
  createClassroomVacancySchema,
  createClassroomBorrowingSchema,
  getWeeklyClassroomScheduleSchema,
  cancelClassroomBorrowingSchema,
  createRoomRequestSchema,
} from "@/server/api-utils/validators/classroom-schedule";
import { getRoomRequestById, getWeeklyClassroomSchedule } from "@/lib/api/classroom-schedule/query";
import { mergeAdjacentTimeslots } from "@/lib/helper/classroom-schedule";
import z from "zod";
import { env } from "@/env";
import { Resend } from "resend";
import { RequestRoomEmail } from "@/emails/room-request";
import { generateUUID } from "@/lib/utils";

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
      const { id: roomRequestId } = await createRoomRequest({ id: generateUUID(), ...input });
      console.log("Room Request ID: ", roomRequestId);

      const roomRequestRecord = await getRoomRequestById(roomRequestId);
      console.log("Room Request Record: ", roomRequestRecord);

      const { data, error } = await resend.emails.send({
        from: "SARM Notification <onboarding@resend.dev>",
        to: roomRequestRecord?.responderEmail || "",
        subject: "Room Request",
        react: RequestRoomEmail({
          classroomName: roomRequestRecord?.classroomName || "",
          date: roomRequestRecord?.date || new Date(),
          startTime: roomRequestRecord?.startTime || 700,
          endTime: roomRequestRecord?.endTime || 2000,
          subject: roomRequestRecord?.subject || "",
          section: roomRequestRecord?.section || "",
          requestorName: roomRequestRecord?.requestorName || "",
          lendUrl: `facebook.com`,
          declineUrl: `facebook.com`,
        }),
      })

      if (error) {
        console.error(error);
        return { error, status: 500 };
      }
      console.log("Email Sent: ", data);
      return { data, status: 200 };
    })
});
