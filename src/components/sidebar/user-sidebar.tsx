"use client";
import { LogOut, CircleUserRound } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { ROLE_LABELS } from "@/constants/roles";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PageRoutes } from "@/constants/page-routes";

export const UserSidebar = () => {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const handleOpenProfile = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_APP_URL}${PageRoutes.USER_PROFILE}`;
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex w-full flex-col items-center justify-center gap-1.5 rounded-lg px-2 py-3 text-gray-600 transition-colors duration-200 hover:bg-gray-100 hover:text-gray-900">
          <Avatar className="h-8 w-8">
            <CircleUserRound className="h-8 w-8 stroke-1" />
          </Avatar>
          <span className="text-center text-xs leading-tight font-medium">
            Profile
          </span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-56 rounded-lg"
        side="right"
        align="end"
        sideOffset={8}
      >
        <DropdownMenuLabel className="p-0 font-normal">
          <div
            className="flex items-center gap-2 px-2 py-2 text-left text-sm hover:cursor-pointer"
            onClick={handleOpenProfile}
          >
            <Avatar className="h-8 w-8 rounded-lg">
              <CircleUserRound className="h-8 w-8 stroke-1" />
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold">
                {session?.user.name ?? "Login"}
              </span>
              <span className="truncate text-xs text-gray-500">
                {session?.user.role ? ROLE_LABELS[session?.user.role] : ""}
              </span>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={async () =>
            await authClient.signOut({
              fetchOptions: {
                onSuccess: () => {
                  router.push("/login");
                },
              },
            })
          }
          className="cursor-pointer"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
