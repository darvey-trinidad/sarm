"use client";
import * as React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
export function createActionColumn<T>(
  actions: Array<{
    label: string | ((row: T) => string);
    onClick: (row: T) => void;
    icon?: React.ReactNode | ((row: T) => React.ReactNode);
    variant?: "default" | "destructive";
  }>,
) {
  return {
    id: "actions",
    enableHiding: false,
    cell: ({ row }: { row: any }) => {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            {actions.map((action, index) => {
              const label =
                typeof action.label === "function"
                  ? action.label(row.original)
                  : action.label;
              const icon =
                typeof action.icon === "function"
                  ? action.icon(row.original)
                  : action.icon;

              return (
                <React.Fragment key={index}>
                  {action.variant === "destructive" && index > 0 && (
                    <DropdownMenuSeparator />
                  )}
                  <DropdownMenuItem
                    onClick={() => action.onClick(row.original)}
                    className={
                      action.variant === "destructive"
                        ? "text-red-600 focus:text-red-600"
                        : ""
                    }
                  >
                    {icon && <span className="mr-2">{icon}</span>}
                    {label}
                  </DropdownMenuItem>
                </React.Fragment>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  };
}
