"use client";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/app/components/ui/tabs";
import { useTheme } from "@/app/context/ThemeContext";
import { CSVRow } from "@/app/lib/csv-parser";
import { formatDate } from "@/app/lib/utils";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface ActivityChartProps {
  dailyData: CSVRow[];
  weeklyData: CSVRow[];
}

export default function ActivityChart({
  dailyData,
  weeklyData,
}: ActivityChartProps) {
  const { isDarkMode } = useTheme();

  const CHART_COLORS = {
    activationRate: "var(--chart-9)",
    eligibleBuilders: "var(--chart-7)",
    activeBuilders: "var(--chart-5)",
  };

  const filteredDailyData = dailyData.filter(
    (row) =>
      Number(row["New Eligible Devs"]) > 0 || Number(row["Active Devs"]) > 0,
  );

  const dailyChartData = filteredDailyData.map((row) => {
    const dateStr = row["Date"] as string;
    return {
      date: formatDate(dateStr),
      newEligibleBuilders: Number(row["New Eligible Devs"]),
      activeBuilders: Number(row["Active Devs"]),
      activationRate: Number(row["Activation Rate (%)"]),
    };
  });

  const weeklyChartData = weeklyData.map((row) => {
    const dateStr = row["Week Start Date (Monday)"] as string;
    return {
      date: formatDate(dateStr),
      newEligibleBuilders: Number(row["New Eligible Devs"]),
      activeBuilders: Number(row["Active Devs"]),
      activationRate: Number(row["Activation Rate (%)"]),
    };
  });

  const renderChart = (data: typeof dailyChartData) => (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data}>
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
          domain={[0, "auto"]}
          tick={{ fontSize: 12 }}
          stroke={isDarkMode ? "#aaa" : "#666"}
          tickFormatter={(value) => {
            return `${value}%`;
          }}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: isDarkMode ? "#333" : "#fff",
            color: isDarkMode ? "#fff" : "#333",
            border: `1px solid ${isDarkMode ? "#555" : "#ddd"}`,
            fontSize: 12,
          }}
          formatter={(value, name) => {
            if (name === "Activation Rate %") {
              return [
                `${typeof value === "number" ? value.toFixed(2) : value}%`,
                "Activation Rate",
              ];
            }

            if (name === "Eligible Builders") {
              return [value, "Eligible Builders"];
            }

            if (name === "Active Builders") {
              return [value, "Active Builders"];
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
        <Line
          yAxisId="right"
          type="linear"
          dataKey="activationRate"
          stroke={CHART_COLORS.activationRate}
          activeDot={{ r: 6 }}
          name="Activation Rate %"
          strokeWidth={1}
          isAnimationActive={false}
        />
        <Line
          yAxisId="left"
          type="linear"
          dataKey="newEligibleBuilders"
          stroke={CHART_COLORS.eligibleBuilders}
          name="Eligible Builders"
          strokeWidth={1}
          isAnimationActive={false}
        />
        <Line
          yAxisId="left"
          type="linear"
          dataKey="activeBuilders"
          stroke={CHART_COLORS.activeBuilders}
          name="Active Builders"
          strokeWidth={1}
          isAnimationActive={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );

  return (
    <div className="rounded-lg border border-neutral-300 bg-white p-4 dark:border dark:border-neutral-800 dark:bg-neutral-800">
      <Tabs defaultValue="daily" className="relative w-full">
        <div className="sm:mb-4">
          <div className="mb-1 font-medium text-neutral-900 dark:text-white">
            Builder Activity
          </div>
          <div className="text-xs text-neutral-500 dark:text-neutral-400">
            New eligible Builders, active Builders, and activation rate
          </div>
        </div>

        <TabsList className="top-0 right-0 mb-3 bg-neutral-200 text-neutral-800 sm:absolute dark:bg-neutral-900 dark:text-white">
          <TabsTrigger
            className="mr-0.5 cursor-pointer bg-neutral-200 text-xs text-neutral-800 hover:bg-white data-[state=active]:bg-white dark:bg-neutral-900 dark:hover:bg-neutral-800 dark:data-[state=active]:bg-neutral-800"
            value="daily"
          >
            Daily
          </TabsTrigger>
          <TabsTrigger
            className="mr-0.5 cursor-pointer bg-neutral-200 text-xs text-neutral-800 hover:bg-white data-[state=active]:bg-white dark:bg-neutral-900 dark:hover:bg-neutral-800 dark:data-[state=active]:bg-neutral-800"
            value="weekly"
          >
            Weekly
          </TabsTrigger>
        </TabsList>

        <TabsContent value="daily" className="mt-0">
          <div className="h-[300px]">{renderChart(dailyChartData)}</div>
        </TabsContent>

        <TabsContent value="weekly" className="mt-0">
          <div className="h-[300px]">{renderChart(weeklyChartData)}</div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
