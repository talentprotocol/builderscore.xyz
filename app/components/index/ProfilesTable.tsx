"use client";

import { getProfilesTableColumns } from "@/app/components/index/ProfilesTableColumns";
import ProfilesTableFilters from "@/app/components/index/ProfilesTableFilters";
import TablePagination from "@/app/components/index/ProfilesTablePagination";
import { DataTable } from "@/app/components/ui/data-table";
import {
  useSearchFields,
  useSearchProfiles,
} from "@/app/hooks/useSearchQueries";
import {
  SortingState,
  Updater,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useEffect, useMemo, useState } from "react";
import { RuleGroupType } from "react-querybuilder";

export function ProfilesTable({
  initialQuery,
}: {
  initialQuery: RuleGroupType;
}) {
  const [query, setQuery] = useState(initialQuery);
  const [order, setOrder] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [sorting, setSorting] = useState<SortingState>([
    { id: "builder_score", desc: true },
  ]);

  const { data: fields } = useSearchFields();
  const { data: profiles } = useSearchProfiles({
    query,
    fields,
    order,
    page,
    perPage,
  });

  const table = useReactTable({
    data: profiles?.profiles || [],
    columns: useMemo(() => getProfilesTableColumns(), []),
    getCoreRowModel: getCoreRowModel(),
    state: {
      sorting,
    },
    onSortingChange: (updaterOrValue: Updater<SortingState>) => {
      const newSorting =
        typeof updaterOrValue === "function"
          ? updaterOrValue(sorting)
          : updaterOrValue;

      setSorting(newSorting);

      const builderScoreSorting = newSorting.find(
        (sort) => sort.id === "builder_score",
      );
      setOrder(builderScoreSorting?.desc ? "desc" : "asc");
    },
  });

  useEffect(() => {
    setTotalPages(profiles?.pagination.last_page || 0);
  }, [profiles]);

  return (
    <div className="flex flex-col gap-3">
      <ProfilesTableFilters
        fields={fields || []}
        query={query}
        setQuery={setQuery}
      />

      <DataTable table={table} />

      <TablePagination
        total={profiles?.pagination.total || 0}
        perPage={perPage}
        setPerPage={setPerPage}
        page={page}
        setPage={setPage}
        totalPages={totalPages}
      />
    </div>
  );
}
