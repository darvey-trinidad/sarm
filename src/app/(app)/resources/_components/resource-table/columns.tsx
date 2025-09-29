"use client";

import { type ColumnDef } from "@tanstack/react-table";
import { createSortableHeader } from "@/components/table/data-table";
import { createActionColumn } from "@/components/table/action-column";
import { RESOURCE_CATEGORY } from "@/constants/resource-category";

interface Resource {
  id: string;
  name: string;
  description: string | null;
  category: (typeof RESOURCE_CATEGORY)[number];
  stock: number;
  available: number;
}

const getCategory = (category: string | null) => {
  switch (category) {
    case "audio":
      return "Audio";
    case "electrical":
      return "Electrical";
    case "electronics":
      return "Electronics";
    case "visual":
      return "Visual";
    case "furniture":
      return "Furniture";
    case "event_materials":
      return "Event Materials";
    case "office_supply":
      return "Office Supply";
    case "cleaning_equipment":
      return "Cleaning Equipment";
    case "laboratory_equipment":
      return "Laboratory Equipment";
  }
};

export const columns: ColumnDef<Resource>[] = [
  {
    accessorKey: "name",
    header: createSortableHeader("Resource Name"),
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: (info) => getCategory(info.row.original.category),
  },
  {
    accessorKey: "stock",
    header: "Stock",
  },
  {
    accessorKey: "available",
    header: "Available",
  },
];
