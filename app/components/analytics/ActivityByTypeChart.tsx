"use client";

import { CSVRow } from "@/app/lib/csv-parser";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { formatDate } from "@/app/lib/csv-parser";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useTheme } from "@/app/context/ThemeContext";

interface ActivityByTypeChartProps {
  data: CSVRow[];
}

export default function ActivityByTypeChart({ data }: ActivityByTypeChartProps) {
  const { isDarkMode } = useTheme();

  const chartData = data.map(row => {
    const dateStr = row["Week Start Date (Monday)"] as string;
    return {
      date: formatDate(dateStr),
      githubDevs: Number(row["Devs with GitHub Activity"]),
      githubRepos: Number(row["Total GitHub Repos"]),
      contractDevs: Number(row["Devs with Base Contract Activity"]),
      totalContracts: Number(row["Total Base Contracts"])
    };
  });

  const latestData = data[data.length - 1];
  
  const cardBg = isDarkMode ? "bg-neutral-800" : "bg-white";
  const textColor = isDarkMode ? "text-white" : "text-neutral-800";
  const descColor = isDarkMode ? "text-neutral-400" : "text-neutral-500";

  return (
    <Card className={`${cardBg} border-0`}>
      <CardHeader className="pb-2">
        <CardTitle className={textColor}>Builder Activity by Type</CardTitle>
        <CardDescription className={descColor}>
          <div className="flex flex-col space-y-1">
            <span>Weekly GitHub and Base Contract activity metrics</span>
            <div className="text-sm mt-2">
              <span>Latest week: {latestData ? formatDate(latestData["Week Start Date (Monday)"] as string) : "N/A"}</span>
            </div>
          </div>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{
                top: 20,
                right: 30,
                left: 10,
                bottom: 0,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? "#444" : "#eee"} />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12 }} 
                stroke={isDarkMode ? "#aaa" : "#666"}
              />
              <YAxis 
                yAxisId="left" 
                domain={[0, 'auto']} 
                tick={{ fontSize: 12 }} 
                stroke={isDarkMode ? "#aaa" : "#666"}
              />
              <YAxis 
                yAxisId="right" 
                orientation="right" 
                domain={[0, 'auto']} 
                tick={{ fontSize: 12 }} 
                stroke={isDarkMode ? "#aaa" : "#666"}
              />
              <Tooltip
                contentStyle={{ 
                  backgroundColor: isDarkMode ? "#333" : "#fff",
                  color: isDarkMode ? "#fff" : "#333",
                  border: `1px solid ${isDarkMode ? "#555" : "#ddd"}`
                }}
                formatter={(value, name) => {
                  switch (name) {
                    case "githubDevs":
                      return [value, "GitHub Developers"];
                    case "githubRepos":
                      return [value, "GitHub Repositories"];
                    case "contractDevs":
                      return [value, "Contract Developers"];
                    case "totalContracts":
                      return [value, "Base Contracts"];
                    default:
                      return [value, name];
                  }
                }}
              />
              <Legend />
              <Line 
                yAxisId="left" 
                type="monotone" 
                dataKey="githubDevs" 
                stroke="#8884d8" 
                activeDot={{ r: 6 }} 
                name="Devs with GitHub Activity"
                strokeWidth={2}
              />
              <Line 
                yAxisId="right" 
                type="monotone" 
                dataKey="githubRepos" 
                stroke="#82ca9d" 
                name="Total GitHub Repos"
                strokeWidth={2}
              />
              <Line 
                yAxisId="left" 
                type="monotone" 
                dataKey="contractDevs" 
                stroke="#ffc658" 
                name="Devs with Base Contract Activity"
                strokeWidth={2}
              />
              <Line 
                yAxisId="right" 
                type="monotone" 
                dataKey="totalContracts" 
                stroke="#ff7300" 
                name="Total Base Contracts"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
} 