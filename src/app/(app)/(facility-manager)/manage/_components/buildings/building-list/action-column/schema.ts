import { z } from "zod";

export const buildingSchema = z.object({
  name: z.string().min(1, "Building name is required"),
  description: z.string().min(1, "Building description is required"),
});
