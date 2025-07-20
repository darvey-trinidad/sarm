import { z } from "zod";
import { ROLES } from "@/constants/roles";

export const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string(),
  role: z.enum(ROLES),
  department_or_organization: z.string().optional(),
  isActive: z.boolean().default(false),
});

export type SignupInput = z.infer<typeof signupSchema>;