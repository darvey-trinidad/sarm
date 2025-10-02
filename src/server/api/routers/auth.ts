import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { auth } from "@/lib/auth";
import { z } from "zod";
import { signupSchema, getAllSchedulableFacultySchema } from "@/server/api-utils/validators/auth";
import { getAllFaculty, getAllPeInstructors, getAllSchedulableFaculty, getAllUsers } from "@/lib/api/auth/query";
import { env } from "@/env";
import { TRPCError } from "@trpc/server";
import { toggleUserIsActive } from "@/lib/api/auth/mutation";

export const authRouter = createTRPCRouter({
  signUp: publicProcedure.input(signupSchema).mutation(({ input }) => {
    const res = auth.api.signUpEmail({
      body: {
        email: input.email,
        password: input.password,
        name: input.name,
        role: input.role,
        departmentOrOrganization: input.departmentOrOrganization,
      },
    });
    return res;
  }),
  toggleUserIsActive: publicProcedure
    .input(z.object({ id: z.string(), isActive: z.boolean() }))
    .mutation(({ input }) => {
      return toggleUserIsActive(input.id, input.isActive);
    }),
  getAllFaculty: publicProcedure.query(() => {
    return getAllFaculty();
  }),
  getAllSchedulableFaculty: publicProcedure
    .input(getAllSchedulableFacultySchema)
    .query(({ input }) => {
      const data = getAllSchedulableFaculty(input.role, input.departmentOrOrganization);
      return data;
    }),
  getAllUsers: publicProcedure.query(() => {
    return getAllUsers();
  }),
  getAllPeInstructors: publicProcedure.query(() => {
    return getAllPeInstructors();
  }),
  requestPasswordReset: publicProcedure
    .input(
      z.object({
        email: z.string().email("Please enter a valid email address"),
      })
    )
    .mutation(async ({ input }) => {
      try {
        await auth.api.forgetPassword({
          body: {
            email: input.email,
            redirectTo: `${env.NEXT_PUBLIC_APP_URL}/reset-password`,
          },
        });

        // Always return success even if email doesn't exist (security best practice)
        return {
          success: true,
          message: "If an account exists with this email, you will receive a password reset link."
        };
      } catch (error) {
        // Log error but don't expose to user
        console.error("Password reset request error:", error);
        return {
          success: true,
          message: "If an account exists with this email, you will receive a password reset link."
        };
      }
    }),

  resetPassword: publicProcedure
    .input(
      z.object({
        newPassword: z
          .string()
          .min(8, "Password must be at least 8 characters")
          .max(128, "Password must be less than 128 characters"),
        token: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        await auth.api.resetPassword({
          body: {
            newPassword: input.newPassword,
            token: input.token,
          },
        });

        return {
          success: true,
          message: "Password reset successful!"
        };
      } catch (error) {
        console.error("Password reset error:", error);
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Invalid or expired reset token. Please request a new password reset.",
        });
      }
    }),
});
