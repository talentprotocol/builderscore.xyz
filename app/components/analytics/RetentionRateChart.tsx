"use client";

import { useTheme } from "@/app/context/ThemeContext";
import { CSVRow } from "@/app/lib/csv-parser";
import { formatDate } from "@/app/lib/utils";
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface RetentionRateChartProps {
  data: CSVRow[];
}

export default function RetentionRateChart({ data }: RetentionRateChartProps) {
  const { isDarkMode } = useTheme();

  const CHART_COLORS = {
    activeDevs: "var(--chart-7)",
    inactiveDevs: "var(--chart-5)",
    retentionRate: "var(--chart-9)",
  };

  const chartData = data.map((row) => {
    const dateStr = row["Week Start Date"] as string;
    return {
      date: formatDate(dateStr),
      activeDevs: Number(row["Total Active Devs"]),
      inactiveDevs: Number(row["Total Inactive Devs"]),
      retentionRate: Number(row["Retention Rate (%)"]),
    };
  });

  return (
    <div className="rounded-lg border border-neutral-300 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-800">
      <div className="relative w-full">
        <div className="mb-4">
          <div className="mb-1 font-medium text-neutral-900 dark:text-white">
            Builder Rewards Retention
          </div>
          <div className="text-xs text-neutral-500 dark:text-neutral-400">
            Weekly active/inactive developers and retention rate
          </div>
        </div>

        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartData}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={isDarkMode ? "#444" : "#eee"}
              />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 12 }}
                stroke={isDarkMode ? "#aaa" : "#666"}
                dy={10}
              />
              <YAxis
                yAxisId="left"
                domain={[0, "auto"]}
                tick={{ fontSize: 12 }}
                stroke={isDarkMode ? "#aaa" : "#666"}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                domain={[0, 100]}
                tickFormatter={(value) => `${value}%`}
                tick={{ fontSize: 12 }}
                stroke={isDarkMode ? "#aaa" : "#666"}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: isDarkMode ? "#333" : "#fff",
                  color: isDarkMode ? "#fff" : "#333",
                  border: `1px solid ${isDarkMode ? "#555" : "#ddd"}`,
                  fontSize: 12,
                }}
                formatter={(value, name) => {
                  if (name === "Retention Rate %") {
                    return [
                      `${typeof value === "number" ? value.toFixed(2) : value}%`,
                      "Retention Rate",
                    ];
                  } else if (name === "Active Developers") {
                    return [value, "Active Developers"];
                  } else {
                    return [value, "Inactive Developers"];
                  }
                }}
                itemStyle={{
                  paddingTop: 6,
                  paddingBottom: 0,
                }}
              />
              <Legend
                wrapperStyle={{
                  fontSize: 11,
                  paddingTop: 15,
                }}
              />
              <Bar
                yAxisId="left"
                dataKey="activeDevs"
                stackId="a"
                fill={CHART_COLORS.activeDevs}
                name="Active Developers"
                isAnimationActive={false}
              />
              <Bar
                yAxisId="left"
                dataKey="inactiveDevs"
                stackId="a"
                fill={CHART_COLORS.inactiveDevs}
                name="Inactive Developers"
                isAnimationActive={false}
              />
              <Line
                yAxisId="right"
                type="linear"
                dataKey="retentionRate"
                stroke={CHART_COLORS.retentionRate}
                strokeWidth={1}
                name="Retention Rate %"
                dot={{ r: 4 }}
                isAnimationActive={false}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
