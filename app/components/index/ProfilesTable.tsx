"use client";

import ProfilesChart from "@/app/components/index/ProfilesChart";
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

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <ProfilesTableFilters
          fields={fields || []}
          query={query}
          setQuery={setQuery}
        />

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

        {selectedView === "chart" && <ProfilesChart />}
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
