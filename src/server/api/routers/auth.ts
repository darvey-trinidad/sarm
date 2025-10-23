import { createTRPCRouter, protectedProcedure, publicProcedure } from "@/server/api/trpc";
import { auth } from "@/lib/auth";
import { z } from "zod";
import { signupSchema, getAllSchedulableFacultySchema, editUserProfileSchema } from "@/server/api-utils/validators/auth";
import { getAllFaculty, getAllFacultyByDepartment, getAllPeInstructors, getAllSchedulableFaculty, getAllUsers, getUserById } from "@/lib/api/auth/query";
import { env } from "@/env";
import { TRPCError } from "@trpc/server";
import { editUserProfile, editUserRole, toggleUserIsActive } from "@/lib/api/auth/mutation";
import { notifyAccountActivated } from "@/emails/notify-account-activation";
import { tr } from "date-fns/locale";
import { ROLES, Roles } from "@/constants/roles";

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
  toggleUserIsActive: protectedProcedure
    .input(z.object({ id: z.string(), isActive: z.boolean() }))
    .mutation(async ({ input }) => {
      try {
        const toggleResult = await toggleUserIsActive(input.id, input.isActive);
        if (!toggleResult) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Failed to change user status",
          });
        }
        await notifyAccountActivated(input.id);
        return {
          success: true,
          message: "Status changed and email sent successfully",
        }
      } catch (error) {
        console.log(error);
        throw error;
      }
    }),
  getUserById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(({ input }) => {
      return getUserById(input.id);
    }),
  getAllFaculty: protectedProcedure.query(() => {
    return getAllFaculty();
  }),
  getAllSchedulableFaculty: protectedProcedure
    .input(getAllSchedulableFacultySchema)
    .query(({ input }) => {
      const data = getAllSchedulableFaculty(input.role, input.departmentOrOrganization);
      return data;
    }),
  getAllFacultyByDepartment: protectedProcedure
    .query(({ ctx }) => {
      if (
        ctx.session?.user.role !== Roles.DepartmentHead ||
        !ctx.session?.user.departmentOrOrganization
      ) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You must be a department head to view faculty by department",
        });
      }
      return getAllFacultyByDepartment(ctx.session.user.departmentOrOrganization);
    }),
  getAllUsers: protectedProcedure.query(() => {
    return getAllUsers();
  }),
  getAllPeInstructors: protectedProcedure.query(() => {
    return getAllPeInstructors();
  }),
  editUserProfile: protectedProcedure
    .input(editUserProfileSchema)
    .mutation(({ input }) => {
      try {
        const { id, ...data } = input;
        return editUserProfile(id, data);
      } catch (error) {
        throw error;
      }
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

  transferDepartmentHeadRole: protectedProcedure
    .input(z.object({ newDeptHeadUserId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      try {
        if (!ctx.session) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "You must be logged in to change user role",
          });
        }

        const newDeptHead = await editUserRole(input.newDeptHeadUserId, Roles.DepartmentHead);
        if (!newDeptHead) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Failed to change user role",
          });
        }

        const oldDeptHead = await editUserRole(ctx.session.user.id, Roles.Faculty);
        if (!oldDeptHead) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Failed to change user role",
          });
        }

        return {
          success: true,
          message: "Role transfered successfully"
        }
      } catch (error) {
        console.log(error);
        throw error;
      }
    }),

  transferFacilityManagerRole: protectedProcedure
    .input(z.object({ newFacilityManagerUserId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      try {
        if (!ctx.session) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "You must be logged in to change user role",
          });
        }

        const newFacilityManager = await editUserRole(input.newFacilityManagerUserId, Roles.FacilityManager);
        if (!newFacilityManager) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Failed to change user role",
          });
        }

        const oldFacilityManager = await editUserRole(ctx.session.user.id, Roles.Faculty);
        if (!oldFacilityManager) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Failed to change user role",
          });
        }

        return {
          success: true,
          message: "Role transfered successfully"
        }
      } catch (error) {
        console.log(error);
        throw error;
      }
    }),

  editUserRole: protectedProcedure
    .input(z.object({ userId: z.string(), role: z.enum(ROLES) }))
    .mutation(async ({ input }) => {
      try {
        const result = await editUserRole(input.userId, input.role);

        if (!result) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Failed to change user role",
          });
        }

        return {
          success: true,
          message: "Role changed successfully"
        }
      } catch (error) {
        console.log(error);
        throw error;
      }
    })
});
