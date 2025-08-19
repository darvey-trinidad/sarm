import { Button } from "@/components/ui/button";
import type { Column } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";

export function createSortableHeader<TData>(title: string) {
  const SortableHeader = ({ column }: { column: Column<TData, unknown> }) => {
    return (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="h-auto p-0 hover:bg-transparent"
      >
        {title}
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    );
  };

  SortableHeader.displayName = `SortableHeader(${title})`;

  return SortableHeader;
}


