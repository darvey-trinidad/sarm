import nodemailer from "nodemailer";
import { env } from "@/env";
import { getAllPeInstructors } from "@/lib/api/auth/query";
import { db, eq } from "@/server/db";
import { venue, venueReservation } from "@/server/db/schema/venue";
import { user } from "@/server/db/schema/auth";
import { render } from "@react-email/render";
import { VenueReservationEmail } from "@/emails/reservation-notification";
import { TIME_MAP } from "@/constants/timeslot";
import { toTimeInt } from "@/lib/utils";

export const notifyPeInstructors = async (venueReservationId: string) => {
  const recepients = await getAllPeInstructors();
  const recepientsEmails = recepients.map((r) => r.email);

  const reservation = await db
    .select()
    .from(venueReservation)
    .where(eq(venueReservation.id, venueReservationId))
    .innerJoin(venue, eq(venue.id, venueReservation.venueId))
    .innerJoin(user, eq(user.id, venueReservation.reserverId))
    .get();

  if (!reservation) return;

  const reservationVenue = reservation?.venue.name.toLowerCase().replace(" ", "");
  if (reservationVenue.includes("activitycenter")) return;

  const emailHtml = await render(
    VenueReservationEmail({
      date: reservation.venue_reservation.date.toLocaleDateString('en-PH', {
        weekday: 'long',  // Long format for the day of the week (e.g., "Tuesday")
        month: 'long',    // Full month name (e.g., "September")
        day: 'numeric',   // Day of the month (e.g., "23")
        year: 'numeric',  // Full year (e.g., "2025")
      }),
      venueName: "Activity Center",
      purpose: reservation.venue_reservation.purpose,
      time: `${TIME_MAP[toTimeInt(reservation.venue_reservation.startTime)]} - ${TIME_MAP[toTimeInt(reservation.venue_reservation.endTime)]}`,
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
    to: recepientsEmails,
    subject: "New Event Scheduled on Activity Center",
    html: emailHtml,
  });
  console.log("Email sent to Pe Instructors: ", info);
  return info;
}