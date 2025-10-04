import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { generateUUID, toTimeInt } from "@/lib/utils";
import { createResource, addResourceQuantity, createResourceBorrowing, createBorrowingTransaction, editBorrowingTransaction } from "@/lib/api/resource/mutation";
import { createResourceSchema, addResourceQuantitySchema, getAllAvailableResourcesSchema, createBorrowingTransactionSchema, editBorrowingTransactionSchema, getAllBorrowingTransactionsSchema } from "@/server/api-utils/validators/resource";
import { getAllAvailableResources, getAllBorrowingTransactions, getAllBorrowingTransactionsByUserId, getAllResources, getUpcomingBorrowingTransactions } from "@/lib/api/resource/query";
import { TRPCError } from "@trpc/server";
import { notifyResourceBorrower } from "@/emails/notify-resource-borrower";
import { notifyFmBorrowing } from "@/emails/notify-fm-borrowing";
import z from "zod";

export const resourceRouter = createTRPCRouter({
  createResource: protectedProcedure
    .input(createResourceSchema)
    .mutation(({ input }) => {
      return createResource({ id: generateUUID(), ...input });
    }),
  addResourceQuantity: protectedProcedure
    .input(addResourceQuantitySchema)
    .mutation(({ input }) => {
      return addResourceQuantity(input.id, input.quantity);
    }),
  getAllResources: protectedProcedure.query(() => {
    return getAllResources();
  }),
  getAllAvailableResources: protectedProcedure
    .input(getAllAvailableResourcesSchema)
    .query(async ({ input }) => {
      const res = await getAllAvailableResources(input.requestedDate, toTimeInt(input.requestedStartTime), toTimeInt(input.requestedEndTime));
      return res;
    }),
  createResourceBorrowing: protectedProcedure
    .input(createBorrowingTransactionSchema)
    .mutation(async ({ input }) => {
      const { itemsBorrowed, ...borrowingTransactionDetails } = input;
      const borrowingTransaction = await createBorrowingTransaction({ id: generateUUID(), ...borrowingTransactionDetails });

      if (!borrowingTransaction) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Could not create borrowing transaction" });

      const borrowings = itemsBorrowed.map((item) => {
        return {
          id: generateUUID(),
          ...item,
          transactionId: borrowingTransaction.id
        };
      });

      const createdBorrowings = await createResourceBorrowing(borrowings);

      if (!createdBorrowings) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Could not create resource borrowings" });

      await notifyFmBorrowing(borrowingTransaction.id);

      return {
        success: true,
        message: "Borrowing transaction created successfully",
        data: {
          borrowingTransaction,
          borrowings: createdBorrowings
        }
      }
    }),
  getAllBorrowingTransactions: protectedProcedure
    .input(getAllBorrowingTransactionsSchema)
    .query(({ input }) => {
      return getAllBorrowingTransactions(input);
    }),
  getAllBorrowingTransactionsByUserId: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .query(({ input }) => {
      return getAllBorrowingTransactionsByUserId(input.userId);
    }),
  getUpcomingBorrowingTransactions: protectedProcedure.query(async () => {
    return await getUpcomingBorrowingTransactions();
  }),
  editBorrowingTransaction: protectedProcedure
    .input(editBorrowingTransactionSchema)
    .mutation(async ({ input }) => {
      try {
        const { id, ...data } = input;
        const editedBorrowing = await editBorrowingTransaction(id, data);

        if (editedBorrowing?.status === "approved" || editedBorrowing?.status === "rejected") {
          await notifyResourceBorrower(editedBorrowing.id);
        }

        return editedBorrowing;
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Could not update borrowing transaction status" });
      }
    }),
});