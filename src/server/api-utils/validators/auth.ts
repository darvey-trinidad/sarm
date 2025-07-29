import { z } from "zod";
import { ROLES } from "@/constants/roles";

export const signupSchema = z.object({
  email: z.string().email(),
  password: z.string(),
  name: z.string(),
  role: z.enum(ROLES),
  departmentOrOrganization: z.string().optional(),
});

export type SignupInput = z.infer<typeof signupSchema>;