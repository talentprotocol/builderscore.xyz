"use client";

import { useTheme } from "@/app/context/ThemeContext";
import {
  useAnalyticsActiveUsers,
  useNotificationTokens,
} from "@/app/hooks/useRewardsAnalytics";
import { GoogleAnalyticsActiveUserData } from "@/app/types/rewards/googleAnalytics";
import { CumulativeNotificationData } from "@/app/types/rewards/neynar";
import { useMemo } from "react";
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

interface CombinedChartData extends CumulativeNotificationData {
  activeUsers: number;
}

export default function SocialGrowthChart() {
  const { isDarkMode } = useTheme();

  const {
    data: warpcastData,
    isLoading: isLoadingWarpcast,
    error: warpcastError,
  } = useNotificationTokens();

  const {
    data: analyticsData,
    isLoading: isLoadingAnalytics,
    error: analyticsError,
  } = useAnalyticsActiveUsers();

  const combinedData: CombinedChartData[] = useMemo(() => {
    if (!warpcastData?.cumulativeData || !analyticsData?.data) {
      return [];
    }

    return warpcastData.cumulativeData.map((item) => {
      const matchingGAData = analyticsData.data.find(
        (gaItem: GoogleAnalyticsActiveUserData) => gaItem.date === item.date,
      );
      return {
        ...item,
        activeUsers: matchingGAData?.activeUsers || 0,
      };
    });
  }, [warpcastData?.cumulativeData, analyticsData?.data]);

  const CHART_COLOR_1 = "var(--chart-1)";
  const CHART_COLOR_2 = "var(--chart-2)";

  const isLoading = isLoadingWarpcast || isLoadingAnalytics;
  const error = warpcastError || analyticsError;

  const renderChart = (data: CombinedChartData[]) => (
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
          domain={[0, "auto"]}
          tick={{ fontSize: 12 }}
          stroke={isDarkMode ? "#aaa" : "#666"}
          yAxisId="left"
        />
        <YAxis
          domain={[0, "auto"]}
          tick={{ fontSize: 12 }}
          stroke={isDarkMode ? "#aaa" : "#666"}
          orientation="right"
          yAxisId="right"
        />
        <Tooltip
          contentStyle={{
            backgroundColor: isDarkMode ? "#333" : "#fff",
            color: isDarkMode ? "#fff" : "#333",
            border: `1px solid ${isDarkMode ? "#555" : "#ddd"}`,
            fontSize: 12,
          }}
          formatter={(value, name) => {
            if (name === "Warpcast Mini App Added") {
              return [value, "Warpcast Mini App Added"];
            }
            if (name === "builderscore.xyz DAU") {
              return [value, "builderscore.xyz DAU"];
            }
            return [value, name];
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
          type="linear"
          dataKey="cumulativeEnabled"
          stroke={CHART_COLOR_1}
          activeDot={{ r: 6 }}
          name="Warpcast Mini App Added"
          strokeWidth={1}
          isAnimationActive={false}
          yAxisId="left"
        />
        <Line
          type="linear"
          dataKey="activeUsers"
          stroke={CHART_COLOR_2}
          activeDot={{ r: 6 }}
          name="builderscore.xyz DAU"
          strokeWidth={1}
          isAnimationActive={false}
          yAxisId="right"
        />
      </LineChart>
    </ResponsiveContainer>
  );

  if (isLoading) {
    return (
      <div className="rounded-lg border border-neutral-300 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-800">
        <div className="font-semibold text-neutral-900 dark:text-white">
          App Growth & Usage
        </div>
        <div className="flex justify-center py-4 text-xs text-neutral-900 dark:text-white">
          Loading Data...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-neutral-300 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-800">
        <div className="font-semibold text-neutral-900 dark:text-white">
          App Growth & Usage
        </div>
        <div className="mt-4 flex justify-center text-xs text-red-500">
          Error:{" "}
          {error instanceof Error ? error.message : "An unknown error occurred"}
        </div>
      </div>
    );
  }

  if (combinedData.length === 0) {
    return (
      <div className="rounded-lg border border-neutral-300 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-800">
        <div className="font-semibold text-neutral-900 dark:text-white">
          App Growth & Usage
        </div>
        <div className="mt-4 flex justify-center text-xs text-neutral-500 dark:text-neutral-400">
          No growth or usage data available
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-neutral-300 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-800">
      <div className="mb-4">
        <div className="mb-1 font-semibold text-neutral-900 dark:text-white">
          App Growth & Usage
        </div>
        <div className="text-xs text-neutral-500 dark:text-neutral-400">
          Warpcast Mini App adoption and builderscore.xyz Daily Active Users
        </div>
      </div>

      <div className="h-[300px]">{renderChart(combinedData)}</div>
    </div>
  );
}
