"use client";

import { CSVRow } from "@/app/lib/csv-parser";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { formatDate } from "@/app/lib/csv-parser";
import { Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Line, ComposedChart } from 'recharts';

interface DeveloperActivityChartProps {
  data: CSVRow[];
}

export default function DeveloperActivityChart({ data }: DeveloperActivityChartProps) {
  // Get the latest data point for the stats
  const latestData = data[data.length - 1];
  
  const chartData = data.map(row => {
    const dateStr = row["Reward End Date"] as string;
    return {
      date: formatDate(dateStr),
      gitHubActivity: row["Builders with GitHub Activity"],
      baseContractActivity: row["Builders with Base Contract Activity"],
      eligibleBuilders: row["Eligible Builders"]
    };
  });

  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Developer Activity Types</CardTitle>
        <CardDescription>
          <div className="flex flex-col space-y-1">
            <span>Number of developers with verified activity by type</span>
            <div className="text-sm mt-2 flex flex-col space-y-1">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-[#8884d8] rounded-full mr-2"></div>
                <span>GitHub contributions: {latestData["Builders with GitHub Activity"]}</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-[#82ca9d] rounded-full mr-2"></div>
                <span>Base contract activity: {latestData["Builders with Base Contract Activity"]}</span>
              </div>
              <div className="flex items-center mt-2">
                <div className="w-3 h-3 bg-[#ff7300] rounded-full mr-2"></div>
                <span>Total eligible developers: {latestData["Eligible Builders"]}</span>
              </div>
            </div>
          </div>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
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
                  if (name === "gitHubActivity") {
                    return [value, "GitHub Contributions"];
                  }
                  if (name === "baseContractActivity") {
                    return [value, "Base Contract Activity"];
                  }
                  if (name === "eligibleBuilders") {
                    return [value, "Total Eligible Developers"];
                  }
                  return [value, "Eligible Developers"];
                }}
              />
              <Legend />
              <Bar yAxisId="left" dataKey="gitHubActivity" fill="#8884d8" name="GitHub Contributions" />
              <Bar yAxisId="left" dataKey="baseContractActivity" fill="#82ca9d" name="Base Contract Activity" />
              <Line yAxisId="right" type="monotone" dataKey="eligibleBuilders" stroke="#ff7300" name="Total Eligible Developers" />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
} 