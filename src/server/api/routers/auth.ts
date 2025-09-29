import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { auth } from "@/lib/auth";
import { z } from "zod";
import { signupSchema, getAllSchedulableFacultySchema } from "@/server/api-utils/validators/auth";
import { getAllFaculty, getAllPeInstructors, getAllSchedulableFaculty, getAllUsers } from "@/lib/api/auth/query";

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
  })
  //darvs pagawa ng delete user dito ah labyu
});
