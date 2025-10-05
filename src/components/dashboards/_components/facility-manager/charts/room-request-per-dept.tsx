"use client";

import * as React from "react";
import { api } from "@/trpc/react";
import { Label, Pie, PieChart, ResponsiveContainer } from "recharts";
import { ChartSkeleton } from "../../skeletons/received-room-skeleton";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export default function RoomRequestPerDeptChart() {
  const { data: roomData, isLoading } =
    api.classroomSchedule.getRoomRequestStatsByDepartment.useQuery();

  const chartData = React.useMemo(() => {
    if (!roomData || roomData.length === 0) return [];
    return roomData.map((dept, i) => ({
      department: dept.department?.toUpperCase() ?? "UNKNOWN",
      requests: dept.requests,
      fill: `var(--chart-${(i % 5) + 1})`,
    }));
  }, [roomData]);

  const totalRequests = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.requests, 0);
  }, [chartData]);

  const chartConfig = React.useMemo(() => {
    if (!roomData || roomData.length === 0) return {};
    return roomData.reduce(
      (acc, dept, i) => {
        const key = dept.department ?? `Dept-${i + 1}`;
        acc[key] = {
          label: key.toUpperCase(),
          color: `var(--chart-${(i % 5) + 1})`,
        };
        return acc;
      },
      {} as Record<string, { label: string; color: string }>,
    );
  }, [roomData]);

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Room Requests per Department</CardTitle>
        <CardDescription>Total room requests this month.</CardDescription>
      </CardHeader>

      {isLoading ? (
        <CardContent>
          <ChartSkeleton />
        </CardContent>
      ) : (
        <CardContent className="flex-1 pb-0">
          <ChartContainer
            config={chartConfig}
            className="mx-auto aspect-square max-h-[300px] w-full"
          >
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Pie
                  data={chartData}
                  dataKey="requests"
                  nameKey="department"
                  innerRadius="60%"
                  outerRadius="100%"
                  paddingAngle={3}
                  strokeWidth={4}
                >
                  <Label
                    content={({ viewBox }) => {
                      if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                        return (
                          <text
                            x={viewBox.cx}
                            y={viewBox.cy}
                            textAnchor="middle"
                            dominantBaseline="middle"
                          >
                            <tspan
                              x={viewBox.cx}
                              y={viewBox.cy}
                              className="fill-foreground text-2xl font-bold sm:text-3xl"
                            >
                              {totalRequests}
                            </tspan>
                            <tspan
                              x={viewBox.cx}
                              y={(viewBox.cy || 0) + 20}
                              className="fill-muted-foreground text-sm sm:text-base"
                            >
                              Requests
                            </tspan>
                          </text>
                        );
                      }
                    }}
                  />
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      )}
    </Card>
  );
}
