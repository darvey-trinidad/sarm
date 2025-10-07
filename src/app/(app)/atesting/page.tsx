import React from "react";
import { type Metadata } from "next";
import { AccountActivatedEmail } from "@/emails/account-activated";

export const metadata: Metadata = {
  title: "Requests",
};

export default async function Page() {

  return (
    <div>
      <AccountActivatedEmail userName="John Doe" loginUrl="https://example.com/login" />
    </div>
  );
}
