"use client";

import { DataTable } from "@/app/components/data-table/data-table";
import { DataTableAdvancedToolbar } from "@/app/components/data-table/data-table-advanced-toolbar";
import { DataTableFilterList } from "@/app/components/data-table/data-table-filter-list";
import { DataTableSortList } from "@/app/components/data-table/data-table-sort-list";
import { getProfilesTableColumns } from "@/app/components/index/ProfilesTableColumns";
import { useDataTable } from "@/app/hooks/useDataTable";
import type { DataTableRowAction } from "@/app/types/data-table";
import type { SearchDataResponse } from "@/app/types/index/search";
import type { TalentProfileSearchApi } from "@/app/types/talent";
import * as React from "react";
import { useMemo, useState } from "react";

interface ProfilesTableProps {
  initialData: SearchDataResponse;
}

export function ProfilesTable({ initialData }: ProfilesTableProps) {
  const [, setRowAction] =
    useState<DataTableRowAction<TalentProfileSearchApi> | null>(null);

  const columns = useMemo(
    () => getProfilesTableColumns({ setRowAction }),
    [setRowAction],
  );

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
          <DataTableSortList table={table} align="start" />
          <DataTableFilterList
            table={table}
            shallow={shallow}
            debounceMs={debounceMs}
            throttleMs={throttleMs}
            align="start"
          />
        </DataTableAdvancedToolbar>
      </DataTable>
    </>
  );
}
