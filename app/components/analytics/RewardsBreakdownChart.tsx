"use client";

import { CSVRow } from "@/app/lib/csv-parser";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts";
import { useTheme } from "@/app/context/ThemeContext";

interface RewardsBreakdownChartProps {
  data: CSVRow[];
}

export default function RewardsBreakdownChart({
  data,
}: RewardsBreakdownChartProps) {
  const { isDarkMode } = useTheme();

  const CHART_COLORS = {
    recipients: ["var(--chart-1)", "var(--chart-2)"],
    special: ["var(--chart-3)", "var(--chart-4)", "var(--chart-5)"],
  };

  const totalRow = data.find(
    (row) => row["Category"] === "Total Rewarded Users",
  );
  const totalCount = totalRow ? Number(totalRow["Count"]) : 0;

  const recipientTypeData = data
    .filter(
      (row) =>
        row["Category"] === "Builder Rewards (one-time)" ||
        row["Category"] === "Builder Rewards (repeated recipient)",
    )
    .map((row) => ({
      name: String(row["Category"]),
      value: Number(row["Count"]),
      percentage: Number(row["Percentage of Total"]),
    }));

  const specialCategoriesData = data
    .filter(
      (row) =>
        row["Category"] === "BR + /base-builds" ||
        row["Category"] === "BR + Buildathon Winner",
    )
    .map((row) => ({
      name: String(row["Category"]),
      value: Number(row["Count"]),
      percentage: Number(row["Percentage of Total"]),
    }));

  const specialCount = specialCategoriesData.reduce(
    (sum, item) => sum + item.value,
    0,
  );
  const nonSpecialCount = totalCount - specialCount;
  const nonSpecialPercentage = (nonSpecialCount / totalCount) * 100;

  const enhancedSpecialData = [
    ...specialCategoriesData,
    {
      name: "No Special Recognition",
      value: nonSpecialCount,
      percentage: nonSpecialPercentage,
    },
  ];

  const cardClass = `p-4 rounded-lg ${
    isDarkMode
      ? "bg-neutral-800 border border-neutral-800"
      : "bg-white border border-neutral-300"
  }`;
  const textColor = isDarkMode ? "text-white" : "text-neutral-900";
  const descColor = isDarkMode ? "text-neutral-400" : "text-neutral-500";

  return (
    <div className={cardClass}>
      <div className="w-full relative">
        <div className="mb-4">
          <div className={`font-semibold mb-1 ${textColor}`}>
            Rewards Breakdown
          </div>
          <div className={`text-xs ${descColor}`}>
            Breakdown of rewards recipients by category
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="h-[350px]">
            <h3 className={`${textColor} text-center text-sm font-medium mb-2`}>
              One-time vs. Repeated Recipients
            </h3>
            <ResponsiveContainer width="100%" height="90%">
              <PieChart>
                <Pie
                  data={recipientTypeData}
                  fill="#8884d8"
                  dataKey="value"
                  isAnimationActive={false}
                  cx="50%"
                  cy="50%"
                  outerRadius={110}
                >
                  {recipientTypeData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        CHART_COLORS.recipients[
                          index % CHART_COLORS.recipients.length
                        ]
                      }
                    />
                  ))}
                </Pie>
                <Legend
                  formatter={(value, entry, index) => (
                    <span
                      className={isDarkMode ? "text-white" : "text-neutral-800"}
                    >
                      {value} ({recipientTypeData[index]?.value} users)
                    </span>
                  )}
                  wrapperStyle={{
                    fontSize: 11,
                    height: 40,
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="h-[350px]">
            <h3 className={`${textColor} text-center text-sm font-medium mb-2`}>
              Special Recognition Categories
            </h3>
            <ResponsiveContainer width="100%" height="90%">
              <PieChart>
                <Pie
                  data={enhancedSpecialData}
                  fill="#8884d8"
                  dataKey="value"
                  isAnimationActive={false}
                  cx="50%"
                  cy="50%"
                  outerRadius={110}
                >
                  {enhancedSpecialData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        CHART_COLORS.special[
                          index % CHART_COLORS.special.length
                        ]
                      }
                    />
                  ))}
                </Pie>
                <Legend
                  formatter={(value, entry, index) => {
                    const name = enhancedSpecialData[index]?.name;
                    const count = enhancedSpecialData[index]?.value;
                    return (
                      <span
                        className={
                          isDarkMode ? "text-white" : "text-neutral-800"
                        }
                      >
                        {name} ({count} users)
                      </span>
                    );
                  }}
                  wrapperStyle={{
                    fontSize: 11,
                    height: 40,
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
