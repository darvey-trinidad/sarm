import type { TimeInt } from "@/constants/timeslot";
import { db, eq, sql, and, inArray, lt, gt, desc } from "@/server/db";
import { resource, resourceBorrowing } from "@/server/db/schema/resource";

export const getAllResources = async () => {
  try {
    return await db.select().from(resource).orderBy(resource.name).all();
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getAllAvailableResources = async (requestedDate: Date, requestedStartTime: TimeInt, requestedEndTime: TimeInt) => {
  try {
    const rows = await db
      .select({
        id: resource.id,
        name: resource.name,
        stock: resource.stock,
        category: resource.category,
        description: resource.description,
        available: sql<number>`
      ${resource.stock} - IFNULL(SUM(${resourceBorrowing.quantity}), 0)
    `,
      })
      .from(resource)
      .leftJoin(
        resourceBorrowing,
        and(
          eq(resourceBorrowing.resourceId, resource.id),
          eq(resourceBorrowing.dateBorrowed, requestedDate),
          inArray(resourceBorrowing.status, ["approved", "borrowed"]),
          lt(resourceBorrowing.startTime, requestedEndTime),
          gt(resourceBorrowing.endTime, requestedStartTime),
        )
      )
      .groupBy(resource.id);

    return rows;
  } catch (error) {
    console.error(error);
    throw error;
  }
};