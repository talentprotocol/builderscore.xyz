"use client";

import { CSVRow } from "@/app/lib/csv-parser";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { formatDate } from "@/app/lib/csv-parser";
import { Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Bar, ComposedChart } from 'recharts';
import { useTheme } from "@/app/context/ThemeContext";

interface RetentionRateChartProps {
  data: CSVRow[];
}

export default function RetentionRateChart({ data }: RetentionRateChartProps) {
  const { isDarkMode } = useTheme();

  const chartData = data.map(row => {
    const dateStr = row["Week Start Date"] as string;
    return {
      date: formatDate(dateStr),
      activeDevs: Number(row["Total Active Devs"]),
      inactiveDevs: Number(row["Total Inactive Devs"]),
      retentionRate: Number(row["Retention Rate (%)"])
    };
  });

  const latestData = data[data.length - 1];
  
  const cardBg = isDarkMode ? "bg-neutral-800" : "bg-white";
  const textColor = isDarkMode ? "text-white" : "text-neutral-800";
  const descColor = isDarkMode ? "text-neutral-400" : "text-neutral-500";

  // Calculate the latest retention rate
  const latestRetentionRate = chartData.length > 0 ? 
    chartData[chartData.length - 1].retentionRate : 0;

  return (
    <Card className={`${cardBg} border-0`}>
      <CardHeader className="pb-2">
        <CardTitle className={textColor}>Builder Rewards Retention</CardTitle>
        <CardDescription className={descColor}>
          <div className="flex flex-col space-y-1">
            <span>Weekly active/inactive developers and retention rate</span>
            <div className="text-sm mt-2 flex flex-wrap gap-4">
              <span>Latest week: {latestData ? formatDate(latestData["Week Start Date"] as string) : "N/A"}</span>
              <span>Active developers: {latestData ? Number(latestData["Total Active Devs"]).toLocaleString() : "N/A"}</span>
              <span>Retention rate: {latestRetentionRate.toFixed(2)}%</span>
            </div>
          </div>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
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
                domain={[0, 100]}
                tickFormatter={(value) => `${value}%`}
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
                  if (name === "retentionRate") {
                    return [`${typeof value === 'number' ? value.toFixed(2) : value}%`, "Retention Rate"];
                  } else if (name === "activeDevs") {
                    return [value, "Active Developers"];
                  } else {
                    return [value, "Inactive Developers"];
                  }
                }}
              />
              <Legend />
              <Bar 
                yAxisId="left" 
                dataKey="activeDevs" 
                stackId="a" 
                fill="#82ca9d" 
                name="Active Developers" 
              />
              <Bar 
                yAxisId="left" 
                dataKey="inactiveDevs" 
                stackId="a" 
                fill="#ff8042" 
                name="Inactive Developers" 
              />
              <Line 
                yAxisId="right" 
                type="monotone" 
                dataKey="retentionRate" 
                stroke="#8884d8" 
                strokeWidth={2}
                name="Retention Rate %" 
                dot={{ r: 5 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
} 