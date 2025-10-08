import nodemailer from "nodemailer";
import { env } from "@/env";
import { db, eq } from "@/server/db";
import { venue, venueReservation } from "@/server/db/schema/venue";
import { user } from "@/server/db/schema/auth";
import { render } from "@react-email/render";
import { TIME_MAP } from "@/constants/timeslot";
import { toTimeInt } from "@/lib/utils";
import { ReservationRequestEmail } from "./reservation-request";
import { Roles } from "@/constants/roles";

export const notifyFmReservation = async (venueReservationId: string) => {

  const reservation = await db
    .select()
    .from(venueReservation)
    .where(eq(venueReservation.id, venueReservationId))
    .innerJoin(venue, eq(venue.id, venueReservation.venueId))
    .innerJoin(user, eq(user.id, venueReservation.reserverId))
    .get();

  if (!reservation) return;

  console.log("RESERVATION INSIDE NOTIFY FM: ", reservation);

  if (reservation.user.role == Roles.FacilityManager) return;

  const fmRecipients = await db
    .select()
    .from(user)
    .where(eq(user.role, Roles.FacilityManager))
    .all();

  if (!fmRecipients) return;

  const emailHtml = await render(
    ReservationRequestEmail({
      date: reservation.venue_reservation.date.toLocaleDateString('en-PH', {
        weekday: 'long',  // Long format for the day of the week (e.g., "Tuesday")
        month: 'long',    // Full month name (e.g., "September")
        day: 'numeric',   // Day of the month (e.g., "23")
        year: 'numeric',  // Full year (e.g., "2025")
      }),
      time: `${TIME_MAP[toTimeInt(reservation.venue_reservation.startTime)]} - ${TIME_MAP[toTimeInt(reservation.venue_reservation.endTime)]}`,
      venueName: reservation.venue.name,
      reserverName: reservation.user.name ?? "",
      purpose: reservation.venue_reservation.purpose
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
    to: fmRecipients.map((r) => r.email),
    subject: "New Venue Reservation Request",
    html: emailHtml,
  });
  return info;
}