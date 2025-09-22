import { z } from "zod";

export const PlottingSchema = z.object({
  courseCode: z.string().min(1, { message: "Please enter a course code" }),
  proffesor: z.string().min(1, { message: "Please select a professor" }),
  section: z.string().min(1, { message: "Please enter section" }),
  startTime: z.string().min(1, { message: "Select start time" }),
  endTime: z.string().min(1, { message: "Select end time" }),
});
