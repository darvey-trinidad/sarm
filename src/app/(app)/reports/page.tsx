import { type Metadata } from "next";
import BreadcrumbLayout from "@/components/breadcrumb/page-breadcrumb";
import ReportCards from "./_components/report-status";
import ReportsTabContent from "./_components/reports-tab-content";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
export const metadata: Metadata = {
  title: "Reports",
};

export default async function Page() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  return (
    <div className="flex w-full flex-col space-y-4">
      <BreadcrumbLayout currentPage="Reports" />

      <ReportCards role={session?.user.role ?? ""} />
      <ReportsTabContent role={session?.user.role ?? ""} />
    </div>
  );
}
