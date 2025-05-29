"use client";

import Chart from "@/app/components/Chart";
import { ChartSeries, DataPoint } from "@/app/types/index/chart";

export default function ProfilesChart({
  data,
  series,
}: {
  data: DataPoint[];
  series: ChartSeries;
}) {
  return (
    <div className="card-style px-3 pt-2 pb-4">
      <div className="h-[300px]">
        <Chart
          data={data}
          series={series}
          xAxisKey="date"
          yAxisLabel={{
            left: "ENS & Farcaster",
            right: "Base Basename",
          }}
          height="100%"
        />
      </div>
    </div>
  );
}
