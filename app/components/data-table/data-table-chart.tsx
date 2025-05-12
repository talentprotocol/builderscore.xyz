"use client";

import { cn } from "@/app/lib/utils";
import { StatsDataPoint } from "@/app/types/stats";
import * as React from "react";

interface DataTableChartProps extends React.ComponentProps<"div"> {
  chartData?: Record<string, StatsDataPoint[]>;
  error?: Error | null;
}

export function DataTableChart({
  chartData = {},
  error,
  className,
  ...props
}: DataTableChartProps) {
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
          <h3 className="text-lg font-medium">Chart Data</h3>

          <div className="mt-4 w-full overflow-auto">
            <div className="max-h-[300px] overflow-auto rounded border p-2">
              {Object.entries(chartData).map(([metric, dataPoints]) => (
                <div key={metric} className="mb-4">
                  <h4 className="mb-1 text-sm font-medium">{metric}</h4>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                    {dataPoints.slice(0, 10).map((point, idx) => (
                      <React.Fragment key={idx}>
                        <div>{new Date(point.date).toLocaleDateString()}</div>
                        <div>{point.value}</div>
                      </React.Fragment>
                    ))}
                    {dataPoints.length > 10 && (
                      <div className="col-span-2 mt-1 text-center">
                        ...and {dataPoints.length - 10} more data points
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <p className="mt-4 text-xs opacity-70">
            Chart visualization coming soon
          </p>
        </div>
      ) : (
        <p>No chart data available</p>
      )}
    </div>
  );
}
