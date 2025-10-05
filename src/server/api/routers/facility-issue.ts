import { REPORT_STATUS } from "@/constants/report-status";
import { createFacilityIssueReport, editFacilityIssueReportStatus } from "@/lib/api/facility-issue/mutation";
import { getAllFacilityIssueReports, getAllFacilityIssueReportsByUser, getRecentFacilityIssueReports } from "@/lib/api/facility-issue/query";
import { generateUUID } from "@/lib/utils";
import { createFacilityIssueReportSchema, getAllFacilityIssueReportsSchema } from "@/server/api-utils/validators/facility-issue";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import z from "zod";

export const facilityIssueRouter = createTRPCRouter({
  createFacilityIssueReport: protectedProcedure
    .input(createFacilityIssueReportSchema)
    .mutation(({ input }) => {
      return createFacilityIssueReport({ id: generateUUID(), ...input });
    }),
  getAllFacilityIssueReports: protectedProcedure
    .input(getAllFacilityIssueReportsSchema)
    .query(({ input }) => {
      console.log(input);
      return getAllFacilityIssueReports(input);
    }),
  getAllFacilityIssueReportsByUser: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .query(({ input }) => {
      return getAllFacilityIssueReportsByUser(input.userId);
    }),
  getRecentFacilityIssueReports: protectedProcedure.query(async () => {
    return await getRecentFacilityIssueReports();
  }),
  editFacilityIssueReportStatus: protectedProcedure
    .input(z.object({ id: z.string(), status: z.enum(REPORT_STATUS) }))
    .mutation(({ input }) => {
      return editFacilityIssueReportStatus(input.id, input.status);
    }),
});