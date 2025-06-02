"use client";

import ProfilesChart from "@/app/components/index/ProfilesChart";
import ProfilesChartComposer from "@/app/components/index/ProfilesChartComposer";
import ProfilesChartDateOptions from "@/app/components/index/ProfilesChartDateOptions";
import { getProfilesTableColumns } from "@/app/components/index/ProfilesTableColumns";
import ProfilesTableFilters from "@/app/components/index/ProfilesTableFilters";
import ProfilesTableOptions from "@/app/components/index/ProfilesTableOptions";
import ProfilesTablePagination from "@/app/components/index/ProfilesTablePagination";
import { useChartData, useChartMetrics } from "@/app/hooks/useChartMetrics";
import { useSearchFields } from "@/app/hooks/useSearchQueries";
import {
  DEFAULT_SEARCH_DOCUMENT,
  DEFAULT_SEARCH_QUERY,
} from "@/app/lib/constants";
import { buildNestedQuery } from "@/app/lib/react-querybuilder-utils";
import { calculateDateRange } from "@/app/lib/utils";
import { fetchSearchAdvanced } from "@/app/services/index/search-advanced";
import { AdvancedSearchRequest } from "@/app/types/advancedSearchRequest";
import { ChartSeries } from "@/app/types/index/chart";
import { ViewOption } from "@/app/types/index/data";
import { ProfilesComponentProps } from "@/app/types/index/profiles-component";
import { SearchDataResponse } from "@/app/types/index/search";
import { useSuspenseQuery } from "@tanstack/react-query";
import {
  PaginationState,
  SortingState,
  Updater,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import axios from "axios";
import Image from "next/image";
import { useMemo, useState } from "react";
import { RuleGroupType } from "react-querybuilder";

import ProfilesTable from "./ProfilesTable";

const isServer = typeof window === "undefined";

export function ProfilesComponent({ config }: ProfilesComponentProps) {
  const [query, setQuery] = useState<RuleGroupType>(
    config.query ?? DEFAULT_SEARCH_QUERY,
  );
  const [order, setOrder] = useState<"asc" | "desc">(config.order ?? "desc");

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
    config.columnOrder ?? [
      "row_number",
      "builder",
      "bio",
      "location",
      "builder_score",
      "human_checkmark",
      "tags",
    ],
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

  const { data: profilesData } = useSuspenseQuery({
    queryKey: [
      "searchProfiles",
      config.id,
      query,
      order,
      pagination.pageIndex,
      pagination.pageSize,
    ],
    queryFn: async () => {
      const selectedDocument = DEFAULT_SEARCH_DOCUMENT;
      const requestBody: AdvancedSearchRequest = {
        query: {
          customQuery: buildNestedQuery(query),
        },
        sort: {
          score: {
            order,
          },
          id: {
            order,
          },
        },
        page: pagination.pageIndex + 1,
        per_page: pagination.pageSize,
      };

      const queryString = Object.keys(requestBody)
        .map(
          (key) =>
            `${key}=${encodeURIComponent(JSON.stringify(requestBody[key as keyof AdvancedSearchRequest]))}`,
        )
        .join("&");

      if (isServer) {
        const data = await fetchSearchAdvanced({
          documents: selectedDocument,
          queryString,
        });
        return data as SearchDataResponse;
      } else {
        const res = await axios.get(
          `/api/search/advanced/${selectedDocument}?${queryString}`,
        );
        return res.data as SearchDataResponse;
      }
    },
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
    },
    onSortingChange: handleSortingChange,
    onColumnOrderChange: handleColumnOrderChange,
    onPaginationChange: setPagination,
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

        {selectedView === "table" && <ProfilesTable table={table} />}

        {selectedView === "chart" && (
          <ProfilesChart data={chartData} series={series} />
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
