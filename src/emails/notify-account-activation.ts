import nodemailer from "nodemailer";
import { env } from "@/env";
import { db, eq } from "@/server/db";
import { user } from "@/server/db/schema/auth";
import { render } from "@react-email/render";
import { AccountActivatedEmail } from "@/emails/account-activated";
import { PageRoutes } from "@/constants/page-routes";
import { TRPCError } from "@trpc/server";

export const notifyAccountActivated = async (userId: string) => {
  try {
    const activatedUser = await db
      .select()
      .from(user)
      .where(eq(user.id, userId))
      .get();

    if (!activatedUser) return;

    // Don't send if account is not active
    if (!activatedUser.isActive) return;

    const loginUrl = `${env.NEXT_PUBLIC_APP_URL}/${PageRoutes.LOGIN}`;

    const emailHtml = await render(
      AccountActivatedEmail({
        userName: activatedUser.name ?? "there",
        loginUrl,
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
      to: activatedUser.email,
      subject: "Your SARM Account is Now Active! 🎉",
      html: emailHtml,
    });

    if (!info) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Could not send account activation email" });

    return info;
  } catch (error) {
    console.error("Error sending account activation email:", error);
    throw error;
  }
};