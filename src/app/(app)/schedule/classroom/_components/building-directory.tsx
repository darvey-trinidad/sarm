"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { api } from "@/trpc/react";
import { Skeleton } from "@/components/ui/skeleton";
import { env } from "@/env";
interface Building {
  id: string;
  name: string;
  description: string;
  rooms: { id: string; name: string }[];
}

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
        onError={() => {
          console.log(`Failed to load image for building ${buildingId}`);
        }}
      />
    </div>
  );
};

const BuildingCard = ({ building }: { building: Building }) => {
  const handleRoomClick = (roomId: string) => {
    window.location.href = `${env.NEXT_PUBLIC_APP_URL}/schedule/classroom/${roomId}`;
  };

  return (
    <Card className="w-full max-w-sm border border-gray-200 bg-white shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-gray-900">{building.name}</h3>
            <p className="text-sm text-gray-600">{building.description}</p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="relative mx-auto mb-4 h-32 w-32">
          <Image
            src={"/Building.png"}
            alt="Building Illustration"
            width={130}
            height={130}
            className="object-contain"
            priority
            onError={() => {
              console.log("Failed to load image for building");
            }}
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          {building.rooms.map((room) => (
            <Button
              key={room.id}
              variant="outline"
              size="sm"
              onClick={() => handleRoomClick(room.id)}
              className="border-gray-300 px-2 py-1 text-xs transition-colors hover:border-orange-800 hover:text-orange-800"
            >
              {room.name}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default function BuildingDirectory() {
  const { data, isLoading } = api.classroom.getClassroomsPerBuilding.useQuery();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, idx) => (
          <Skeleton key={idx} className="h-100 w-95 rounded-sm" />
        ))}
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {data?.map((building) => (
            <BuildingCard
              key={building.buildingId}
              building={{
                id: building.buildingId,
                name: building.name,
                description: building.description ?? "",
                rooms: building.classrooms,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
