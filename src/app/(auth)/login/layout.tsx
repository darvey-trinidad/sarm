import { redirect } from "next/navigation";
import { auth } from "@/lib/auth"; // or however you fetch your session
import { PageRoutes } from "@/constants/page-routes";
import { headers } from "next/headers";

export default async function FacilityManagerOnlyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session) {
    redirect(PageRoutes.DASHBOARD);
  }

  return <>{children}</>;
}
