import { db } from "@/server/db";
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