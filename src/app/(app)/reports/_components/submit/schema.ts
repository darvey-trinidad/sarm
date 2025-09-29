import { z } from "zod";
import { REPORT_CATEGORY } from "@/constants/report-category";
export const ReportSchema = z.object({
  description: z.string().min(1, {
    message: "Please enter a description",
  }),
  details: z.string().min(1, {
    message: "Describe the issue in details",
  }),
  buildingId: z.string().optional(),
  classroomId: z.string().optional(),
  location: z.string().min(1, { message: "Please enter a location" }),
  imageUrl: z.string().optional(),
  category: z.enum(REPORT_CATEGORY, { message: "Please select a category" }),
});
