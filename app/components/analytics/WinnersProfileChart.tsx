"use client";

import { CSVRow } from "@/app/lib/csv-parser";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { useTheme } from "@/app/context/ThemeContext";
import { useState, useEffect } from "react";

interface WinnersProfileChartProps {
  data: CSVRow[];
}

interface CombinedExperienceItem {
  name: string;
  value: number;
  percentage: number;
  years: number;
  githubValue: number;
  onchainValue: number;
}

export default function WinnersProfileChart({
  data,
}: WinnersProfileChartProps) {
  const { isDarkMode } = useTheme();
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsSmallScreen(window.innerWidth < 640);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const CHART_COLORS = {
    builderScore: [
      "var(--chart-1)",
      "var(--chart-2)",
      "var(--chart-3)",
      "var(--chart-4)",
      "var(--chart-5)",
      "var(--chart-6)"
    ],
    experience: {
      github: "var(--chart-1)",
      onchain: "var(--chart-2)"
    }
  };

  const builderScoreData = data
    .filter((row) => row["Category"] === "Builder Score")
    .map((row) => ({
      name: String(row["Metric"]),
      value: Number(row["Count"]),
      percentage: Number(row["Percentage"]),
    }))
    .sort((a, b) => {
      const getLevel = (name: string) =>
        parseInt(name.match(/Level (\d+)/)?.[1] || "0");
      return getLevel(a.name) - getLevel(b.name);
    });

  const githubExpData = data
    .filter(
      (row) =>
        row["Category"] === "GitHub Experience" && row["Metric"] !== "No data"
    )
    .map((row) => {
      const yearLabel = row["Metric"] as string;
      return {
        name: yearLabel,
        value: Number(row["Count"]),
        percentage: Number(row["Percentage"]),
        years: yearLabel.includes("+")
          ? parseInt(yearLabel.split(" ")[0])
          : parseInt(yearLabel.split(" ")[0]),
      };
    })
    .sort((a, b) => a.years - b.years);

  const onchainExpData = data
    .filter(
      (row) =>
        row["Category"] === "Onchain Experience" &&
        row["Metric"] !== "No data" &&
        Number(row["Count"]) > 0
    )
    .map((row) => {
      const yearLabel = row["Metric"] as string;
      return {
        name: yearLabel,
        value: Number(row["Count"]),
        percentage: Number(row["Percentage"]),
        years: parseInt(yearLabel.split(" ")[0]),
      };
    })
    .sort((a, b) => a.years - b.years);

  const githubNoData = data.find(
    (row) =>
      row["Category"] === "GitHub Experience" && row["Metric"] === "No data"
  );
  const onchainNoData = data.find(
    (row) =>
      row["Category"] === "Onchain Experience" && row["Metric"] === "No data"
  );

  const githubNoDataCount = githubNoData ? Number(githubNoData["Count"]) : 0;
  const onchainNoDataCount = onchainNoData ? Number(onchainNoData["Count"]) : 0;

  const cardClass = `p-4 rounded-lg ${
    isDarkMode
      ? "bg-neutral-800 border border-neutral-800"
      : "bg-white border border-neutral-300"
  }`;
  const textColor = isDarkMode ? "text-white" : "text-neutral-900";
  const descColor = isDarkMode ? "text-neutral-400" : "text-neutral-500";

  return (
    <div className="flex flex-col gap-3">
      <div className={cardClass}>
        <div className="w-full relative">
          <div className="mb-4">
            <div className={`font-semibold mb-1 ${textColor}`}>
              Winners Profile: Builder Score
            </div>
            <div className={`text-xs ${descColor}`}>
              Distribution of winners by builder score level
            </div>
          </div>

          <div className={`flex flex-col md:flex-row items-center justify-center ${isSmallScreen ? "h-[380px]" : "h-[300px] "}`}>
            <div className="w-full h-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={builderScoreData}
                    cx="50%"
                    cy="50%"
                    outerRadius={isSmallScreen ? 110 : 130}
                    fill="#8884d8"
                    dataKey="value"
                    isAnimationActive={false}
                  >
                    {builderScoreData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={
                          CHART_COLORS.builderScore[
                            index % CHART_COLORS.builderScore.length
                          ]
                        }
                      />
                    ))}
                  </Pie>
                  <Legend
                    layout={isSmallScreen ? "horizontal" : "vertical"}
                    verticalAlign={isSmallScreen ? "bottom" : "middle"}
                    align={isSmallScreen ? "center" : "right"}
                    formatter={(value, entry, index) => (
                      <span
                        className={
                          isDarkMode ? "text-white" : "text-neutral-800"
                        }
                      >
                        {value} ({builderScoreData[index]?.value})
                      </span>
                    )}
                    wrapperStyle={{
                      fontSize: 11,
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      <div className={cardClass}>
        <div className="w-full relative">
          <div className="mb-4">
            <div className={`font-semibold mb-1 ${textColor}`}>
              Winners Profile: Years of Experience
            </div>
            <div className={`text-xs ${descColor}`}>
              Distribution of winners by years of experience (GitHub vs.
              Onchain)
            </div>
          </div>

          <div className="h-[300px]">
            <ResponsiveContainer width="95%" height="100%">
              <BarChart
                data={[
                  ...githubExpData.map((item) => ({
                    ...item,
                    githubValue: item.value,
                    onchainValue: 0,
                  })),
                  ...onchainExpData.map((item) => ({
                    ...item,
                    githubValue: 0,
                    onchainValue: item.value,
                  })),
                ]
                  .reduce((result, item) => {
                    const existingItem = result.find(
                      (r) => r.name === item.name
                    );
                    if (existingItem) {
                      existingItem.githubValue =
                        item.githubValue || existingItem.githubValue;
                      existingItem.onchainValue =
                        item.onchainValue || existingItem.onchainValue;
                    } else {
                      result.push(item);
                    }
                    return result;
                  }, [] as CombinedExperienceItem[])
                  .sort((a, b) => {
                    const getYears = (name: string) => {
                      if (name.includes("+"))
                        return parseInt(name.split(" ")[0]);
                      return parseInt(name.split(" ")[0]);
                    };
                    return getYears(a.name) - getYears(b.name);
                  })}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={isDarkMode ? "#444" : "#eee"}
                />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 12 }}
                  stroke={isDarkMode ? "#aaa" : "#666"}
                  dy={10}
                />
                <YAxis
                  tick={{ fontSize: 12 }}
                  stroke={isDarkMode ? "#aaa" : "#666"}
                />
                <Tooltip
                  formatter={(value, name) => {
                    if (name === "githubValue") return [value, "GitHub Users"];
                    if (name === "onchainValue")
                      return [value, "Onchain Users"];
                    return [value, name];
                  }}
                  contentStyle={{
                    backgroundColor: isDarkMode ? "#333" : "#fff",
                    color: isDarkMode ? "#fff" : "#333",
                    border: `1px solid ${isDarkMode ? "#555" : "#ddd"}`,
                    fontSize: 12,
                  }}
                  itemStyle={{
                    paddingTop: 6,
                    paddingBottom: 0,
                  }}
                />
                <Legend
                  formatter={(value) => {
                    if (value === "githubValue")
                      return `GitHub Experience${
                        githubNoDataCount > 0
                          ? ` (${githubNoDataCount} no data)`
                          : ""
                      }`;
                    if (value === "onchainValue")
                      return `Onchain Experience${
                        onchainNoDataCount > 0
                          ? ` (${onchainNoDataCount} no data)`
                          : ""
                      }`;
                    return value;
                  }}
                  wrapperStyle={{
                    fontSize: 11,
                    paddingTop: 15,
                  }}
                />
                <Bar
                  dataKey="githubValue"
                  name="githubValue"
                  fill={CHART_COLORS.experience.github}
                  isAnimationActive={false}
                />
                <Bar
                  dataKey="onchainValue"
                  name="onchainValue"
                  fill={CHART_COLORS.experience.onchain}
                  isAnimationActive={false}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
