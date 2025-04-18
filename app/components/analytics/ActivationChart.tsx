"use client";

import { CSVRow } from "@/app/lib/csv-parser";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { formatDate } from "@/app/lib/utils";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface ActivationChartProps {
  data: CSVRow[];
}

export default function ActivationChart({ data }: ActivationChartProps) {
  const chartData = data.map(row => {
    const dateStr = row["Reward End Date"] as string;
    return {
      date: formatDate(dateStr),
      activationRate: row["Activation Rate (%)"],
      eligible: row["Eligible Builders"],
      active: row["Builders with Activity (Score > 0)"]
    };
  });

  const latestData = data[data.length - 1];

  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Developer Activation Rate</CardTitle>
        <CardDescription>
          <div className="flex flex-col space-y-1">
            <span>Percentage of eligible developers with building activity on Base (Rewards Score &gt; 0)</span>
            <div className="text-sm mt-2">
              <span>Total eligible developers: {latestData["Eligible Builders"]}</span>
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
                  if (name === "activationRate") {
                    return [`${typeof value === 'number' ? value.toFixed(2) : value}%`, "Activation Rate"];
                  }
                  return [value, name === "eligible" ? "Eligible Developers" : "Active Developers"];
                }}
              />
              <Legend />
              <Line yAxisId="left" type="monotone" dataKey="activationRate" stroke="#8884d8" activeDot={{ r: 8 }} name="Activation Rate %" />
              <Line yAxisId="right" type="monotone" dataKey="eligible" stroke="#82ca9d" name="Total Eligible Developers" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
} 