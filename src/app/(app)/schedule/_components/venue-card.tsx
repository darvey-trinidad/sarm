"use client";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { api } from "@/trpc/react";
import { Skeleton } from "@/components/ui/skeleton";
import ClassroomCard from "./classroom-card";
import { PageRoutes } from "@/constants/page-routes";
import Link from "next/link";
import { Roles, ROLES } from "@/constants/roles";
type Venue = {
  id: string;
  name: string;
};

type VenueCardProps = {
  role: string;
};
export default function VenueCard({ role }: VenueCardProps) {
  const { data: venues, isLoading } = api.venue.getAllVenues.useQuery();

  if (isLoading) {
    return (
      <div className="flex flex-col gap-5 lg:flex-row">
        <Skeleton className="h-85 w-85 rounded-sm" />
        <Skeleton className="h-85 w-85 rounded-sm" />
        <Skeleton className="h-85 w-85 rounded-sm" />
      </div>
    );
  }
  return (
    <div className="grid grid-cols-1 items-center justify-center gap-6 md:grid-cols-2 lg:grid-cols-4">
      <Link href={PageRoutes.SCHEDULE_CLASSROOM}>
        <ClassroomCard />
      </Link>
      {role !== Roles.ClassroomManager &&
        venues?.map((venue) => (
          <Link href={`/schedule/${venue.id}`} key={venue.id}>
            <Card
              key={venue.id}
              className="h-85 w-85 cursor-pointer bg-white shadow-md transition-shadow duration-300 hover:shadow-xl"
            >
              <CardContent className="flex h-full flex-col p-0">
                {/* Header */}
                <div className="flex items-center gap-2 pb-2 pl-4">
                  <div className="h-3 w-3 rounded-xs bg-orange-500"></div>
                  <h3 className="text-medium font-semibold text-gray-800">
                    {venue.name}
                  </h3>
                </div>

                {/* Illustration */}
                <div className="flex flex-1 items-center justify-center p-2 pt-0">
                  <div className="relative h-full max-h-64 w-full max-w-64">
                    <Image
                      src={"/social-hall-card.png"}
                      alt={venue.name}
                      layout="responsive"
                      objectFit="contain"
                      width={500}
                      height={500}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
    </div>
  );
}
