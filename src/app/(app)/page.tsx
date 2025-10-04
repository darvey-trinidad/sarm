import { type Metadata } from "next";
import BreadcrumbLayout from "@/components/breadcrumb/page-breadcrumb";
import FacultyDashBoard from "@/components/dashboards/faculty";
import FacilityManagerDashBoard from "@/components/dashboards/facility-manager";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { Roles } from "@/constants/roles";
export const metadata: Metadata = {
  title: "Dashboard",
};

export default async function Page() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const role = session?.user.role ?? "";

  const renderDashboard = () => {
    switch (role) {
      case Roles.Faculty:
        return <FacultyDashBoard />;
      case Roles.DepartmentHead:
        return <FacultyDashBoard />;
      case Roles.FacilityManager:
        return <FacilityManagerDashBoard />;
      default:
        return <div></div>;
    }
  };
  return (
    <div className="flex w-full flex-col space-y-4">
      <BreadcrumbLayout currentPage="Dashboard" />

      {renderDashboard()}
    </div>
  );
}
