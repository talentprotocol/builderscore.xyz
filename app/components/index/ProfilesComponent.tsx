"use client";

import ProfilesChart from "@/app/components/index/ProfilesChart";
import ProfilesChartComposer from "@/app/components/index/ProfilesChartComposer";
import ProfilesChartDateOptions from "@/app/components/index/ProfilesChartDateOptions";
import ProfilesTable from "@/app/components/index/ProfilesTable";
import { getProfilesTableColumns } from "@/app/components/index/ProfilesTableColumns";
import ProfilesTableFilters from "@/app/components/index/ProfilesTableFilters";
import ProfilesTableOptions from "@/app/components/index/ProfilesTableOptions";
import ProfilesTablePagination from "@/app/components/index/ProfilesTablePagination";
import { useChartData, useChartMetrics } from "@/app/hooks/useChartMetrics";
import {
  useSearchFields,
  useSearchProfiles,
} from "@/app/hooks/useSearchQueries";
import { COLUMN_ORDER, DEFAULT_SEARCH_QUERY } from "@/app/lib/constants";
import { calculateDateRange } from "@/app/lib/utils";
import { ChartSeries } from "@/app/types/index/chart";
import { ViewOption } from "@/app/types/index/data";
import { ProfilesComponentProps } from "@/app/types/index/profiles-component";
import {
  PaginationState,
  SortingState,
  Updater,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { RuleGroupType } from "react-querybuilder";

export function ProfilesComponent({
  config,
  debug,
}: ProfilesComponentProps & { debug?: boolean }) {
  const [query, setQuery] = useState<RuleGroupType>(
    config.query ?? DEFAULT_SEARCH_QUERY,
  );
  const [order, setOrder] = useState<"asc" | "desc">(config.order ?? "desc");
  const [showTools, setShowTools] = useState(false);

  const [pagination, setPagination] = useState<PaginationState>(
    config.pagination ?? {
      pageIndex: 0,
      pageSize: 10,
    },
  );

  const [sorting, setSorting] = useState<SortingState>(
    config.sorting ?? [{ id: "builder_score", desc: true }],
  );

  const [selectedView, setSelectedView] = useState<ViewOption>(
    config.selectedView ?? "table",
  );
  const [showPagination, setShowPagination] = useState(
    config.showPagination ?? true,
  );
  const [showTotal, setShowTotal] = useState(config.showTotal ?? true);
  const [columnOrder, setColumnOrder] = useState<string[]>(
    config.columnOrder ?? COLUMN_ORDER,
  );
  const [columnVisibility, setColumnVisibility] = useState<
    Record<string, boolean>
  >(
    config.columnVisibility ?? {
      row_number: false,
      builder: true,
      bio: true,
      location: true,
      builder_score: true,
      human_checkmark: true,
      tags: true,
    },
  );

  const [dateRange, setDateRange] = useState<string>(config.dateRange ?? "30d");
  const [dateInterval, setDateInterval] = useState<string>(
    config.dateInterval ?? "d",
  );
  const [series, setSeries] = useState<ChartSeries>(
    config.series ?? {
      left: [
        {
          key: "created_accounts",
          name: "talent_created_accounts",
          dataProvider: "Talent Protocol",
          color: "var(--chart-1)",
          type: "area",
          cumulative: true,
        },
      ],
      right: [],
    },
  );

  const { data: fields } = useSearchFields();
  const { data: availableDataPoints } = useChartMetrics();
  const { data: profilesData } = useSearchProfiles({
    query,
    order,
    page: pagination.pageIndex + 1,
    perPage: pagination.pageSize,
  });

  const { date_from, date_to } = calculateDateRange(dateRange);

  const chartData = useChartData({
    series: series,
    date_from,
    date_to,
    interval: dateInterval,
  });

  const handleSortingChange = (updaterOrValue: Updater<SortingState>) => {
    const newSorting =
      typeof updaterOrValue === "function"
        ? updaterOrValue(sorting)
        : updaterOrValue;

    setSorting(newSorting);

    const builderScoreSorting = newSorting.find(
      (sort) => sort.id === "builder_score",
    );
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
    setOrder(builderScoreSorting?.desc ? "desc" : "asc");
  };

  const handleColumnOrderChange = (updaterOrValue: Updater<string[]>) => {
    const newColumnOrder =
      typeof updaterOrValue === "function"
        ? updaterOrValue(columnOrder)
        : updaterOrValue;
    setColumnOrder(newColumnOrder);
  };

  const profiles = profilesData?.profiles || [];
  const totalProfiles = profilesData?.pagination.total || 0;

  const table = useReactTable({
    data: profiles,
    columns: useMemo(
      () =>
        getProfilesTableColumns(pagination.pageIndex + 1, pagination.pageSize),
      [pagination.pageIndex, pagination.pageSize],
    ),
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: true,
    rowCount: totalProfiles,
    state: {
      sorting,
      columnOrder,
      pagination,
      columnVisibility,
    },
    onSortingChange: handleSortingChange,
    onColumnOrderChange: handleColumnOrderChange,
    onPaginationChange: setPagination,
    onColumnVisibilityChange: setColumnVisibility,
  });

  return (
    <div className="flex flex-col gap-3">
      {debug && (
        <div className="flex flex-col gap-3">
          <div
            className="cursor-pointer border-1 border-red-500 text-xs"
            onClick={() => navigator.clipboard.writeText(JSON.stringify(query))}
          >
            Query: {JSON.stringify(query)}
          </div>
          {series.left.map((s, index) => (
            <div
              key={index}
              className="cursor-pointer border-1 border-red-500 text-xs"
              onClick={() => navigator.clipboard.writeText(JSON.stringify(s))}
            >
              Series Left #{index + 1}: {JSON.stringify(s)}
            </div>
          ))}
          {series.right.map((s, index) => (
            <div
              key={index}
              className="cursor-pointer border-1 border-red-500 text-xs"
              onClick={() => navigator.clipboard.writeText(JSON.stringify(s))}
            >
              Series Right #{index + 1}: {JSON.stringify(s)}
            </div>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between">
        {selectedView === "table" && showTools && (
          <ProfilesTableFilters
            fields={fields || []}
            query={query}
            setQuery={setQuery}
          />
        )}

        {selectedView === "chart" && showTools && (
          <div className="flex items-center gap-2">
            <ProfilesChartComposer
              series={series}
              setSeries={setSeries}
              availableDataPoints={availableDataPoints}
            />

            <ProfilesChartDateOptions
              dateRange={dateRange}
              onDateRangeChange={setDateRange}
              dateInterval={dateInterval}
              onDateIntervalChange={setDateInterval}
            />
          </div>
        )}

        {showTools && (
          <ProfilesTableOptions
            table={table}
            selectedView={selectedView}
            setSelectedView={setSelectedView}
            showPagination={showPagination}
            setShowPagination={setShowPagination}
            showTotal={showTotal}
            setShowTotal={setShowTotal}
            columnOrder={columnOrder}
            onColumnOrderChange={handleColumnOrderChange}
            showColumnsOptions={selectedView === "table"}
          />
        )}
      </div>

      <div className="relative">
        {selectedView === "table" && (
          <ProfilesTable
            table={table}
            title={config.title}
            description={config.description}
            showTools={showTools}
            setShowTools={setShowTools}
          />
        )}

        {selectedView === "chart" && (
          <ProfilesChart
            data={chartData}
            series={series}
            title={config.title}
            description={config.description}
            showTools={showTools}
            setShowTools={setShowTools}
          />
        )}
      </div>

      {selectedView === "table" && (
        <ProfilesTablePagination
          table={table}
          totalProfiles={totalProfiles}
          showPagination={showPagination}
          showTotal={showTotal}
        />
      )}
    </div>
  );
}
