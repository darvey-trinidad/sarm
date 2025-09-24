import nodemailer from "nodemailer";
import { env } from "@/env";
import { db, eq } from "@/server/db";
import { render } from "@react-email/render";
import { TIME_MAP } from "@/constants/timeslot";
import { toTimeInt } from "@/lib/utils";
import { borrowingTransaction, resource, resourceBorrowing } from "@/server/db/schema/resource";
import { BorrowingUpdateEmail } from "./borrowing-update";
import { user } from "@/server/db/schema/auth";

export const notifyResourceBorrower = async (borrowingTransactionId: string) => {
  const borrowing = await db
    .select()
    .from(borrowingTransaction)
    .where(eq(borrowingTransaction.id, borrowingTransactionId))
    .innerJoin(user, eq(user.id, borrowingTransaction.borrowerId))
    .get();

  if (!borrowing) return;

  const borrowingItems = await db
    .select({
      name: resource.name,
      quantity: resourceBorrowing.quantity
    })
    .from(resourceBorrowing)
    .where(eq(resourceBorrowing.transactionId, borrowing.borrowing_transaction.id))
    .innerJoin(resource, eq(resource.id, resourceBorrowing.resourceId))
    .all();

  console.log(borrowingItems);

  const emailHtml = await render(
    BorrowingUpdateEmail({
      date: borrowing.borrowing_transaction.dateBorrowed ? borrowing.borrowing_transaction.dateBorrowed.toLocaleDateString('en-PH', {
        weekday: 'long',  // Long format for the day of the week (e.g., "Tuesday")
        month: 'long',    // Full month name (e.g., "September")
        day: 'numeric',   // Day of the month (e.g., "23")
        year: 'numeric',  // Full year (e.g., "2025")
      }) : "<no date>",
      time: `${TIME_MAP[toTimeInt(borrowing.borrowing_transaction.startTime)]} - ${TIME_MAP[toTimeInt(borrowing.borrowing_transaction.endTime)]}`,
      purpose: borrowing.borrowing_transaction.purpose,
      status: borrowing.borrowing_transaction.status,
      borrowedItems: borrowingItems
    }));

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: env.GOOGLE_EMAIL_USER,
      pass: env.GOOGLE_APP_PASSWORD,
    },
  });

  const info = await transporter.sendMail({
    from: `"SARM Notification" <${env.GOOGLE_EMAIL_USER}>`,
    to: borrowing.user.email,
    subject: "Reservation Update",
    html: emailHtml,
  });
  console.log("Email sent: ", info);
  return info;
}