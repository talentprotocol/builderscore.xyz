"use client";

import { CSVRow } from "@/app/lib/csv-parser";
import { Cell, Legend, Pie, PieChart, ResponsiveContainer } from "recharts";

interface RewardsBreakdownChartProps {
  data: CSVRow[];
}

export default function RewardsBreakdownChart({
  data,
}: RewardsBreakdownChartProps) {
  const CHART_COLORS = {
    recipients: ["var(--chart-9)", "var(--chart-7)"],
    special: ["var(--chart-5)", "var(--chart-4)", "var(--chart-3)"],
  };

  const totalRow = data.find(
    (row) => row["Category"] === "Total Rewarded Users",
  );
  const totalCount = totalRow ? Number(totalRow["Count"]) : 0;

  const recipientTypeData = {
    "cell-1": {
      name: "Builder Rewards (one-time)",
      value: data.find(
        (row) => row["Category"] === "Builder Rewards (one-time)",
      )?.["Count"],
      percentage: data.find(
        (row) => row["Category"] === "Builder Rewards (one-time)",
      )?.["Percentage of Total"],
    },
    "cell-2": {
      name: "Builder Rewards (repeated recipient)",
      value:
        totalCount -
        Number(
          data.find(
            (row) => row["Category"] === "Builder Rewards (one-time)",
          )?.["Count"],
        ),
      percentage:
        (totalCount -
          Number(
            data.find(
              (row) => row["Category"] === "Builder Rewards (one-time)",
            )?.["Count"],
          )) /
        totalCount,
    },
  };

  const specialCategoriesData = data
    .filter(
      (row) =>
        row["Category"] === "BR + Base-builds" ||
        row["Category"] === "BR + Buildathon Winner" ||
        row["Category"] === "BR + Self-XYZ",
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

  return (
    <div className="rounded-lg border border-neutral-300 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-800">
      <div className="relative w-full">
        <div className="mb-4">
          <div className="mb-1 font-medium text-neutral-900 dark:text-white">
            Rewards Breakdown
          </div>
          <div className="text-xs text-neutral-500 dark:text-neutral-400">
            Breakdown of rewards recipients by category
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="h-[350px]">
            <h3 className="mb-2 text-center text-sm font-medium text-neutral-900 dark:text-white">
              One-time vs. Repeated Recipients
            </h3>
            <ResponsiveContainer width="100%" height="90%">
              <PieChart>
                <Pie
                  data={Object.values(recipientTypeData)}
                  fill="#8884d8"
                  dataKey="value"
                  isAnimationActive={false}
                  cx="50%"
                  cy="50%"
                  outerRadius={110}
                >
                  {Object.values(recipientTypeData).map((entry, index) => (
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
                    <span className="text-neutral-800 dark:text-white">
                      {value} ({Object.values(recipientTypeData)[index]?.value}{" "}
                      users)
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
            <h3 className="mb-2 text-center text-sm font-medium text-neutral-900 dark:text-white">
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
                      <span className="text-neutral-800 dark:text-white">
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
