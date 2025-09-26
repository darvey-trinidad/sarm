import { createFacilityIssueReport } from "@/lib/api/facility-issue/mutation";
import { getAllFacilityIssueReports, getAllFacilityIssueReportsByUser } from "@/lib/api/facility-issue/query";
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
});