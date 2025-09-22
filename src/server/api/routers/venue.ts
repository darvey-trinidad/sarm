import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { createVenue, createVenueReservation } from "@/lib/api/venue/mutation";
import { getAllPendingVenueReservations, getAllVenues, getVenueSchedule } from "@/lib/api/venue/query";
import { createVenueSchema, createVenueReservationSchema, getVenueScheduleSchema, createVenueReservationWithBorrowingSchema, getAllVenueReservationsSchema } from "@/server/api-utils/validators/venue";
import { getAllVenueReservations } from "@/lib/api/venue/query";
import { generateUUID } from "@/lib/utils";
import { createBorrowingTransaction, createResourceBorrowing } from "@/lib/api/resource/mutation";
import { TRPCError } from "@trpc/server";

export const venueRouter = createTRPCRouter({
  createVenue: protectedProcedure
    .input(createVenueSchema)
    .mutation(({ input }) => {
      return createVenue({ id: generateUUID(), ...input });
    }),
  getAllVenues: protectedProcedure.query(() => {
    return getAllVenues();
  }),
  createVenueReservation: protectedProcedure
    .input(createVenueReservationSchema)
    .mutation(({ input }) => {
      return createVenueReservation({ id: generateUUID(), ...input });
    }),
  createVenueReservationWithBorrowing: protectedProcedure
    .input(createVenueReservationWithBorrowingSchema)
    .mutation(async ({ input }) => {
      const venueReservation = await createVenueReservation({ id: generateUUID(), ...input.venue });
      if (!venueReservation) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Could not create venue reservation" });

      const { itemsBorrowed, ...borrowingTransactionDetails } = input.borrowing;
      const borrowingTransaction = await createBorrowingTransaction({
        id: generateUUID(),
        ...borrowingTransactionDetails,
        venueReservationId: venueReservation.id
      });
      if (!borrowingTransaction.id) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Could not create borrowing transaction" });

      const borrowings = itemsBorrowed.map((item) => {
        return {
          id: generateUUID(),
          ...item,
          transactionId: borrowingTransaction.id
        };
      });

      const createdBorrowings = await createResourceBorrowing(borrowings);
      console.log(createdBorrowings);
      if (!createdBorrowings) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Could not create resource borrowings" });

      return {
        success: true,
        message: "Venue reservation and borrowing transaction created successfully",
        data: {
          venueReservation,
          borrowingTransaction,
          borrowings: createdBorrowings
        }
      };
    }),
  getAllVenueReservations: protectedProcedure
    .input(getAllVenueReservationsSchema)
    .query(async ({ input }) => {
      return await getAllVenueReservations(input);
    }),
  getAllPendingVenueReservations: protectedProcedure.query(async () => {
    return await getAllPendingVenueReservations();
  }),
  getVenueSchedule: protectedProcedure
    .input(getVenueScheduleSchema)
    .query(({ input }) => {
      console.log(input);
      return getVenueSchedule(input.venueId, input.startDate, input.endDate);
    }),
});