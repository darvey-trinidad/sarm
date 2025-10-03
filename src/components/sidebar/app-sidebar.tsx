import {
  LayoutDashboard,
  CalendarRange,
  Shapes,
  CalendarCheck,
  MessageSquareWarning,
  Grid2x2Check,
  Users,
  Blocks,
  Search,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { UserSidebar } from "./user-sidebar";
import Image from "next/image";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import {
  Roles,
  ROLES,
  REQUESTS_ROLES,
  RESOURCES_ROLES,
  PLOTTING_ROLES,
  USERS_ROLES,
  MANAGE_ROLES,
  isRole,
} from "@/constants/roles";

const items = [
  {
    title: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
    roles: ROLES,
  },
  {
    title: "Schedule",
    href: "/schedule",
    icon: CalendarRange,
    roles: ROLES,
  },
  {
    title: "Find Room",
    href: "/find-room",
    icon: Search,
    roles: ROLES,
  },
  {
    title: "Resources",
    href: "/resources",
    icon: Shapes,
    roles: RESOURCES_ROLES,
  },
  {
    title: "Requests",
    href: "/requests",
    icon: CalendarCheck,
    roles: REQUESTS_ROLES,
  },
  {
    title: "Reports",
    href: "/reports",
    icon: MessageSquareWarning,
    roles: ROLES,
  },
  {
    title: "Plotting",
    href: "/plotting",
    icon: Grid2x2Check,
    roles: PLOTTING_ROLES,
  },
  {
    title: "Users",
    href: "/users",
    icon: Users,
    roles: USERS_ROLES,
  },
  {
    title: "Manage",
    href: "/manage",
    icon: Blocks,
    roles: MANAGE_ROLES,
  },
];

export async function AppSidebar() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const roleFromSession = session?.user.role ?? Roles.Faculty;
  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <div className="flex pt-2">
          <SidebarHeader className="flex flex-row">
            <Image
              src="/SARM LOGO.png"
              alt="SARM Logo"
              width={33}
              height={33}
              className="Object-contain"
            />
            <span className="text-2xl font-bold">SARM</span>
          </SidebarHeader>
        </div>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {isRole(roleFromSession) &&
                items
                  .filter((item) => item.roles?.includes(roleFromSession))
                  .map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild>
                        <a href={item.href}>
                          <item.icon />
                          <span>{item.title}</span>
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <UserSidebar />
      </SidebarFooter>
    </Sidebar>
  );
}
