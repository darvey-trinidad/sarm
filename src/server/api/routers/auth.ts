import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { auth } from "@/lib/auth";
import { z } from "zod";
import { signupSchema } from "@/server/api-utils/validators/auth";

export const authRouter = createTRPCRouter({
  signUp: publicProcedure
    .input(signupSchema)
    .mutation(({ input }) => {
      const res = auth.api.signUpEmail({
        body: {
          email: input.email,
          password: input.password,
          name: input.name,
          role: input.role,
          departmentOrOrganization: input.departmentOrOrganization,
        }
      });
      return res;
    }),
});