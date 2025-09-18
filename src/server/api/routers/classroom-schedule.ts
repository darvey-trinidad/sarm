import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import {
  createClassroomSchedule,
  createClassroomVacancy,
  createClassroomBorrowing,
  deleteClassroomBorrowing,
  createRoomRequest,
  updateRoomRequestStatus
} from "@/lib/api/classroom-schedule/mutation";
import {
  createClassroomScheduleSchema,
  createClassroomVacancySchema,
  createClassroomBorrowingSchema,
  getWeeklyClassroomScheduleSchema,
  cancelClassroomBorrowingSchema,
  createRoomRequestSchema,
  respondToRoomRequestSchema,
} from "@/server/api-utils/validators/classroom-schedule";
import { getRoomRequestById, getWeeklyClassroomSchedule } from "@/lib/api/classroom-schedule/query";
import { mergeAdjacentTimeslots } from "@/lib/helper/classroom-schedule";
import { env } from "@/env";
import { RequestRoomEmail } from "@/emails/room-request";
import { generateUUID } from "@/lib/utils";
import nodemailer from "nodemailer";
import { render } from "@react-email/render";
import { RoomRequestStatus } from "@/constants/room-request-status";
import { TRPCError } from "@trpc/server";
import z from "zod";

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
      try {
        console.log("Received Request to Borrow Classroom: ", input);
        const { id: roomRequestId } = await createRoomRequest({ id: generateUUID(), ...input });
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
            classroomName: roomRequestRecord?.classroomName || "",
            date: roomRequestRecord?.date || new Date(),
            startTime: roomRequestRecord?.startTime || 700,
            endTime: roomRequestRecord?.endTime || 2000,
            subject: roomRequestRecord?.subject || "",
            section: roomRequestRecord?.section || "",
            requestorName: roomRequestRecord?.requestorName || "",
            respondUrl: `${env.NEXT_PUBLIC_APP_URL}/respond/${roomRequestId}`,
          })
        );

        const info = await transporter.sendMail({
          from: `"SARM Notification" <${env.GOOGLE_EMAIL_USER}>`,
          to: roomRequestRecord?.responderEmail || "",
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
          createClassroomVacancy({
            classroomId: roomRequestRecord.classroomId,
            date: roomRequestRecord.date,
            startTime: roomRequestRecord.startTime,
            endTime: roomRequestRecord.endTime
          });
          createClassroomBorrowing({
            classroomId: roomRequestRecord.classroomId,
            date: roomRequestRecord.date,
            startTime: roomRequestRecord.startTime,
            endTime: roomRequestRecord.endTime,
            facultyId: roomRequestRecord.requestorId,
            subject: roomRequestRecord.subject,
            section: roomRequestRecord.section
          })
        }
        updateRoomRequestStatus(input.roomRequestId, input.status);

        return { info: "Room Request Responded", status: 200 };
      } catch (error) {
        console.error(error);
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Could not respond to room request" });
      }
    }),
  getRoomRequestById: protectedProcedure
    .input(z.object({ roomRequestId: z.string() }))
    .query(async ({ input }) => {
      return getRoomRequestById(input.roomRequestId);
    }),
});
