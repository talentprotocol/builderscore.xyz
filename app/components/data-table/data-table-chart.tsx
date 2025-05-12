"use client";

import { cn } from "@/app/lib/utils";
import { StatsDataPoint } from "@/app/types/stats";
import * as React from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface DataTableChartProps extends React.ComponentProps<"div"> {
  chartData?: Record<string, StatsDataPoint[]>;
  error?: Error | null;
}

// Define a type for the formatted chart data
interface FormattedDataPoint {
  date: string;
  [metric: string]: string | number | null;
}

export function DataTableChart({
  chartData = {},
  error,
  className,
  ...props
}: DataTableChartProps) {
  // Format data for Recharts
  const formatChartData = React.useMemo(() => {
    if (!chartData || Object.keys(chartData).length === 0) return [];

    // Get all unique dates across all metrics
    const allDates = new Set<string>();
    Object.values(chartData).forEach((points) => {
      points.forEach((point) => {
        allDates.add(new Date(point.date).toLocaleDateString());
      });
    });

    // Create data points for each date with all metrics
    const formattedData: FormattedDataPoint[] = Array.from(allDates).map(
      (date) => {
        const dataPoint: FormattedDataPoint = { date };

        Object.entries(chartData).forEach(([metric, points]) => {
          const point = points.find(
            (p) => new Date(p.date).toLocaleDateString() === date,
          );
          dataPoint[metric] = point ? point.count : null;
        });

        return dataPoint;
      },
    );

    // Sort by date
    return formattedData.sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return dateA.getTime() - dateB.getTime();
    });
  }, [chartData]);

  // Generate random colors for each metric
  const getLineColor = (index: number) => {
    const colors = [
      "#8884d8",
      "#82ca9d",
      "#ffc658",
      "#ff8042",
      "#0088fe",
      "#00C49F",
      "#FFBB28",
      "#FF8042",
      "#a4de6c",
      "#d0ed57",
    ];
    return colors[index % colors.length];
  };

  return (
    <div
      className={cn(
        "card-style text-muted-foreground flex h-[400px] w-full flex-col items-center justify-center rounded-md p-6",
        className,
      )}
      {...props}
    >
      {error ? (
        <div className="flex flex-col items-center gap-4 text-red-500">
          <p>Error loading chart data:</p>
          <p className="text-sm">{error.message}</p>
        </div>
      ) : Object.keys(chartData).length > 0 ? (
        <div className="flex w-full flex-col items-center gap-4">
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={formatChartData}
                margin={{ top: 5, right: 30, left: 20, bottom: 25 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                {Object.keys(chartData).map((metric, index) => (
                  <YAxis
                    key={`y-axis-${metric}`}
                    yAxisId={metric}
                    orientation={index % 2 === 0 ? "left" : "right"}
                    stroke={getLineColor(index)}
                    tickCount={5}
                    domain={["auto", "auto"]}
                    allowDataOverflow={false}
                    label={{
                      value: metric,
                      angle: index % 2 === 0 ? -90 : 90,
                      position: "insideLeft",
                    }}
                  />
                ))}
                <Tooltip />
                <Legend />
                {Object.keys(chartData).map((metric, index) => (
                  <Line
                    key={metric}
                    type="monotone"
                    dataKey={metric}
                    yAxisId={metric}
                    stroke={getLineColor(index)}
                    activeDot={{ r: 8 }}
                    connectNulls
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      ) : (
        <p>No chart data available</p>
      )}
    </div>
  );
}
