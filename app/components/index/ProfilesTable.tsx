"use client";

import { DataTable } from "@/app/components/data-table/data-table";
import { DataTableAdvancedToolbar } from "@/app/components/data-table/data-table-advanced-toolbar";
import { DataTableSortList } from "@/app/components/data-table/data-table-sort-list";
import { getProfilesTableColumns } from "@/app/components/index/ProfilesTableColumns";
import { useDataTable } from "@/app/hooks/useDataTable";
import type { SearchDataResponse } from "@/app/types/index/search";
import * as React from "react";
import { useMemo } from "react";

import { DataTableFilterList } from "../data-table/data-table-filter-list";

interface ProfilesTableProps {
  initialData: SearchDataResponse;
}

export function ProfilesTable({ initialData }: ProfilesTableProps) {
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

  return (
    <>
      <DataTable table={table}>
        <DataTableAdvancedToolbar table={table}>
          <DataTableFilterList
            table={table}
            shallow={shallow}
            debounceMs={debounceMs}
            throttleMs={throttleMs}
            align="start"
          />
          <DataTableSortList table={table} align="start" />
        </DataTableAdvancedToolbar>
      </DataTable>
    </>
  );
}
