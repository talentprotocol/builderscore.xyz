"use client";

import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { useTheme } from "@/app/context/ThemeContext";
import {
  CumulativeNotificationData,
  NotificationTokensApiResponse,
} from "@/app/types/neynar";
import {
  GoogleAnalyticsActiveUserData,
  GoogleAnalyticsApiResponse,
} from "@/app/types/googleAnalytics";

interface CombinedChartData extends CumulativeNotificationData {
  activeUsers: number;
}

export default function SocialGrowthChart() {
  const { isDarkMode } = useTheme();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cumulativeData, setCumulativeData] = useState<
    CumulativeNotificationData[]
  >([]);
  const [analyticsData, setAnalyticsData] = useState<
    GoogleAnalyticsActiveUserData[]
  >([]);

  const combinedData: CombinedChartData[] = cumulativeData.map((item) => {
    const matchingGAData = analyticsData.find(
      (gaItem) => gaItem.date === item.date,
    );
    return {
      ...item,
      activeUsers: matchingGAData?.activeUsers || 0,
    };
  });

  const CHART_COLOR_1 = "var(--chart-1)";
  const CHART_COLOR_2 = "var(--chart-2)";

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const warpcastResponse = await fetch(
          "/api/neynar/notification_tokens",
          {
            next: {
              revalidate: 86400,
            },
          },
        );

        if (!warpcastResponse.ok) {
          throw new Error(
            `Failed to fetch Warpcast data: ${warpcastResponse.status} ${warpcastResponse.statusText}`,
          );
        }

        const warpcastResult =
          (await warpcastResponse.json()) as NotificationTokensApiResponse;

        if (!warpcastResult.success) {
          throw new Error(
            warpcastResult.error || "Failed to fetch Warpcast data",
          );
        }

        const gaResponse = await fetch("/api/analytics/active_users", {
          next: {
            revalidate: 86400,
          },
        });

        if (!gaResponse.ok) {
          throw new Error(
            `Failed to fetch Google Analytics data: ${gaResponse.status} ${gaResponse.statusText}`,
          );
        }

        const gaResult =
          (await gaResponse.json()) as GoogleAnalyticsApiResponse;

        if (!gaResult.success) {
          throw new Error(
            gaResult.error || "Failed to fetch Google Analytics data",
          );
        }

        setCumulativeData(warpcastResult.cumulativeData || []);
        setAnalyticsData(gaResult.data || []);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(
          error instanceof Error ? error.message : "An unknown error occurred",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const cardClass = `p-4 rounded-lg ${
    isDarkMode
      ? "bg-neutral-800 border border-neutral-800"
      : "bg-white border border-neutral-300"
  }`;
  const textColor = isDarkMode ? "text-white" : "text-neutral-900";
  const descColor = isDarkMode ? "text-neutral-400" : "text-neutral-500";

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

  if (loading) {
    return (
      <div className={cardClass}>
        <div className={`font-semibold ${textColor}`}>App Growth & Usage</div>
        <div className={`text-xs ${textColor} py-4 flex justify-center`}>
          Loading Data...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={cardClass}>
        <div className={`font-semibold ${textColor}`}>App Growth & Usage</div>
        <div
          className={`text-xs ${descColor} mt-4 flex justify-center text-red-500`}
        >
          Error: {error}
        </div>
      </div>
    );
  }

  if (cumulativeData.length === 0 && analyticsData.length === 0) {
    return (
      <div className={cardClass}>
        <div className={`font-semibold ${textColor}`}>App Growth & Usage</div>
        <div className={`text-xs ${descColor} mt-4 flex justify-center`}>
          No growth or usage data available
        </div>
      </div>
    );
  }

  return (
    <div className={cardClass}>
      <div className="mb-4">
        <div className={`font-semibold mb-1 ${textColor}`}>
          App Growth & Usage
        </div>
        <div className={`text-xs ${descColor}`}>
          Warpcast Mini App adoption and builderscore.xyz Daily Active Users
        </div>
      </div>

      <div className="h-[300px]">{renderChart(combinedData)}</div>
    </div>
  );
}
