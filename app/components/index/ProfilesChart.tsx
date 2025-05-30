"use client";

import Chart from "@/app/components/Chart";
import { TABLE_HEIGHT } from "@/app/lib/constants";
import { cn } from "@/app/lib/utils";
import { ChartSeries, DataPoint } from "@/app/types/index/chart";

export default function ProfilesChart({
  data,
  series,
}: {
  data: DataPoint[];
  series: ChartSeries;
}) {
  return (
    <div className={cn("card-style px-3 pt-2 pb-4", TABLE_HEIGHT)}>
      <Chart data={data} series={series} xAxisKey="date" height="100%" />
    </div>
  );
}
