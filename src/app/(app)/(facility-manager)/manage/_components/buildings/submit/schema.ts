import { z } from "zod";

export const BuildingSchema = z.object({
  name: z.string().min(1, { message: "Please enter a name" }),
  description: z.string().min(1, { message: "Please enter a description" }),
});
