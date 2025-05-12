"use client";

import { DataTable } from "@/app/components/data-table/data-table";
import { DataTableChart } from "@/app/components/data-table/data-table-chart";
import { VIEW_MODE_KEY, viewModeParser } from "@/app/lib/data-table/parsers";
import { StatsDataPoint } from "@/app/types/stats";
import { type Table as TanstackTable } from "@tanstack/react-table";
import { useQueryState } from "nuqs";
import * as React from "react";

interface DataTableWrapperProps<TData> extends React.ComponentProps<"div"> {
  table: TanstackTable<TData>;
  chartData: Record<string, StatsDataPoint[]>;
  toolbar?: React.ReactNode;
  actionBar?: React.ReactNode;
  className?: string;
}

export function DataTableWrapper<TData>({
  table,
  chartData,
  toolbar,
  actionBar,
  className,
  ...props
}: DataTableWrapperProps<TData>) {
  const [viewMode] = useQueryState(
    VIEW_MODE_KEY,
    viewModeParser.withDefault("table"),
  );

  const renderContent = () => {
    switch (viewMode) {
      case "chart":
        return <DataTableChart chartData={chartData} />;

      case "table":
      default:
        return (
          <DataTable
            table={table}
            actionBar={actionBar}
            className={className}
          />
        );
    }
  };

  return (
    <div className="flex w-full flex-col gap-2.5" {...props}>
      {toolbar}
      {renderContent()}
    </div>
  );
}
