"use client";

import { useSponsor } from "@/app/context/SponsorContext";
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

interface ActivityByTypeChartProps {
  data: CSVRow[];
}

export default function ActivityByTypeChart({
  data,
}: ActivityByTypeChartProps) {
  const { isDarkMode } = useTheme();
  const { selectedSponsor } = useSponsor();

  const CHART_COLORS = {
    githubDevs: "var(--chart-1)",
    githubRepos: "var(--chart-2)",
    contractDevs: "var(--chart-3)",
    contracts: "var(--chart-4)",
  };

  const weeklyChartData = data.map((row) => {
    const dateStr = row["Week Start Date (Monday)"] as string;
    return {
      date: formatDate(dateStr),
      githubDevs: Number(row["Devs with GitHub Activity"]),
      githubRepos: Number(row["Total GitHub Repos"]),
      contractDevs: Number(
        row[`Devs with ${selectedSponsor?.name} Contract Activity`],
      ),
      totalContracts: Number(row[`Total ${selectedSponsor?.name} Contracts`]),
    };
  });

  return (
    <div className="rounded-lg border border-neutral-300 bg-white p-4 dark:border dark:border-neutral-800 dark:bg-neutral-800">
      <div className="relative w-full">
        <div className="mb-4">
          <div className="mb-1 font-semibold text-neutral-900 dark:text-white">
            Builder Activity by Type
          </div>
          <div className="text-xs text-neutral-500 dark:text-neutral-400">
            Weekly GitHub and {selectedSponsor?.name} Contract activity metrics
          </div>
        </div>

        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={weeklyChartData}>
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
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: isDarkMode ? "#333" : "#fff",
                  color: isDarkMode ? "#fff" : "#333",
                  border: `1px solid ${isDarkMode ? "#555" : "#ddd"}`,
                  fontSize: 12,
                }}
                formatter={(value, name) => {
                  switch (name) {
                    case "GitHub Developers":
                      return [value, "GitHub Developers"];
                    case "GitHub Repositories":
                      return [value, "Public Repositories"];
                    case "Contract Developers":
                      return [value, "Contract Developers"];
                    case `${selectedSponsor?.name} Contracts`:
                      return [value, "Verified Contracts"];
                    default:
                      return [value, name];
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
                yAxisId="left"
                type="linear"
                dataKey="githubDevs"
                stroke={CHART_COLORS.githubDevs}
                activeDot={{ r: 6 }}
                name="GitHub Developers"
                strokeWidth={1}
                isAnimationActive={false}
              />
              <Line
                yAxisId="right"
                type="linear"
                dataKey="githubRepos"
                stroke={CHART_COLORS.githubRepos}
                name="Public Repositories"
                strokeWidth={1}
                isAnimationActive={false}
              />
              <Line
                yAxisId="left"
                type="linear"
                dataKey="contractDevs"
                stroke={CHART_COLORS.contractDevs}
                name="Contract Developers"
                strokeWidth={1}
                isAnimationActive={false}
              />
              <Line
                yAxisId="right"
                type="linear"
                dataKey="totalContracts"
                stroke={CHART_COLORS.contracts}
                name="Verified Contracts"
                strokeWidth={1}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
