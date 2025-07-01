"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface Building {
  id: string;
  name: string;
  department: string;
  status: "available" | "busy" | "maintenance";
  rooms: string[];
}

const buildings: Building[] = [
  {
    id: "A",
    name: "Building A",
    department: "BT Dept.",
    status: "available",
    rooms: [
      "Room 101",
      "Room 206",
      "Room 201",
      "Room 303",
      "Room 203",
      "Room 304",
      "Room 204",
      "Room 305",
      "Room 205",
      "Room 306",
    ],
  },
  {
    id: "B",
    name: "Building B",
    department: "ITDS Dept.",
    status: "available",
    rooms: [
      "Room 101",
      "Room 206",
      "Room 201",
      "Room 303",
      "Room 203",
      "Room 304",
      "Room 204",
      "Room 305",
      "Room 205",
      "Room 306",
    ],
  },
  {
    id: "C",
    name: "Building C",
    department: "GATE Dept.",
    status: "maintenance",
    rooms: [
      "Room 101",
      "Room 206",
      "Room 201",
      "Room 303",
      "Room 203",
      "Room 304",
      "Room 204",
      "Room 305",
      "Room 205",
      "Room 306",
    ],
  },
  {
    id: "D",
    name: "Building D",
    department: "BA Dept.",
    status: "available",
    rooms: [
      "Room 101",
      "Room 206",
      "Room 201",
      "Room 303",
      "Room 203",
      "Room 304",
      "Room 204",
      "Room 305",
      "Room 205",
      "Room 306",
    ],
  },
  {
    id: "E",
    name: "Building E",
    department: "New Building",
    status: "maintenance",
    rooms: [
      "Room 101",
      "Room 206",
      "Room 201",
      "Room 303",
      "Room 203",
      "Room 304",
      "Room 204",
      "Room 305",
      "Room 205",
      "Room 306",
    ],
  },
];

const StatusIndicator = ({ status }: { status: Building["status"] }) => {
  const getStatusColor = () => {
    switch (status) {
      case "available":
        return "bg-green-400";
      case "busy":
        return "bg-red-400";
      case "maintenance":
        return "bg-orange-400";
      default:
        return "bg-gray-400";
    }
  };

  return <div className={`h-3 w-3 rounded-full ${getStatusColor()}`} />;
};

const BuildingIllustration = ({ buildingId }: { buildingId: string }) => {
  return (
    <div className="relative mx-auto mb-4 h-32 w-32">
      <Image
        src={`/building-${buildingId.toLowerCase()}.png`}
        alt={`Building ${buildingId} illustration`}
        width={128}
        height={128}
        className="object-contain"
        priority
        onError={(e) => {
          console.log(`Failed to load image for building ${buildingId}`);
        }}
      />
    </div>
  );
};

const BuildingCard = ({ building }: { building: Building }) => {
  const router = useRouter();

  const handleRoomClick = (room: string) => {
    router.push(`/classroom/room/${building.id}/${room.replace("Room ", "")}`);
  };

  return (
    <Card className="w-full max-w-sm border border-gray-200 bg-white shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-gray-900">{building.name}</h3>
            <p className="text-sm text-gray-600">{building.department}</p>
          </div>
          <StatusIndicator status={building.status} />
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <BuildingIllustration buildingId={building.id} />

        <div className="grid grid-cols-2 gap-2">
          {building.rooms.map((room, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              onClick={() => handleRoomClick(room)}
              className="border-gray-300 px-3 py-2 text-xs transition-colors hover:border-orange-400 hover:text-orange-600"
            >
              {room}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default function BuildingDirectory() {
  return (
    <div className="min-h-screen p-2">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {buildings.map((building) => (
            <BuildingCard key={building.id} building={building} />
          ))}
        </div>
      </div>
    </div>
  );
}
