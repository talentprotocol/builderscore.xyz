"use client";

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
    },
    onSortingChange: handleSortingChange,
  });

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <ProfilesTableFilters
          fields={fields || []}
          query={query}
          setQuery={setQuery}
        />

        <ProfilesTableOptions table={table} />
      </div>

      <Suspense
        fallback={
          <ProfilesTableSkeleton
            originalProfiles={profiles}
            originalSorting={sorting}
            page={currentProfilesPage}
            perPage={currentProfilesPerPage}
          />
        }
      >
        <TableContent
          query={query}
          fields={fields || []}
          order={order}
          page={page}
          perPage={perPage}
          table={table}
          onDataChange={handleDataChange}
        />
      </Suspense>

      <TablePagination
        total={totalProfiles}
        perPage={perPage}
        setPerPage={setPerPage}
        page={page}
        setPage={setPage}
        totalPages={totalPages}
      />
    </div>
  );
}
