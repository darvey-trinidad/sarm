import { REPORT_STATUS } from "@/constants/report-status";
import { notifyFmIssue } from "@/emails/notify-fm-report";
import { createFacilityIssueReport, editFacilityIssueReportStatus } from "@/lib/api/facility-issue/mutation";
import { getAllFacilityIssueReports, getAllFacilityIssueReportsByUser, getOngoingReportsCount, getRecentFacilityIssueReports, getResolvedReportsCountThisMonth, getUnresolvedReportsCount } from "@/lib/api/facility-issue/query";
import { generateUUID } from "@/lib/utils";
import { createFacilityIssueReportSchema, getAllFacilityIssueReportsSchema } from "@/server/api-utils/validators/facility-issue";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";
import z from "zod";

export const facilityIssueRouter = createTRPCRouter({
  createFacilityIssueReport: protectedProcedure
    .input(createFacilityIssueReportSchema)
    .mutation(async ({ input }) => {
      try {
        const res = await createFacilityIssueReport({ id: generateUUID(), ...input });
        if (!res) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Could not create facility issue report" });
        await notifyFmIssue(res.id);
        return res;
      } catch (error) {
        console.log(error);
        throw error
      }
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
  getFacilityIssueReportsCounts: protectedProcedure.query(async () => {
    return {
      unresolvedCount: await getUnresolvedReportsCount(),
      ongoingCount: await getOngoingReportsCount(),
      resolvedCount: await getResolvedReportsCountThisMonth(),
    }
  }),
  editFacilityIssueReportStatus: protectedProcedure
    .input(z.object({ id: z.string(), status: z.enum(REPORT_STATUS) }))
    .mutation(({ input }) => {
      return editFacilityIssueReportStatus(input.id, input.status);
    }),
});