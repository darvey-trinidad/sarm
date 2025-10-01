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
import { PageRoutes } from "@/constants/page-routes";
import { title } from "process";
import { UserSidebar } from "./user-sidebar";
import Image from "next/image";

const items = [
  {
    title: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Schedule",
    href: "/schedule",
    icon: CalendarRange,
  },
  {
    title: "Find Room",
    href: "/find-room",
    icon: Search,
  },
  {
    title: "Resources",
    href: "/resources",
    icon: Shapes,
  },
  {
    title: "Requests",
    href: "/requests",
    icon: CalendarCheck,
  },
  {
    title: "Reports",
    href: "/reports",
    icon: MessageSquareWarning,
  },
  {
    title: "Plotting",
    href: "/plotting",
    icon: Grid2x2Check,
  },
  {
    title: "Users",
    href: "/users",
    icon: Users,
  },
  {
    title: "Manage",
    href: "/manage",
    icon: Blocks,
  },
];

export function AppSidebar() {
  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <div className="pt-2">
          <SidebarHeader>
            <Image
              src="/SARM LOGO.png"
              alt="SARM Logo"
              width={20}
              height={20}
              className="Object-contain"
            />
          </SidebarHeader>
        </div>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
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
