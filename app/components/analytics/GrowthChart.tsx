"use client";

import { CSVRow } from "@/app/lib/csv-parser";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { formatDate } from "@/app/lib/utils";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface GrowthChartProps {
  data: CSVRow[];
}

export default function GrowthChart({ data }: GrowthChartProps) {
  const chartData = data.map(row => {
    const dateStr = row["Reward End Date"] as string;
    return {
      date: formatDate(dateStr),
      netGrowth: row["Net Growth"],
      current: row["Current Eligible Builders"],
      previous: row["Previous Eligible Builders"]
    };
  });
  
  // Get the latest data point
  const latestData = data[data.length - 1];

  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Growth in Eligible Developers</CardTitle>
        <CardDescription>
          <div className="flex flex-col space-y-1">
            <span>Net increase in developers meeting all eligibility criteria</span>
            <div className="text-sm mt-2">
              <span>Current eligible developers: {latestData["Current Eligible Builders"]}</span>
            </div>
          </div>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{
                top: 20,
                right: 0,
                left: 0,
                bottom: 0,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" domain={[0, 'dataMax']} />
              <Tooltip
                formatter={(value, name) => {
                  if (name === "netGrowth") {
                    return [value, "Net Growth"];
                  }
                  if (name === "current") {
                    return [value, "Current Eligible Developers"];
                  }
                  return [value, "Previous Day Developers"];
                }}
              />
              <Legend />
              <Line yAxisId="left" type="monotone" dataKey="netGrowth" stroke="#8884d8" activeDot={{ r: 8 }} name="Net Growth" />
              <Line yAxisId="right" type="monotone" dataKey="current" stroke="#82ca9d" name="Total Eligible Developers" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
} 