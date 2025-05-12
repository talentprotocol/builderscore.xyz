"use client";

import { DataTableAdvancedToolbar } from "@/app/components/data-table/data-table-advanced-toolbar";
import { DataTableChartSelector } from "@/app/components/data-table/data-table-chart-selector";
import { DataTableFilterList } from "@/app/components/data-table/data-table-filter-list";
import { DataTableSortList } from "@/app/components/data-table/data-table-sort-list";
import { DataTableWrapper } from "@/app/components/data-table/data-table-wrapper";
import { getProfilesTableColumns } from "@/app/components/index/ProfilesTableColumns";
import { useChartData } from "@/app/hooks/useChartData";
import { useDataTable } from "@/app/hooks/useDataTable";
import type { SearchDataResponse } from "@/app/types/index/search";
import type { StatsDataPoint } from "@/app/types/stats";
import * as React from "react";
import { useMemo } from "react";

interface ProfilesTableProps {
  initialData: SearchDataResponse;
  dailyStats: Record<string, StatsDataPoint[]>;
}

export function ProfilesTable({ initialData, dailyStats }: ProfilesTableProps) {
  const columns = useMemo(() => getProfilesTableColumns(), []);

  const { table, shallow, debounceMs, throttleMs } = useDataTable({
    data: initialData.profiles,
    columns,
    pageCount: initialData.pagination.last_page,
    enableAdvancedFilter: true,
    initialState: {
      sorting: [{ id: "builder_score", desc: true }],
      columnPinning: { right: ["actions"] },
    },
    getRowId: (originalRow) => originalRow.id,
    shallow: false,
    clearOnDefault: true,
  });

  const chartData = useChartData({
    initialData: dailyStats,
    datapoints: [],
  });

  const toolbar = (
    <DataTableAdvancedToolbar table={table}>
      <DataTableFilterList
        table={table}
        shallow={shallow}
        debounceMs={debounceMs}
        throttleMs={throttleMs}
        align="start"
      />
      <DataTableSortList table={table} align="start" />
      <DataTableChartSelector
        shallow={shallow}
        throttleMs={throttleMs}
        align="start"
      />
    </DataTableAdvancedToolbar>
  );

  return (
    <DataTableWrapper
      table={table}
      chartData={chartData.chartData}
      toolbar={toolbar}
    />
  );
}
