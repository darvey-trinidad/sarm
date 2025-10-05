"use client";

import * as React from "react";
import { api } from "@/trpc/react";
import { TrendingUp } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Rectangle,
  ResponsiveContainer,
  XAxis,
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { ChartSkeleton } from "../../skeletons/received-room-skeleton";

export default function ClassroomBorrowingDeptChart() {
  const { data: classroomData, isLoading } =
    api.classroomSchedule.getRoomRequestStatsByDepartment.useQuery();

  const chartData = React.useMemo(() => {
    if (!classroomData || classroomData.length === 0) return [];
    return classroomData.map((dept, i) => ({
      department: dept.department?.toUpperCase() ?? `DEPT-${i + 1}`,
      requests: dept.requests,
      fill: `var(--chart-${(i % 5) + 1})`,
    }));
  }, [classroomData]);

  const chartConfig = React.useMemo(() => {
    if (!classroomData || classroomData.length === 0) return {};
    return classroomData.reduce<
      Record<string, { label: string; color: string }>
    >((acc, dept, i) => {
      const key = dept.department ?? `Dept-${i + 1}`;
      acc[key] = {
        label: key.toUpperCase(),
        color: `var(--chart-${(i % 5) + 1})`,
      };
      return acc;
    }, {});
  }, [classroomData]);

  if (isLoading) {
    return (
      <Card>
        <CardContent>
          <ChartSkeleton />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Room Requests per Department</CardTitle>
        <CardDescription>
          Per deparment room request this month.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis
                dataKey="department"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                interval={0}
                angle={-20}
                textAnchor="end"
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Bar
                dataKey="requests"
                radius={6}
                strokeWidth={2}
                activeBar={({ ...props }) => (
                  <Rectangle
                    {...props}
                    fillOpacity={0.9}
                    stroke={props.payload.fill}
                    strokeDasharray={4}
                    strokeDashoffset={4}
                  />
                )}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
