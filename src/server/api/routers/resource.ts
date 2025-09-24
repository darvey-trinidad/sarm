import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { generateUUID, toTimeInt } from "@/lib/utils";
import { createResource, addResourceQuantity, createResourceBorrowing, createBorrowingTransaction, editBorrowingTransaction } from "@/lib/api/resource/mutation";
import { createResourceSchema, addResourceQuantitySchema, getAllAvailableResourcesSchema, createBorrowingTransactionSchema, editBorrowingTransactionSchema, getAllBorrowingTransactionsSchema } from "@/server/api-utils/validators/resource";
import { getAllAvailableResources, getAllBorrowingTransactions, getAllResources } from "@/lib/api/resource/query";
import { TRPCError } from "@trpc/server";

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
      console.log(input);
      const res = await getAllAvailableResources(input.requestedDate, toTimeInt(input.requestedStartTime), toTimeInt(input.requestedEndTime));
      console.log(res);
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

      return createResourceBorrowing(borrowings);
    }),
  getAllBorrowingTransactions: protectedProcedure
    .input(getAllBorrowingTransactionsSchema)
    .query(({ input }) => {
      return getAllBorrowingTransactions(input);
    }),
  editBorrowingTransaction: protectedProcedure
    .input(editBorrowingTransactionSchema)
    .mutation(({ input }) => {
      const { id, ...data } = input;
      return editBorrowingTransaction(id, data);
    }),
});