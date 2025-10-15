import { z } from "zod";
import { RESOURCE_CATEGORY } from "@/constants/resource-category";
export const EditResourceSchema = z.object({
  name: z.string().min(1, "Resource name is required"),
  description: z.string().optional(),
  category: z.enum(RESOURCE_CATEGORY),
});
