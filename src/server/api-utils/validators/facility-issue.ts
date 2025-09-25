import { REPORT_CATEGORY } from "@/constants/report-category";
import z from "zod";
import { requiredDateSchema } from "./date";
import { REPORT_STATUS } from "@/constants/report-status";

export const createFacilityIssueReportSchema = z.object({
  reportedBy: z.string(),
  category: z.enum(REPORT_CATEGORY),
  description: z.string(),
  location: z.string(),
  buildingId: z.string().optional(),
  classroomId: z.string().optional(),
  details: z.string().optional(),
  imageUrl: z.string().optional(),
  dateReported: requiredDateSchema().optional(),
  dateUpdated: requiredDateSchema().optional(),
})

export const getAllFacilityIssueReportsSchema = z.object({
  status: z.enum(REPORT_STATUS).optional(),
  startDate: requiredDateSchema().optional(),
  endDate: requiredDateSchema().optional(),
})