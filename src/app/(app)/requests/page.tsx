import React from "react";
import { type Metadata } from "next";
import BreadcrumbLayout from "@/components/breadcrumb/page-breadcrumb";
import RequestTabContent from "./_components/request-tab-content";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
export const metadata: Metadata = {
  title: "Requests",
};

export default async function Page() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  return (
    <div className="flex w-full flex-col space-y-4">
      <BreadcrumbLayout currentPage="Requests" />

      <RequestTabContent role={session?.user.role ?? ""} />
    </div>
  );
}
