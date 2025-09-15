import { z } from "zod";

export const ActionSchema = z.object({
  stock: z.coerce.number({
    invalid_type_error: "Quantity must be a number",
  }),
  action: z.enum(["add", "subtract"]),
});
