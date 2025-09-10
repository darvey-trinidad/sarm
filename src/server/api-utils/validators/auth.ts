import { z } from "zod";
import { ROLES } from "@/constants/roles";

export const signupSchema = z.object({
  email: z.string().email(),
  password: z.string(),
  name: z.string(),
  role: z.enum(ROLES),
  departmentOrOrganization: z.string().optional(),
});

export const getAllSchedulableFacultySchema = z.object({ role: z.string(), departmentOrOrganization: z.string() })

export type SignupInput = z.infer<typeof signupSchema>;