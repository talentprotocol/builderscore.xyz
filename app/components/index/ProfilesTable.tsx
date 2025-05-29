"use client";

import ProfilesChart from "@/app/components/index/ProfilesChart";
import ProfilesChartComposer from "@/app/components/index/ProfilesChartComposer";
import { getProfilesTableColumns } from "@/app/components/index/ProfilesTableColumns";
import ProfilesTableFilters from "@/app/components/index/ProfilesTableFilters";
import ProfilesTableOptions from "@/app/components/index/ProfilesTableOptions";
import TablePagination from "@/app/components/index/ProfilesTablePagination";
import ProfilesTableSkeleton from "@/app/components/index/ProfilesTableSkeleton";
import { DataTable } from "@/app/components/ui/data-table";
import {
  useSearchFields,
  useSearchProfiles,
} from "@/app/hooks/useSearchQueries";
import { formatChartDate } from "@/app/lib/utils";
import { ChartSeries, ProfilesData } from "@/app/types/index/chart";
import { ViewOption } from "@/app/types/index/data";
import { TalentProfileSearchApi } from "@/app/types/talent";
import {
  SortingState,
  Table,
  Updater,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Suspense } from "react";
import { useEffect, useMemo, useState } from "react";
import { Field, RuleGroupType } from "react-querybuilder";

function TableContent({
  query,
  fields,
  order,
  page,
  perPage,
  table,
  onDataChange,
}: {
  query: RuleGroupType;
  fields: Field[];
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
    fields,
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
    "location",
    "builder_score",
    "human_checkmark",
    "tags",
    "credentials",
  ]);
  const [series, setSeries] = useState<ChartSeries>({
    left: [
      {
        key: "ens",
        name: "ENS Domains",
        color: "var(--chart-1)",
        type: "stacked-column",
      },
      {
        key: "farcaster",
        name: "Farcaster Accounts",
        color: "var(--chart-2)",
        type: "stacked-column",
      },
    ],
    right: [
      {
        key: "base_basename",
        name: "Base Basename",
        color: "var(--chart-3)",
        type: "area",
      },
      {
        key: "farcaster123",
        name: "Farcaster Accounts 123",
        color: "var(--chart-2)",
        type: "stacked-column",
      },
    ],
  });

  // Mock available data points - this will come from an API endpoint
  const availableDataPoints = [
    { data_provider: "Base", name: "base_account_age", uom: "years" },
    { data_provider: "Base", name: "base_basecamp", uom: "attendances" },
    { data_provider: "Base", name: "base_basename", uom: "names" },
    { data_provider: "Base", name: "base_builder_rewards_eth", uom: "eth" },
    { data_provider: "ENS", name: "ens", uom: "domains" },
    { data_provider: "Farcaster", name: "farcaster", uom: "accounts" },
    {
      data_provider: "GitHub",
      name: "github_contributions",
      uom: "contributions",
    },
    { data_provider: "Lens", name: "lens_protocol", uom: "profiles" },
  ];

  const { data: fields } = useSearchFields();

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

  const simulatedData: ProfilesData = {
    base_basename: [
      { date: "2025-05-02", count: 0 },
      { date: "2025-05-01", count: 0 },
      { date: "2025-04-30", count: 296 },
      { date: "2025-04-29", count: 0 },
      { date: "2025-04-28", count: 279 },
      { date: "2025-04-27", count: 312 },
      { date: "2025-04-26", count: 185 },
      { date: "2025-04-25", count: 234 },
      { date: "2025-04-24", count: 156 },
      { date: "2025-04-23", count: 298 },
    ],
    ens: [
      { date: "2025-05-02", count: 12 },
      { date: "2025-05-01", count: 8 },
      { date: "2025-04-30", count: 45 },
      { date: "2025-04-29", count: 23 },
      { date: "2025-04-28", count: 67 },
      { date: "2025-04-27", count: 34 },
      { date: "2025-04-26", count: 29 },
      { date: "2025-04-25", count: 52 },
      { date: "2025-04-24", count: 41 },
      { date: "2025-04-23", count: 38 },
    ],
    farcaster: [
      { date: "2025-05-02", count: 156 },
      { date: "2025-05-01", count: 134 },
      { date: "2025-04-30", count: 178 },
      { date: "2025-04-29", count: 167 },
      { date: "2025-04-28", count: 145 },
      { date: "2025-04-27", count: 189 },
      { date: "2025-04-26", count: 123 },
      { date: "2025-04-25", count: 198 },
      { date: "2025-04-24", count: 176 },
      { date: "2025-04-23", count: 201 },
    ],
  };

  const dailyChartData = simulatedData.base_basename
    .map((item, index) => ({
      date: formatChartDate(item.date),
      base_basename: item.count,
      ens: simulatedData.ens[index]?.count || 0,
      farcaster: simulatedData.farcaster[index]?.count || 0,
    }))
    .reverse();

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
          <ProfilesChartComposer
            series={series}
            setSeries={setSeries}
            availableDataPoints={availableDataPoints}
          />
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
        {selectedView === "table" && (
          <TableContent
            query={query}
            fields={fields || []}
            order={order}
            page={page}
            perPage={perPage}
            table={table}
            onDataChange={handleDataChange}
          />
        )}

        {selectedView === "chart" && (
          <ProfilesChart data={dailyChartData} series={series} />
        )}
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
