import { type Metadata } from "next";
import BreadcrumbLayout from "@/components/breadcrumb/page-breadcrumb";
import VenueCard from "./_components/venue-card";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
export const metadata: Metadata = {
  title: "Schedule",
};

export default async function Page() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <div className="flex w-full flex-col space-y-4">
      <BreadcrumbLayout currentPage="Schedule" />
      <div className="flex flex-col gap-5 sm:flex-row">
        <VenueCard role={session?.user.role ?? ""} />
      </div>
    </div>
  );
}
