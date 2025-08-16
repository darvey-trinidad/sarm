"use client";

import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  MoreHorizontal,
  Search,
  UserPlus,
  Mail,
  Key,
  Edit,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { api } from "@/trpc/react";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  departmentOrOrganization: string;
  isActive: boolean;
}

export function UserTable() {
  const { data, refetch } = api.auth.getAllFaculty.useQuery();
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<string | null>();

  useEffect(() => {
    if (data) {
      setUsers(data as User[]);
    }
  }, [data]);

  const filteredUsers = users.filter((user) => {
    const matchesSearch = user.name
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesRole = roleFilter ? user.role === roleFilter : true;

    return matchesSearch && matchesRole;
  });
}

const getStatusBadge = (status: boolean) => {
  switch (status) {
    case true:
      return (
        <Badge className="border-green-200 bg-green-100 text-green-700">
          Active
        </Badge>
      );
    case false:
      return (
        <Badge className="border-red-200 bg-red-100 text-yellow-700">
          Inactive
        </Badge>
      );
    default:
      return null;
  }
};
