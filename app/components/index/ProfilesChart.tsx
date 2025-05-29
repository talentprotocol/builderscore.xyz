"use client";

import Chart from "@/app/components/Chart";
import { formatChartDate } from "@/app/lib/utils";

interface ProfileData {
  date: string;
  count: number;
}

interface ProfilesData {
  base_basename: ProfileData[];
  ens: ProfileData[];
  farcaster: ProfileData[];
}

export default function ProfilesChart() {
  const CHART_COLORS = {
    base_basename: "var(--chart-1)",
    ens: "var(--chart-2)",
    farcaster: "var(--chart-3)",
  };

  const simulatedData: ProfilesData = {
    base_basename: [
      { date: "2025-05-02", count: 0 },
      { date: "2025-05-01", count: 0 },
      { date: "2025-04-30", count: 296 },
      { date: "2025-04-29", count: 0 },
      { date: "2025-04-28", count: 279 },
      { date: "2025-04-27", count: 312 },
      { date: "2025-04-26", count: 185 },
      { date: "2025-04-25", count: 234 },
      { date: "2025-04-24", count: 156 },
      { date: "2025-04-23", count: 298 },
    ],
    ens: [
      { date: "2025-05-02", count: 12 },
      { date: "2025-05-01", count: 8 },
      { date: "2025-04-30", count: 45 },
      { date: "2025-04-29", count: 23 },
      { date: "2025-04-28", count: 67 },
      { date: "2025-04-27", count: 34 },
      { date: "2025-04-26", count: 29 },
      { date: "2025-04-25", count: 52 },
      { date: "2025-04-24", count: 41 },
      { date: "2025-04-23", count: 38 },
    ],
    farcaster: [
      { date: "2025-05-02", count: 156 },
      { date: "2025-05-01", count: 134 },
      { date: "2025-04-30", count: 178 },
      { date: "2025-04-29", count: 167 },
      { date: "2025-04-28", count: 145 },
      { date: "2025-04-27", count: 189 },
      { date: "2025-04-26", count: 123 },
      { date: "2025-04-25", count: 198 },
      { date: "2025-04-24", count: 176 },
      { date: "2025-04-23", count: 201 },
    ],
  };

  const dailyChartData = simulatedData.base_basename
    .map((item, index) => ({
      date: formatChartDate(item.date),
      base_basename: item.count,
      ens: simulatedData.ens[index]?.count || 0,
      farcaster: simulatedData.farcaster[index]?.count || 0,
    }))
    .reverse();

  const series = {
    left: [
      {
        key: "ens",
        name: "ENS",
        color: CHART_COLORS.ens,
        type: "stacked-column" as const,
      },
      {
        key: "farcaster",
        name: "Farcaster",
        color: CHART_COLORS.farcaster,
        type: "stacked-column" as const,
      },
    ],
    right: [
      {
        key: "base_basename",
        name: "Base Basename",
        color: CHART_COLORS.base_basename,
        type: "area" as const,
      },
    ],
  };

  return (
    <div className="card-style px-3 pt-2 pb-4">
      <div className="h-[300px]">
        <Chart
          data={dailyChartData}
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
