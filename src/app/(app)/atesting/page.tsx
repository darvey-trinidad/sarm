import React from "react";
import { type Metadata } from "next";
import { VerifyEmail } from "@/emails/verify-email";

export const metadata: Metadata = {
  title: "Requests",
};

export default async function Page() {

  return (
    <div>
      <VerifyEmail fullName="John Doe" verifyUrl="https://example.com/verify" />
    </div>
  );
}
