import { z } from "zod";

export const ReportSchema = z.object({
  title: z.string().min(5, {
    message: "Title must be at least 5 characters",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters",
  }),
  building: z.string({
    message: "Please select a building",
  }),
  room: z.string({
    message: "Please select a room",
  }),
  location: z.string({
    message: "Please specify a valid location",
  }),
  priority: z.string(),
  datenoticed: z.date({
    message: "Please select a date when the issue was noticed",
  }),
  category: z.string({
    message: "Please select a category",
  }),
});
