import { z } from "zod";

export const PlottingSchema = z.object({
  courseCode: z.string().min(1, { message: "Please enter a course code" }),
  proffesor: z.string().min(1, { message: "Please select a professor" }),
  section: z.string().min(1, { message: "Please enter section" }),
  building: z.string().min(1, { message: "Please select a building" }),
  room: z.string().min(1, { message: "Please select a room" }),
  startTime: z.string().min(1, { message: "Select start time" }),
  endTime: z.string().min(1, { message: "Select end time" }),
  days: z.string().min(1, { message: "Please select at least one day" }),
});
