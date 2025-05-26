"use client";

import { getProfilesTableColumns } from "@/app/components/index/ProfilesTableColumns";
import ProfilesTableFilters from "@/app/components/index/ProfilesTableFilters";
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
  sorting,
  setProfiles,
  setSorting,
  setTotalProfiles,
  setTotalPages,
}: {
  query: RuleGroupType;
  fields: Field[];
  order: "asc" | "desc";
  profiles: TalentProfileSearchApi[];
  setProfiles: (profiles: TalentProfileSearchApi[]) => void;
  page: number;
  perPage: number;
  sorting: SortingState;
  setSorting: (updaterOrValue: Updater<SortingState>) => void;
  setTotalProfiles: (total: number) => void;
  setTotalPages: (pages: number) => void;
}) {
  const { data: profilesData } = useSearchProfiles({
    query,
    fields,
    order,
    page,
    perPage,
  });

  const table = useReactTable({
    data: profilesData?.profiles || [],
    columns: useMemo(() => getProfilesTableColumns(), []),
    getCoreRowModel: getCoreRowModel(),
    state: {
      sorting,
    },
    onSortingChange: setSorting,
  });

  useEffect(() => {
    setProfiles(profilesData?.profiles || []);
    setTotalProfiles(profilesData?.pagination.total || 0);
    setTotalPages(profilesData?.pagination.last_page || 0);
  }, [profilesData, setProfiles, setTotalPages, setTotalProfiles]);

  return <DataTable table={table} />;
}

export function ProfilesTable({
  initialQuery,
}: {
  initialQuery: RuleGroupType;
}) {
  const [query, setQuery] = useState(initialQuery);
  const [order, setOrder] = useState<"asc" | "desc">("desc");
  const [profiles, setProfiles] = useState<TalentProfileSearchApi[]>([]);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [totalProfiles, setTotalProfiles] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
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
    setOrder(builderScoreSorting?.desc ? "desc" : "asc");
  };

  return (
    <div className="flex flex-col gap-3">
      <ProfilesTableFilters
        fields={fields || []}
        query={query}
        setQuery={setQuery}
      />

      <Suspense
        fallback={
          <ProfilesTableSkeleton
            originalProfiles={profiles}
            originalSorting={sorting}
          />
        }
      >
        <TableContent
          query={query}
          fields={fields || []}
          order={order}
          profiles={profiles}
          setProfiles={setProfiles}
          page={page}
          perPage={perPage}
          sorting={sorting}
          setSorting={handleSortingChange}
          setTotalProfiles={setTotalProfiles}
          setTotalPages={setTotalPages}
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
