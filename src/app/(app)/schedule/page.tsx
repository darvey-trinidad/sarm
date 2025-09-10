import { type Metadata } from "next";
import BreadcrumbLayout from "@/components/breadcrumb/page-breadcrumb";
import Link from "next/link";
import VenueCard from "./_components/venue-card";

export const metadata: Metadata = {
  title: "Schedule",
};

type Venue = {
  id: string;
  name: string;
};

export default function Page() {
  return (
    <div className="flex w-full flex-col space-y-4">
      <BreadcrumbLayout currentPage="Schedule" />
      <div className="flex flex-col gap-5 sm:flex-row">
        <VenueCard />
      </div>
    </div>
  );
}
