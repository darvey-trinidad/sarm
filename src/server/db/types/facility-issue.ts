import type { InferInsertModel } from "drizzle-orm";
import { facilityIssueReport } from "@/server/db/schema/facility-issue-report";

export type NewFacilityIssueReport = InferInsertModel<typeof facilityIssueReport>;