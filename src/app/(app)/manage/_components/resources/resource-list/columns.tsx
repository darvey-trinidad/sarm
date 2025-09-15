"use client";
import { type ColumnDef } from "@tanstack/react-table";
import { createSortableHeader } from "@/components/table/data-table";
import { createActionColumn } from "@/components/table/action-column";
import { Plus } from "lucide-react";
import ResourceQuantityForm from "../action-column/resource-quantity-form";
import { resource } from "@/server/db/schema/resource";
interface Resource {
  id: string;
  name: string;
  description: string | null;
  category:
    | "audio"
    | "electrical"
    | "electronics"
    | "visual"
    | "furniture"
    | "event_materials"
    | "office_supply"
    | "cleaning_equipment"
    | "laboratory_equipment";
  stock: number;
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
    accessorKey: "stock",
    header: "Stock",
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: (info) => getCategory(info.row.original.category),
  },
  createActionColumn<Resource>([
    {
      label: "Edit Quantity",
      icon: <Plus className="h-4 w-4" />,
      render: (resource) => (
        <ResourceQuantityForm
          resourceId={resource.id}
          resourceName={resource.name}
        />
      ),
    },
  ]),
];
