import { db, desc, eq, gte, lte, and, count } from "@/server/db";
import { facilityIssueReport } from "@/server/db/schema/facility-issue-report";
import { user } from "@/server/db/schema/auth";
import { building, classroom } from "@/server/db/schema/classroom";
import { ReportStatusValues, type ReportStatus } from "@/constants/report-status";
import type { ReportCategory } from "@/constants/report-category";

export const getAllFacilityIssueReports = async ({
  category,
  status,
  startDate,
  endDate,
}: {
  category?: ReportCategory;
  status?: ReportStatus;
  startDate?: Date;
  endDate?: Date;
}) => {
  try {
    const conditions = [];
    if (category) conditions.push(eq(facilityIssueReport.category, category));
    if (status) conditions.push(eq(facilityIssueReport.status, status));
    if (startDate) conditions.push(gte(facilityIssueReport.dateReported, startDate));
    if (endDate) conditions.push(lte(facilityIssueReport.dateReported, endDate));

    console.log("conditions:", conditions);

    const res = await db
      .select({
        id: facilityIssueReport.id,
        reportedByName: user.name,
        category: facilityIssueReport.category,
        description: facilityIssueReport.description,
        buildingId: building.id,
        buildingName: building.name,
        classroomId: classroom.id,
        classroomName: classroom.name,
        location: facilityIssueReport.location,
        details: facilityIssueReport.details,
        status: facilityIssueReport.status,
        imageUrl: facilityIssueReport.imageUrl,
        dateReported: facilityIssueReport.dateReported,
        dateUpdated: facilityIssueReport.dateUpdated,
      })
      .from(facilityIssueReport)
      .innerJoin(user, eq(user.id, facilityIssueReport.reportedBy))
      .leftJoin(building, eq(building.id, facilityIssueReport.buildingId))
      .leftJoin(classroom, eq(classroom.id, facilityIssueReport.classroomId))
      .orderBy(desc(facilityIssueReport.dateReported))
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .all();

    console.log(res);

    return res;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getAllFacilityIssueReportsByUser = async (userId: string) => {
  try {
    return await db
      .select({
        id: facilityIssueReport.id,
        reportedByName: user.name,
        category: facilityIssueReport.category,
        description: facilityIssueReport.description,
        buildingId: building.id,
        buildingName: building.name,
        classroomId: classroom.id,
        classroomName: classroom.name,
        location: facilityIssueReport.location,
        details: facilityIssueReport.details,
        status: facilityIssueReport.status,
        imageUrl: facilityIssueReport.imageUrl,
        dateReported: facilityIssueReport.dateReported,
        dateUpdated: facilityIssueReport.dateUpdated,
      })
      .from(facilityIssueReport)
      .innerJoin(user, eq(user.id, facilityIssueReport.reportedBy))
      .leftJoin(building, eq(building.id, facilityIssueReport.buildingId))
      .leftJoin(classroom, eq(classroom.id, facilityIssueReport.classroomId))
      .orderBy(desc(facilityIssueReport.dateReported))
      .where(eq(facilityIssueReport.reportedBy, userId))
      .all();
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getRecentFacilityIssueReports = async () => {
  try {
    return await db
      .select({
        id: facilityIssueReport.id,
        reportedByName: user.name,
        category: facilityIssueReport.category,
        description: facilityIssueReport.description,
        buildingId: building.id,
        buildingName: building.name,
        classroomId: classroom.id,
        classroomName: classroom.name,
        location: facilityIssueReport.location,
        details: facilityIssueReport.details,
        status: facilityIssueReport.status,
        imageUrl: facilityIssueReport.imageUrl,
        dateReported: facilityIssueReport.dateReported,
        dateUpdated: facilityIssueReport.dateUpdated,
      })
      .from(facilityIssueReport)
      .innerJoin(user, eq(user.id, facilityIssueReport.reportedBy))
      .leftJoin(building, eq(building.id, facilityIssueReport.buildingId))
      .leftJoin(classroom, eq(classroom.id, facilityIssueReport.classroomId))
      .where(eq(facilityIssueReport.status, ReportStatusValues.Reported))
      .orderBy(desc(facilityIssueReport.dateReported))
      .limit(5)
      .all();
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export const getUnresolvedReportsCount = async () => {
  try {
    const res = await db
      .select({ count: count(facilityIssueReport.id) })
      .from(facilityIssueReport)
      .where(eq(facilityIssueReport.status, ReportStatusValues.Reported))
      .get();

    return res?.count ?? 0;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export const getOngoingReportsCount = async () => {
  try {
    const res = await db
      .select({ count: count(facilityIssueReport.id) })
      .from(facilityIssueReport)
      .where(eq(facilityIssueReport.status, ReportStatusValues.Ongoing))
      .get();

    return res?.count ?? 0;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export const getResolvedReportsCountThisMonth = async () => {
  try {
    const now = new Date();

    // Get UTC start of month
    const startOfMonth = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));

    console.log(startOfMonth);

    const res = await db
      .select({ count: count(facilityIssueReport.id) })
      .from(facilityIssueReport)
      .where(and(
        eq(facilityIssueReport.status, ReportStatusValues.Resolved),
        gte(facilityIssueReport.dateUpdated, new Date(startOfMonth))
      ))
      .get();

    return res?.count ?? 0;
  } catch (error) {
    console.error(error);
    throw error;
  }
}