"use client";

import { CSVRow } from "@/app/lib/csv-parser";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { formatDate } from "@/app/lib/csv-parser";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useTheme } from "@/app/context/ThemeContext";

interface DailyActivityChartProps {
  data: CSVRow[];
}

export default function DailyActivityChart({ data }: DailyActivityChartProps) {
  const { isDarkMode } = useTheme();

  // Filter out rows with 0 values (empty days)
  const filteredData = data.filter(row => 
    Number(row["New Eligible Devs"]) > 0 || 
    Number(row["Active Devs"]) > 0
  );

  const chartData = filteredData.map(row => {
    const dateStr = row["Date"] as string;
    return {
      date: formatDate(dateStr),
      newEligibleDevs: Number(row["New Eligible Devs"]),
      activeDevs: Number(row["Active Devs"]),
      activationRate: Number(row["Activation Rate (%)"])
    };
  });

  const latestData = filteredData[filteredData.length - 1];

  const cardBg = isDarkMode ? "bg-neutral-800" : "bg-white";
  const textColor = isDarkMode ? "text-white" : "text-neutral-800";
  const descColor = isDarkMode ? "text-neutral-400" : "text-neutral-500";

  return (
    <Card className={`${cardBg} border-0`}>
      <CardHeader className="pb-2">
        <CardTitle className={textColor}>Daily Builder Activity</CardTitle>
        <CardDescription className={descColor}>
          <div className="flex flex-col space-y-1">
            <span>Daily new eligible developers, active developers, and activation rate</span>
            <div className="text-sm mt-2">
              <span>Latest values: {latestData ? formatDate(latestData["Date"] as string) : "N/A"}</span>
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
                  if (name === "activationRate") {
                    return [`${typeof value === 'number' ? value.toFixed(2) : value}%`, "Activation Rate"];
                  } else if (name === "newEligibleDevs") {
                    return [value, "New Eligible Devs"];
                  }
                  return [value, "Active Devs"];
                }}
              />
              <Legend />
              <Line 
                yAxisId="right" 
                type="monotone" 
                dataKey="activationRate" 
                stroke="#8884d8" 
                activeDot={{ r: 6 }} 
                name="Activation Rate %" 
                strokeWidth={2}
              />
              <Line 
                yAxisId="left" 
                type="monotone" 
                dataKey="newEligibleDevs" 
                stroke="#82ca9d" 
                name="New Eligible Devs" 
                strokeWidth={2}
              />
              <Line 
                yAxisId="left" 
                type="monotone" 
                dataKey="activeDevs" 
                stroke="#ffc658" 
                name="Active Devs" 
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
} 