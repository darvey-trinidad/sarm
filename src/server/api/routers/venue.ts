import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { createVenue, createVenueReservation, editVenueReservation } from "@/lib/api/venue/mutation";
import { getAllPendingVenueReservations, getAllVenues } from "@/lib/api/venue/query";
import { createVenueSchema, createVenueReservationSchema, createVenueReservationWithBorrowingSchema, getAllVenueReservationsSchema, editVenueReservationWithBorrowingSchema, editVenueReservationAndBorrowingStatusSchema } from "@/server/api-utils/validators/venue";
import { getAllVenueReservations } from "@/lib/api/venue/query";
import { generateUUID } from "@/lib/utils";
import { createBorrowingTransaction, createResourceBorrowing, editBorrowingTransaction, editBorrowingTransactionByVenueReservationId } from "@/lib/api/resource/mutation";
import { TRPCError } from "@trpc/server";
import { notifyPeInstructors } from "@/emails/notify-pe";
import { ReservationStatus } from "@/constants/reservation-status";
import { notifyVenueReserver } from "@/emails/notify-venue-reserver";
import { notifyResourceBorrower } from "@/emails/notify-resource-borrower";

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
  editVenueReservation: protectedProcedure
    .input(editVenueReservationWithBorrowingSchema)
    .mutation(({ input }) => {
      try {
        const { id: venueReservationId, ...venueReservationData } = input.venue;
        const updatedVenueReservation = editVenueReservation(venueReservationId, venueReservationData);

        if (input.borrowing) {
          const { id: borrowingTransactionId, ...borrowingData } = input.borrowing;
          const updatedBorrowingTransaction = editBorrowingTransaction(
            borrowingTransactionId,
            borrowingData
          );
          console.log(updatedVenueReservation, updatedBorrowingTransaction);
          return {
            success: true,
            message: "Venue reservation and borrowing transaction updated successfully",
            data: {
              updatedVenueReservation,
              updatedBorrowingTransaction
            }
          };
        } else {
          return {
            success: true,
            message: "Venue reservation updated successfully",
            data: {
              updatedVenueReservation,
              updatedBorrowingTransaction: null
            }
          };
        }
      } catch (error) {
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Could not update venue reservation" });
      }
    }),
  editVenueReservationAndBorrowingStatus: protectedProcedure
    .input(editVenueReservationAndBorrowingStatusSchema)
    .mutation(async ({ input }) => {
      try {
        editVenueReservation(input.id, { status: input.reservationStatus });

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
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Could not update venue reservation status" });
      }
    })
});