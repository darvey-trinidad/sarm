import React from "react";
import { type Metadata } from "next";
import BreadcrumbLayout from "@/components/breadcrumb/page-breadcrumb";
import BuildingDirectory from "./_components/building-directory";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
export const metadata: Metadata = {
  title: "Classroom",
};

const Classroom = () => {
  return (
    <div className="flex w-full flex-col space-y-4">
      <BreadcrumbLayout currentPage="Buildings" parentPage="Schedule" />
      <Link href="/schedule">
        <Button
          variant="outline"
          size="sm"
          className="flex items-center bg-transparent"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
      </Link>
      <BuildingDirectory />
    </div>
  );
};

export default Classroom;
