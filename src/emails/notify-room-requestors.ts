import nodemailer from "nodemailer";
import { env } from "@/env";
import { render } from "@react-email/render";
import { getConflictingRoomRequests } from "@/lib/api/classroom-schedule/query";
import { AutoDeclineRoomRequestEmail } from "./autodecline-room-request";

type ConflictedRoomRequests = Awaited<ReturnType<typeof getConflictingRoomRequests>>[number];

export const notifyConflictingRoomRequestor = async (roomRequest: ConflictedRoomRequests) => {
  try {

    const emailHtml = await render(AutoDeclineRoomRequestEmail({
      classroomName: roomRequest.classroomName,
      date: roomRequest.date,
      startTime: roomRequest.startTime,
      endTime: roomRequest.endTime,
      subject: roomRequest.subject,
      section: roomRequest.section,
      responderName: roomRequest.responderName,
      status: roomRequest.status,
    }));

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: env.GOOGLE_EMAIL_USER,
        pass: env.GOOGLE_APP_PASSWORD,
      },
    });

    const info = await transporter.sendMail({
      from: `"SARM Notification" <${env.GOOGLE_EMAIL_USER}>`,
      to: roomRequest.requestorEmail,
      subject: "Room Request Update",
      html: emailHtml,
    });
    console.log("Email sent: ", info);
    return info;
  } catch (error) {
    console.error("Error sending email: ", error);
    throw error;
  }
}