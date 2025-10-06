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
    <Sidebar collapsible="offcanvas" className="border-r w-24">
      <SidebarContent className="gap-0 p-0 flex flex-col">
        {/* Logo */}
        <div className="flex items-center justify-center py-4 border-b">
          <Image
            src="/SARM LOGO.png"
            alt="SARM Logo"
            width={40}
            height={40}
            className="object-contain"
          />
        </div>

        {/* Navigation Items */}
        <SidebarGroup className="p-0 flex-1">
          <SidebarGroupContent>
            <SidebarMenu className="gap-0 p-2">
              {isRole(roleFromSession) &&
                items
                  .filter((item) => item.roles?.includes(roleFromSession))
                  .map((item) => (
                    <SidebarMenuItem key={item.title} className="list-none">
                      <a
                        href={item.href}
                        className="flex flex-col items-center justify-center gap-1 py-2 px-1 rounded-lg transition-colors duration-200 text-gray-600 hover:bg-gray-100 hover:text-gray-900 data-[active=true]:bg-amber-800 data-[active=true]:text-white"
                      >
                        <item.icon className="w-6 h-6" />
                        <span className="text-xs font-medium text-center leading-tight">
                          {item.title}
                        </span>
                      </a>
                    </SidebarMenuItem>
                  ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-1 border-t">
        <UserSidebar />
      </SidebarFooter>
    </Sidebar>
  );
}