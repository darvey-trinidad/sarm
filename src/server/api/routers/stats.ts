import { getUnresolvedReportsCount } from "@/lib/api/facility-issue/query";
import { getPendingBorrowingTransactionsCount } from "@/lib/api/resource/query";
import { getPendingVenueReservationsCount } from "@/lib/api/venue/query";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

export const statsRouter = createTRPCRouter({
  getReservationBorrowingIssueCounts: protectedProcedure.query(async () => {
    try {
      return {
        unresolvedReportsCount: await getUnresolvedReportsCount(),
        pendingBorrowingTransactionsCount: await getPendingBorrowingTransactionsCount(),
        pendingVenueReservationsCount: await getPendingVenueReservationsCount(),
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  }),
}); 