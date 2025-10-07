import type { ReportStatus } from "@/constants/report-status";
import { db, eq } from "@/server/db";
import { facilityIssueReport } from "@/server/db/schema/facility-issue-report";
import type { NewFacilityIssueReport } from "@/server/db/types/facility-issue";

export const createFacilityIssueReport = async (data: NewFacilityIssueReport) => {
  try {
    return await db.insert(facilityIssueReport).values(data).returning().get();
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const editFacilityIssueReportStatus = async (id: string, status: ReportStatus) => {
  try {
    return await db.update(facilityIssueReport).set({ status, dateUpdated: new Date() }).where(eq(facilityIssueReport.id, id)).returning().get();
  } catch (error) {
    console.error(error);
    throw error;
  }
}