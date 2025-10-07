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
import { VerifyEmail } from "@/emails/verify-email";

export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "sqlite",
        schema,
    }),
    emailAndPassword: {
        enabled: true,
        autoSignIn: false,
        requireEmailVerification: true,
        sendResetPassword: async ({ user, url, token }, request) => {
            // Render the email template
            const emailHtml = await render(
                PasswordResetEmail({
                    userName: user.name ?? "there",
                    resetUrl: url,
                })
            );

            const transporter = nodemailer.createTransport({
                service: "gmail",
                auth: {
                    user: env.GOOGLE_EMAIL_USER,
                    pass: env.GOOGLE_APP_PASSWORD,
                },
            });

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
    emailVerification: {
        sendOnSignUp: true, // Auto-send verification email on signup
        autoSignInAfterVerification: true, // Sign user in after they verify
        sendVerificationEmail: async ({ user, url, token }, request) => {
            const emailHtml = await render(
                VerifyEmail({
                    fullName: user.name ?? "there",
                    verifyUrl: url,
                })
            );

            const transporter = nodemailer.createTransport({
                service: "gmail",
                auth: {
                    user: env.GOOGLE_EMAIL_USER,
                    pass: env.GOOGLE_APP_PASSWORD,
                },
            });

            await transporter.sendMail({
                from: `"SARM Notification" <${env.GOOGLE_EMAIL_USER}>`,
                to: user.email,
                subject: "Verify Your Email Address",
                html: emailHtml,
            });
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
            isActive: {
                type: "boolean",
                required: false,
                input: false,
                defaultValue: false,
                exposeToSession: true,
            },
        },
    },
    plugins: [nextCookies()],
});