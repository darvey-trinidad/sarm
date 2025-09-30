import React from "react";
import { type Metadata } from "next";
import BreadcrumbLayout from "@/components/breadcrumb/page-breadcrumb";
import FindRoomContent from "./_components/find-room-content";
const metadata: Metadata = {
  title: "Find Room",
};
const FindRoom = () => {
  return (
    <div className="flex w-full flex-col space-y-4">
      <BreadcrumbLayout currentPage="Find Room" />

      <FindRoomContent />
    </div>
  );
};

export default FindRoom;
