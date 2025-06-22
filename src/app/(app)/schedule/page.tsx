import { type Metadata } from "next";
import BreadcrumbLayout from "@/components/breadcrumb/page-breadcrumb";
import ClassroomCard from "./_components/classroom-card";
import ActivityCenterCard from "./_components/activity-center-card";
import SocialHallCard from "./_components/social-hall-card";
import { PageRoutes } from "@/constants/page-routes";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Schedule",
};

export default function Page() {
  return (
    <div className="flex w-full flex-col space-y-4">
      <BreadcrumbLayout currentPage="Schedule" />
      <div className="flex flex-row space-x-4">
        <Link href={PageRoutes.SCHEDULE_CLASSROOM}>
          <ClassroomCard />
        </Link>
        <Link href={PageRoutes.SCHEDULE_ACTIVITY_CENTER}>
          <ActivityCenterCard />
        </Link>
        <Link href={PageRoutes.SCHEDULE_SOCIAL_HALL}>
          <SocialHallCard />
        </Link>
      </div>
    </div>
  );
}
