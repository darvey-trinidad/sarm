"use client";

import { useMemo } from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import { api } from "@/trpc/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { ChartSkeleton } from "../../skeletons/received-room-skeleton";

export default function VenueBorrowingChart() {
  const { data: venueData, isLoading } =
    api.venue.getVenueReservationPastMonthsStats.useQuery();

  const chartConfig = useMemo(() => {
    if (!venueData || venueData.length === 0) return {};

    const firstDataItem = venueData[0];
    if (!firstDataItem) return {};
    const venues = Object.keys(firstDataItem).filter((key) => key !== "month");

    return venues.reduce(
      (acc, venue, i) => {
        acc[venue] = {
          label: venue,
          color: `var(--chart-${(i % 5) + 1})`,
        };
        return acc;
      },
      {} as Record<string, { label: string; color: string }>,
    );
  }, [venueData]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Venue Reservation Statistics</CardTitle>
        <CardDescription>Monthly request count per venue.</CardDescription>
      </CardHeader>
      {isLoading ? (
        <CardContent>
          <ChartSkeleton />
        </CardContent>
      ) : (
        <CardContent>
          <ChartContainer config={chartConfig}>
            <AreaChart
              accessibilityLayer
              data={venueData ?? []}
              margin={{ left: 12, right: 12 }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value: string) => value.slice(0, 3)}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="line" />}
              />
              {Object.entries(chartConfig).map(([venue, cfg]) => (
                <Area
                  key={venue}
                  dataKey={venue}
                  type="natural"
                  fill={cfg.color}
                  fillOpacity={0.4}
                  stroke={cfg.color}
                  stackId="a"
                />
              ))}
              <ChartLegend content={<ChartLegendContent />} />
            </AreaChart>
          </ChartContainer>
        </CardContent>
      )}
    </Card>
  );
}
