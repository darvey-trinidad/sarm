"use client";
import { api } from "@/trpc/react";
import { authClient } from "@/lib/auth-client";
const page = () => {
  const { data: session } = authClient.useSession();
  const { data: report } =
    api.facilityIssue.getAllFacilityIssueReportsByUser.useQuery({
      userId: session?.user.id ?? "",
    });
  return <div>{JSON.stringify(report)}</div>;
};

export default page;
