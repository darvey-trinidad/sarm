import nodemailer from "nodemailer";
import { env } from "@/env";
import { render } from "@react-email/render";
import { TIME_MAP } from "@/constants/timeslot";
import { toTimeInt } from "@/lib/utils";
import { RoomRequestResponseEmail } from "@/emails/room-request-response";
import { getRoomRequestById } from "@/lib/api/classroom-schedule/query";

export const notifyRoomRequestor = async (roomRequestId: string) => {
  try {

    const roomRequest = await getRoomRequestById(roomRequestId);
    if (!roomRequest) {
      throw new Error("Room request not found");
    }

    const emailHtml = await render(RoomRequestResponseEmail({
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