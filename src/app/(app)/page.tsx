import { type Metadata } from "next";
import BreadcrumbLayout from "@/components/breadcrumb/page-breadcrumb";

export const metadata: Metadata = {
  title: "Dashboard",
};

const Page = () => {
  return (
    <div className="flex w-full flex-col space-y-4">
      <BreadcrumbLayout currentPage="Dashboard" />
    </div>
  );
};

export default Page;
