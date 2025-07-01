"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Users, Monitor, Wifi, Calendar } from "lucide-react";
import { useRouter } from "next/navigation";

interface RoomDetailsProps {
  params: {
    buildingId: string;
    roomNumber: string;
  };
}

// Mock data for room details
const getBuildingInfo = (buildingId: string) => {
  const buildings = {
    A: { name: "Building A", department: "BIT Dept." },
    B: { name: "Building B", department: "ITDS Dept." },
    C: { name: "Building C", department: "GATE Dept." },
    D: { name: "Building D", department: "BA Dept." },
    E: { name: "Building E", department: "New Building" },
  };
  return (
    buildings[buildingId as keyof typeof buildings] || {
      name: "Unknown Building",
      department: "Unknown Dept.",
    }
  );
};
