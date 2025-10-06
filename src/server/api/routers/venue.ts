import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { createVenue, createVenueReservation, editVenueReservation } from "@/lib/api/venue/mutation";
import { getAllUpcomingVenueReservations, getAllVenueReservationsByUserId, getAllVenues, getVenueReservationPastMonthsStats } from "@/lib/api/venue/query";
import { createVenueSchema, createVenueReservationSchema, createVenueReservationWithBorrowingSchema, getAllVenueReservationsSchema, editVenueReservationWithBorrowingSchema, editVenueReservationAndBorrowingStatusSchema, editVenueReservationStatusSchema } from "@/server/api-utils/validators/venue";
import { getAllVenueReservations } from "@/lib/api/venue/query";
import { generateUUID } from "@/lib/utils";
import { createBorrowingTransaction, createResourceBorrowing, editBorrowingTransaction, editBorrowingTransactionByVenueReservationId } from "@/lib/api/resource/mutation";
import { TRPCError } from "@trpc/server";
import { notifyPeInstructors } from "@/emails/notify-pe";
import { ReservationStatus } from "@/constants/reservation-status";
import { notifyVenueReserver } from "@/emails/notify-venue-reserver";
import { notifyResourceBorrower } from "@/emails/notify-resource-borrower";
import { notifyFmReservation } from "@/emails/notify-fm-reservation";
import { notifyFmBorrowing } from "@/emails/notify-fm-borrowing";
import z from "zod";

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
    .mutation(async ({ input }) => {
      const venueReservation = await createVenueReservation({ id: generateUUID(), ...input });

      if (!venueReservation) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Could not create venue reservation" });
      await notifyFmReservation(venueReservation.id);

      if (venueReservation.status.toLocaleLowerCase() === ReservationStatus.Approved.toLocaleLowerCase()) {
        await notifyPeInstructors(venueReservation.id);
      }

      return {
        success: true,
        message: "Venue reservation created successfully",
        data: venueReservation
      }
    }),
  createVenueReservationWithBorrowing: protectedProcedure
    .input(createVenueReservationWithBorrowingSchema)
    .mutation(async ({ input }) => {
      const venueReservation = await createVenueReservation({ id: generateUUID(), ...input.venue });
      if (!venueReservation) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Could not create venue reservation" });

      await notifyFmReservation(venueReservation.id);

      if (venueReservation.status.toLocaleLowerCase() === ReservationStatus.Approved.toLocaleLowerCase()) {
        await notifyPeInstructors(venueReservation.id);
      }

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

      await notifyFmBorrowing(borrowingTransaction.id);
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
  getAllVenueReservationsByUserId: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ input }) => {
      return await getAllVenueReservationsByUserId(input.userId);
    }),
  getAllUpcomingVenueReservations: protectedProcedure.query(async () => {
    return await getAllUpcomingVenueReservations();
  }),
  getAllUpcomingVenueReservationsByUserId: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ input }) => {
      return await getAllUpcomingVenueReservations(input.userId, false);
    }),
  getVenueReservationPastMonthsStats: protectedProcedure.query(async () => {
    return await getVenueReservationPastMonthsStats();
  }),
  editVenueReservationStatus: protectedProcedure
    .input(editVenueReservationStatusSchema)
    .mutation(async ({ input }) => {
      try {
        const editVenueReservationRes = await editVenueReservation(input.id, { status: input.status });

        if (!editVenueReservationRes) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Could not update venue reservation status" });

        if (input.status.toLocaleLowerCase() === ReservationStatus.Approved.toLocaleLowerCase())
          await notifyPeInstructors(input.id);

        if (input.status.toLocaleLowerCase() !== ReservationStatus.Pending.toLocaleLowerCase())
          await notifyVenueReserver(input.id);

        return {
          success: true,
          message: `Reservation ${input.status} successfully`
        };
      } catch (error) {
        if (error instanceof TRPCError) throw error;

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Could not update venue reservation status",
        });
      }
    }),
  editVenueReservationAndBorrowingStatus: protectedProcedure
    .input(editVenueReservationAndBorrowingStatusSchema)
    .mutation(async ({ input }) => {
      try {
        const editVenueReservationRes = await editVenueReservation(input.id, { status: input.reservationStatus });
        console.log("editVenueReservationRes", editVenueReservationRes);
        if (!editVenueReservationRes) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Could not update venue reservation status!!!" });

        const res = await editBorrowingTransactionByVenueReservationId(input.id, { status: input.borrowingStatus });

        if (input.reservationStatus.toLocaleLowerCase() === ReservationStatus.Approved.toLocaleLowerCase())
          await notifyPeInstructors(input.id);

        if (input.reservationStatus.toLocaleLowerCase() !== ReservationStatus.Pending.toLocaleLowerCase()) {
          await notifyVenueReserver(input.id);
          if (res) {
            await notifyResourceBorrower(res.id);
            return {
              success: true,
              message: `Reservation and borrowing ${input.reservationStatus} successfully`
            };
          }
        }

        return {
          success: true,
          message: `Reservation ${input.reservationStatus} successfully`
        };
      } catch (error) {
        // ✅ If it's already a TRPCError (like your CONFLICT), rethrow it as-is
        if (error instanceof TRPCError) throw error;

        // ❌ Otherwise, wrap it in a generic TRPCError
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Could not update venue reservation status",
        });
      }
    }),

});