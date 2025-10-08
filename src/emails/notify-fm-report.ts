import nodemailer from "nodemailer";
import { env } from "@/env";
import { db, eq } from "@/server/db";
import { facilityIssueReport } from "@/server/db/schema/facility-issue-report";
import { user } from "@/server/db/schema/auth";
import { render } from "@react-email/render";
import { FacilityIssueReportEmail } from "./facility-issue-report";
import { Roles } from "@/constants/roles";


export const notifyFmIssue = async (facilityIssueId: string) => {

  const issue = await db
    .select()
    .from(facilityIssueReport)
    .where(eq(facilityIssueReport.id, facilityIssueId))
    .get();

  if (!issue) return;

  console.log("FACILITY ISSUE INSIDE NOTIFY FM: ", issue);

  const fmRecipients = await db
    .select()
    .from(user)
    .where(eq(user.role, Roles.FacilityManager))
    .all();

  if (!fmRecipients || fmRecipients.length === 0) return;

  const emailHtml = await render(
    FacilityIssueReportEmail({
      description: issue.description,
      dateReported: issue.dateReported, // Adjust field name if different
    })
  );

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
    subject: "New Facility Issue Report",
    html: emailHtml,
  });

  return info;
};