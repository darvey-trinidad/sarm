import type { TimeInt } from "@/constants/timeslot";
import { db, eq, sql, and, inArray, lt, gt, desc } from "@/server/db";
import { resource, resourceBorrowing } from "@/server/db/schema/resource";
import { user } from "@/server/db/schema/auth";

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
          inArray(resourceBorrowing.status, ["approved"]),
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

export const getAllResourceBorrowings = async () => {
  try {
    const rows = await db
      .select({
        id: resourceBorrowing.id,
        borrowerId: resourceBorrowing.borrowerId,
        borrowerName: user.name,
        resourceId: resourceBorrowing.resourceId,
        resourceName: resource.name,
        quantity: resourceBorrowing.quantity,
        dateBorrowed: resourceBorrowing.dateBorrowed,
        startTime: resourceBorrowing.startTime,
        endTime: resourceBorrowing.endTime,
        status: resourceBorrowing.status,
        purpose: resourceBorrowing.purpose,
        representativeBorrower: resourceBorrowing.representativeBorrower,
        dateRequested: resourceBorrowing.dateRequested,
        dateReturned: resourceBorrowing.dateReturned,
        fileUrl: resourceBorrowing.fileUrl,
      })
      .from(resourceBorrowing)
      .innerJoin(resource, eq(resourceBorrowing.resourceId, resource.id))
      .innerJoin(user, eq(resourceBorrowing.borrowerId, user.id))
      .orderBy(desc(resourceBorrowing.dateRequested))
      .all();

    // ---- Group by (dateBorrowed + startTime + endTime + borrowerId) ----
    const borrowings = Object.values(
      rows.reduce((acc, row) => {
        const key = `${row.dateBorrowed}-${row.startTime}-${row.endTime}-${row.borrowerId}`;

        if (!acc[key]) {
          acc[key] = {
            borrowerId: row.borrowerId,
            borrowerName: row.borrowerName,
            dateBorrowed: row.dateBorrowed,
            startTime: row.startTime,
            endTime: row.endTime,
            status: row.status,
            purpose: row.purpose,
            representativeBorrower: row.representativeBorrower,
            dateRequested: row.dateRequested,
            dateReturned: row.dateReturned,
            fileUrl: row.fileUrl,
            borrowedItems: [],
          };
        }

        acc[key].borrowedItems.push({
          id: row.id,
          resourceId: row.resourceId,
          resourceName: row.resourceName,
          quantity: row.quantity,
        });

        return acc;
      }, {} as Record<string, any>)
    );

    return borrowings;
  } catch (error) {
    console.error(error);
    throw error;
  }
};