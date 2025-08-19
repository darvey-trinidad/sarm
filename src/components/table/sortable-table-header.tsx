import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
export function createSortableHeader(title: string) {
  return ({ column }: { column: any }) => {
    return (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="font- h-auto p-0 hover:bg-transparent"
      >
        {title}
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    );
  };
}
