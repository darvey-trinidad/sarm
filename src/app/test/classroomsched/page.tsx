"use client";

// pang testing lang

import { api } from "@/trpc/react";

export default function RoomPage() {
  const data = api.classroomSchedule.getClassroomSchedule.useQuery({
    classroomId: "426938b5-b503-4110-8713-e803f86eb1b6",
    date: new Date("2025-08-05"),
  });

  return (
    <div>
      {JSON.stringify(data)}
    </div>
  );
}
