"use client";

import ProfilesChart from "@/app/components/index/ProfilesChart";
import ProfilesChartComposer from "@/app/components/index/ProfilesChartComposer";
import ProfilesChartDateOptions from "@/app/components/index/ProfilesChartDateOptions";
import { getProfilesTableColumns } from "@/app/components/index/ProfilesTableColumns";
import ProfilesTableFilters from "@/app/components/index/ProfilesTableFilters";
import ProfilesTableOptions from "@/app/components/index/ProfilesTableOptions";
import TablePagination from "@/app/components/index/ProfilesTablePagination";
import ProfilesTableSkeleton from "@/app/components/index/ProfilesTableSkeleton";
import { DataTable } from "@/app/components/ui/data-table";
import { useChartData, useChartMetrics } from "@/app/hooks/useChartMetrics";
import {
  useSearchFields,
  useSearchProfiles,
} from "@/app/hooks/useSearchQueries";
import { calculateDateRange } from "@/app/lib/utils";
import { ChartSeries } from "@/app/types/index/chart";
import { ViewOption } from "@/app/types/index/data";
import { TalentProfileSearchApi } from "@/app/types/talent";
import {
  SortingState,
  Table,
  Updater,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import Image from "next/image";
import { Suspense } from "react";
import { useEffect, useMemo, useState } from "react";
import { RuleGroupType } from "react-querybuilder";

function TableContent({
  query,
  order,
  page,
  perPage,
  table,
  onDataChange,
}: {
  query: RuleGroupType;
  order: "asc" | "desc";
  page: number;
  perPage: number;
  table: Table<TalentProfileSearchApi>;
  onDataChange: (data: {
    profiles: TalentProfileSearchApi[];
    total: number;
    totalPages: number;
  }) => void;
}) {
  const { data: profilesData } = useSearchProfiles({
    query,
    order,
    page,
    perPage,
  });

  useEffect(() => {
    onDataChange({
      profiles: profilesData?.profiles || [],
      total: profilesData?.pagination.total || 0,
      totalPages: profilesData?.pagination.last_page || 0,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profilesData]);

  return <DataTable table={table} />;
}

export function ProfilesTable({
  initialQuery,
}: {
  initialQuery: RuleGroupType;
}) {
  const [query, setQuery] = useState(initialQuery);
  const [order, setOrder] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [totalProfiles, setTotalProfiles] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [profiles, setProfiles] = useState<TalentProfileSearchApi[]>([]);
  const [currentProfilesPage, setCurrentProfilesPage] = useState(1);
  const [currentProfilesPerPage, setCurrentProfilesPerPage] = useState(10);
  const [sorting, setSorting] = useState<SortingState>([
    { id: "builder_score", desc: true },
  ]);
  const [selectedView, setSelectedView] = useState<ViewOption>("table");
  const [showPagination, setShowPagination] = useState(true);
  const [showTotal, setShowTotal] = useState(true);
  const [columnOrder, setColumnOrder] = useState<string[]>([
    "row_number",
    "builder",
    "bio",
    "location",
    "builder_score",
    "human_checkmark",
    "tags",
  ]);
  const [dateRange, setDateRange] = useState<string>("30d");
  const [dateInterval, setDateInterval] = useState<string>("d");
  const [series, setSeries] = useState<ChartSeries>({
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
  });

  const { data: fields } = useSearchFields();
  const { data: availableDataPoints } = useChartMetrics();

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
    setPage(1);
    setOrder(builderScoreSorting?.desc ? "desc" : "asc");
  };

  const handleColumnOrderChange = (updaterOrValue: Updater<string[]>) => {
    const newColumnOrder =
      typeof updaterOrValue === "function"
        ? updaterOrValue(columnOrder)
        : updaterOrValue;
    setColumnOrder(newColumnOrder);
  };

  const handleDataChange = ({
    profiles,
    total,
    totalPages,
  }: {
    profiles: TalentProfileSearchApi[];
    total: number;
    totalPages: number;
  }) => {
    setProfiles(profiles);
    setTotalProfiles(total);
    setTotalPages(totalPages);
    setCurrentProfilesPage(page);
    setCurrentProfilesPerPage(perPage);
  };

  const table = useReactTable({
    data: profiles,
    columns: useMemo(
      () => getProfilesTableColumns(page, perPage),
      [page, perPage],
    ),
    getCoreRowModel: getCoreRowModel(),
    state: {
      sorting,
      columnOrder,
    },
    onSortingChange: handleSortingChange,
    onColumnOrderChange: handleColumnOrderChange,
  });

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        {selectedView === "table" && (
          <ProfilesTableFilters
            fields={fields || []}
            query={query}
            setQuery={setQuery}
          />
        )}

        {selectedView === "chart" && (
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
      </div>

      <Suspense
        fallback={
          <ProfilesTableSkeleton
            originalProfiles={profiles}
            originalSorting={sorting}
            page={currentProfilesPage}
            perPage={currentProfilesPerPage}
            columnOrder={columnOrder}
          />
        }
      >
        <div className="relative">
          <div className="card-style-background absolute top-0 left-0 z-0 flex h-full w-full items-center justify-center">
            <Image
              src="/images/talent-protocol-logo.png"
              alt="Talent Protocol"
              width={1402}
              height={212}
              className="h-12 w-auto opacity-10"
            />
          </div>

          {selectedView === "table" && (
            <TableContent
              query={query}
              order={order}
              page={page}
              perPage={perPage}
              table={table}
              onDataChange={handleDataChange}
            />
          )}

          {selectedView === "chart" && (
            <ProfilesChart data={chartData} series={series} />
          )}
        </div>
      </Suspense>

      {selectedView === "table" && (
        <TablePagination
          total={totalProfiles}
          perPage={perPage}
          setPerPage={setPerPage}
          page={page}
          setPage={setPage}
          totalPages={totalPages}
          showPagination={showPagination}
          showTotal={showTotal}
        />
      )}
    </div>
  );
}
