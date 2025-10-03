import React from "react";
import { type Metadata } from "next";
import BreadcrumbLayout from "@/components/breadcrumb/page-breadcrumb";
import { UserTable } from "./_components/user-table";

export const metadata: Metadata = {
  title: "Users",
};

const Users = () => {
  return (
    <div className="flex w-full flex-col space-y-4">
      <BreadcrumbLayout currentPage="Users" />

      <UserTable />
    </div>
  );
};

export default Users;
