import { z } from "zod";
import { RESOURCE_CATEGORY } from "@/constants/resource-category";
export const ResourceSchema = z.object({
  name: z.string().min(1, { message: "Please enter a name" }),
  description: z.string().min(1, { message: "Please enter a description" }),
  category: z.enum(RESOURCE_CATEGORY, { message: "Please select a category" }),
  stock: z.coerce.number({ invalid_type_error: "Stock must be a number" }).min(1, { message: "Stock must be greater than 0" }),
});
