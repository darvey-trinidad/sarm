import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/server/db"; // your drizzle instance
import { nextCookies } from "better-auth/next-js";
import { user } from "@/server/db/schema/auth";
import * as schema from "@/server/db/schema/auth";
import nodemailer from "nodemailer";
import { env } from "@/env";
import { render } from "@react-email/render";
import { PasswordResetEmail } from "@/emails/password-reset";

export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "sqlite",
        schema,
    }),
    emailAndPassword: {
        enabled: true,
        autoSignIn: false,
        sendResetPassword: async ({ user, url, token }, request) => {
            // Render the email template
            const emailHtml = await render(
                PasswordResetEmail({
                    userName: user.name ?? "there",
                    resetUrl: url,
                })
            );

            // Create transporter (same as your existing setup)
            const transporter = nodemailer.createTransport({
                service: "gmail",
                auth: {
                    user: env.GOOGLE_EMAIL_USER,
                    pass: env.GOOGLE_APP_PASSWORD,
                },
            });

            // Send the email
            await transporter.sendMail({
                from: `"SARM Notification" <${env.GOOGLE_EMAIL_USER}>`,
                to: user.email,
                subject: "Reset Your Password",
                html: emailHtml,
            });
        },
        resetPasswordTokenExpiresIn: 3600, // 1 hour
        onPasswordReset: async ({ user }) => {
            // Optional: Log or perform actions after password reset
            console.log(`Password reset successful for: ${user.email}`);
        },
    },
    user: {
        additionalFields: {
            role: {
                type: "string",
                required: true,
                input: true, // true if user sets this in sign up, false if not
            },
            departmentOrOrganization: {
                type: "string",
                required: false,
                input: true,
            },
            name: {
                type: "string",
                required: false,
                input: true,
            },
        },
    },
    plugins: [nextCookies()],
});