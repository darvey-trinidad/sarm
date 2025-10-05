import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import {
  createClassroomSchedule,
  createClassroomVacancy,
  createClassroomBorrowing,
  deleteClassroomBorrowing,
  createRoomRequest,
  updateRoomRequestStatus,
} from "@/lib/api/classroom-schedule/mutation";
import {
  createClassroomScheduleSchema,
  createClassroomVacancySchema,
  createClassroomBorrowingSchema,
  getWeeklyClassroomScheduleSchema,
  cancelClassroomBorrowingSchema,
  createRoomRequestSchema,
  respondToRoomRequestSchema,
  getAvailableClassroomsSchema,
  getCurrentlyAvailableClassroomsSchema,
  getProfessorSchedulesForDateSchema,
} from "@/server/api-utils/validators/classroom-schedule";
import {
  getAvailableClassrooms,
  getCurrentlyAvailableClassrooms,
  getProfessorSchedulesForDate,
  getRoomRequestById,
  getRoomRequestsByResponderId,
  getWeeklyClassroomSchedule,
  getWeeklyInitialClassroomSchedule,
} from "@/lib/api/classroom-schedule/query";
import {
  mergeAdjacentInitialSchedules,
  mergeAdjacentTimeslots,
} from "@/lib/helper/classroom-schedule";
import { env } from "@/env";
import { RequestRoomEmail } from "@/emails/room-request";
import { generateUUID } from "@/lib/utils";
import nodemailer from "nodemailer";
import { render } from "@react-email/render";
import { RoomRequestStatus } from "@/constants/room-request-status";
import { TRPCError } from "@trpc/server";
import z from "zod";
import { notifyRoomRequestor } from "@/emails/notify-room-requestor";
import { c } from "node_modules/better-auth/dist/shared/better-auth.ClXlabtY";

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
      const res = await getWeeklyClassroomSchedule(
        input.classroomId,
        input.startDate,
        input.endDate,
      ).then((timeslots) => mergeAdjacentTimeslots(timeslots));
      return res;
    }),
  getWeeklyInitialClassroomSchedule: protectedProcedure
    .input(z.object({ classroomId: z.string() }))
    .query(async ({ input }) => {
      return getWeeklyInitialClassroomSchedule(input.classroomId).then(
        (timeslots) => mergeAdjacentInitialSchedules(timeslots),
      );
    }),
  getAvailableClassrooms: protectedProcedure
    .input(getAvailableClassroomsSchema)
    .query(({ input }) => {
      return getAvailableClassrooms(
        input.date,
        input.startTime,
        input.endTime,
        input.filters,
      );
    }),
  getCurrentlyAvailableClassrooms: protectedProcedure
    .input(getCurrentlyAvailableClassroomsSchema)
    .query(async ({ input }) => {
      return await getCurrentlyAvailableClassrooms(
        input.date,
        input.startBlock,
      );
    }),
  getProfessorSchedulesForDate: protectedProcedure
    .input(getProfessorSchedulesForDateSchema)
    .query(({ input }) => {
      console.log(input);
      const res = getProfessorSchedulesForDate(
        input.facultyId,
        input.date,
      ).then((timeslots) => mergeAdjacentTimeslots(timeslots));
      return res;
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
      try {
        console.log("Received Request to Borrow Classroom: ", input);
        const { id: roomRequestId } = await createRoomRequest({
          id: generateUUID(),
          ...input,
        });
        console.log("Room Request ID: ", roomRequestId);

        const roomRequestRecord = await getRoomRequestById(roomRequestId);
        console.log("Room Request Record: ", roomRequestRecord);

        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: env.GOOGLE_EMAIL_USER,
            pass: env.GOOGLE_APP_PASSWORD,
          },
        });

        const emailHtml = await render(
          RequestRoomEmail({
            classroomName: roomRequestRecord?.classroomName ?? "",
            date: roomRequestRecord?.date ?? new Date(),
            startTime: roomRequestRecord?.startTime ?? 700,
            endTime: roomRequestRecord?.endTime ?? 2000,
            subject: roomRequestRecord?.subject ?? "",
            section: roomRequestRecord?.section ?? "",
            requestorName: roomRequestRecord?.requestorName ?? "",
            respondUrl: `${env.NEXT_PUBLIC_APP_URL}/respond/${roomRequestId}`,
          }),
        );

        const info = await transporter.sendMail({
          from: `"SARM Notification" <${env.GOOGLE_EMAIL_USER}>`,
          to: roomRequestRecord?.responderEmail ?? "",
          subject: "Room Request",
          html: emailHtml,
        });

        console.log("Email Sent: ", info);
        return { info, status: 200 };
      } catch (error) {
        console.error(error);
        return { error, status: 500 };
      }
    }),
  respondToRoomRequest: protectedProcedure
    .input(respondToRoomRequestSchema)
    .mutation(async ({ input }) => {
      try {
        const roomRequestRecord = await getRoomRequestById(input.roomRequestId);

        if (!roomRequestRecord) {
          return { error: "Room Request not found", status: 404 };
        }

        if (input.status === RoomRequestStatus.Accepted) {
          await createClassroomVacancy({
            classroomId: roomRequestRecord.classroomId,
            date: roomRequestRecord.date,
            startTime: roomRequestRecord.startTime,
            endTime: roomRequestRecord.endTime,
          });
          await createClassroomBorrowing({
            classroomId: roomRequestRecord.classroomId,
            date: roomRequestRecord.date,
            startTime: roomRequestRecord.startTime,
            endTime: roomRequestRecord.endTime,
            facultyId: roomRequestRecord.requestorId,
            subject: roomRequestRecord.subject,
            section: roomRequestRecord.section,
          });
        }
        await updateRoomRequestStatus(input.roomRequestId, input.status);
        await notifyRoomRequestor(input.roomRequestId);

        return { info: "Room Request Responded", status: 200 };
      } catch (error) {
        console.error(error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Could not respond to room request",
        });
      }
    }),
  getRoomRequestById: protectedProcedure
    .input(z.object({ roomRequestId: z.string() }))
    .query(async ({ input }) => {
      return getRoomRequestById(input.roomRequestId);
    }),
  getRoomRequestsByResponderId: protectedProcedure
    .input(z.object({ responderId: z.string() }))
    .query(async ({ input }) => {
      const res = await getRoomRequestsByResponderId(input.responderId);
      console.log(res);
      return res;
    }),
});
