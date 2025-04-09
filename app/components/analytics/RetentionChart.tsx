"use client";

import { CSVRow } from "@/app/lib/csv-parser";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { formatDate } from "@/app/lib/csv-parser";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface RetentionChartProps {
  data: CSVRow[];
}

export default function RetentionChart({ data }: RetentionChartProps) {
  const chartData = data.map(row => {
    const dateStr = row["Reward End Date"] as string;
    return {
      date: formatDate(dateStr),
      retentionRate: row["Retention Rate (%)"],
      newUsers: row["New Builders"],
      leavingUsers: row["Leaving Builders"],
      retained: row["Retained Builders"],
      current: row["Current Builders"]
    };
  });
  
  const latestData = data[data.length - 1];

  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Developer Retention</CardTitle>
        <CardDescription>
          <div className="flex flex-col space-y-1">
            <span>Percentage of developers from previous day who remain active</span>
            <div className="text-sm mt-2">
              <span>Total eligible developers: {latestData["Current Builders"]}</span>
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
              }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis yAxisId="left" domain={[95, 100]} />
              <YAxis yAxisId="right" orientation="right" domain={[0, 'dataMax']} />
              <Tooltip
                formatter={(value, name) => {
                  if (name === "retentionRate") {
                    return [`${typeof value === 'number' ? value.toFixed(2) : value}%`, "Retention Rate"];
                  }
                  if (name === "current") {
                    return [value, "Total Eligible Developers"];
                  }
                  return [value, name === "newUsers" ? "New Developers" : 
                         name === "leavingUsers" ? "Developers Leaving" : "Retained Developers"];
                }}
              />
              <Legend />
              <Line yAxisId="right" type="monotone" dataKey="newUsers" stroke="#82ca9d" name="New Developers" />
              <Line yAxisId="right" type="monotone" dataKey="leavingUsers" stroke="#ff7300" name="Developers Leaving" />
              <Line yAxisId="left" type="monotone" dataKey="retentionRate" stroke="#8884d8" name="Retention Rate %" />
              <Line yAxisId="right" type="monotone" dataKey="current" stroke="#00bcd4" name="Total Eligible Developers" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
} 