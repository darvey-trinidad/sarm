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
  Files
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
    title: "Issues",
    href: "/issues",
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
    title: "Records",
    href: "/records",
    icon: Files,
    roles: ROLES,
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
    <Sidebar collapsible="offcanvas" className="w-24 border-r">
      <SidebarContent className="flex flex-col gap-0 p-0">
        {/* Logo */}
        <div className="flex items-center justify-center border-b py-4">
          <Image
            src="/LOGO-DARK.png"
            alt="SARM Logo"
            width={40}
            height={40}
            className="object-contain"
          />
        </div>

        {/* Navigation Items */}
        <SidebarGroup className="flex-1 p-0">
          <SidebarGroupContent>
            <SidebarMenu className="gap-0 p-2">
              {isRole(roleFromSession) &&
                items
                  .filter((item) => item.roles?.includes(roleFromSession))
                  .map((item) => (
                    <SidebarMenuItem key={item.title} className="list-none">
                      <a
                        href={item.href}
                        className="flex flex-col items-center justify-center gap-1 rounded-lg px-1 py-2 text-gray-600 transition-colors duration-200 hover:bg-gray-100 hover:text-gray-900 data-[active=true]:bg-amber-800 data-[active=true]:text-white"
                      >
                        <item.icon className="h-6 w-6" />
                        <span className="text-center text-xs leading-tight font-medium">
                          {item.title}
                        </span>
                      </a>
                    </SidebarMenuItem>
                  ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t p-1">
        <UserSidebar />
      </SidebarFooter>
    </Sidebar>
  );
}
