import z from "zod";
import type { NewResource } from "@/server/db/types/resource";
import { RESOURCE_CATEGORY } from "@/constants/resource-category";

export const createResourceSchema = z.object({
  name: z.string(),
  category: z.enum(RESOURCE_CATEGORY),
  description: z.string().optional(),
  stock: z.number().optional(),
});

export const addResourceQuantitySchema = z.object({
  id: z.string(),
  quantity: z.number(),
});