"use client";

import { cn } from "@/app/lib/utils";
import * as React from "react";

interface ChartDataPoint {
  id: string;
  dataIssuer: string;
  dataPoint: string;
  dateRange: {
    from: Date | undefined;
    to: Date | undefined;
  };
}

interface DataTableChartProps extends React.ComponentProps<"div"> {
  datapoints: ChartDataPoint[];
}

export function DataTableChart({
  datapoints,
  className,
  ...props
}: DataTableChartProps) {
  return (
    <div
      className={cn(
        "card-style text-muted-foreground flex h-[400px] w-full items-center justify-center rounded-md p-6",
        className,
      )}
      {...props}
    >
      {datapoints.length > 0 ? (
        <div className="flex flex-col items-center gap-4">
          <p>Chart visualization for selected data points:</p>
          <div className="flex flex-wrap justify-center gap-2">
            {datapoints.map((datapoint: ChartDataPoint) => (
              <div
                key={datapoint.id}
                className="bg-muted rounded-md px-3 py-1.5 text-sm"
              >
                <div className="font-medium">{datapoint.dataPoint}</div>
                <div className="text-muted-foreground text-xs">
                  {datapoint.dataIssuer} •
                  {datapoint.dateRange.from && datapoint.dateRange.to ? (
                    <span>
                      {" "}
                      {new Date(
                        datapoint.dateRange.from,
                      ).toLocaleDateString()}{" "}
                      - {new Date(datapoint.dateRange.to).toLocaleDateString()}
                    </span>
                  ) : (
                    <span> No date range</span>
                  )}
                </div>
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs opacity-70">
            Chart implementation coming soon
          </p>
        </div>
      ) : (
        <p>Select data points to visualize</p>
      )}
    </div>
  );
}
