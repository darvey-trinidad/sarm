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
import { env } from "@/env";
import { RequestRoomEmail } from "@/emails/room-request";
import { generateUUID } from "@/lib/utils";
import nodemailer from "nodemailer";
import { render } from "@react-email/render";

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
    })
});
