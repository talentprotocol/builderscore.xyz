"use client";

import { DataTable } from "@/app/components/data-table/data-table";
import { DataTableAdvancedToolbar } from "@/app/components/data-table/data-table-advanced-toolbar";
import { DataTableFilterList } from "@/app/components/data-table/data-table-filter-list";
import { DataTableSortList } from "@/app/components/data-table/data-table-sort-list";
import { useDataTable } from "@/app/hooks/useDataTable";
import type { SearchDataResponse } from "@/app/types/index/search";
import type { TalentProfileSearchApi } from "@/app/types/talent";
import type { Row } from "@tanstack/react-table";
import { useMemo } from "react";

interface ProfilesTableProps {
  initialData: SearchDataResponse;
}

export function ProfilesTable({ initialData }: ProfilesTableProps) {
  const columns = useMemo(
    () => [
      {
        accessorKey: "name",
        header: "Name",
        enableHiding: true,
      },
      {
        accessorKey: "display_name",
        header: "Display Name",
        enableHiding: true,
      },
      {
        accessorKey: "location",
        header: "Location",
        enableHiding: true,
      },
      {
        accessorKey: "builder_score",
        header: "Builder Score",
        enableHiding: true,
        cell: ({ row }: { row: Row<TalentProfileSearchApi> }) =>
          row.original.builder_score?.points ?? "N/A",
      },
      {
        accessorKey: "human_checkmark",
        header: "Human Checkmark",
        enableHiding: true,
      },
      {
        accessorKey: "tags",
        header: "Tags",
        enableHiding: true,
      },
    ],
    [],
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
          <DataTableSortList table={table} />
          <DataTableFilterList
            table={table}
            shallow={shallow}
            debounceMs={debounceMs}
            throttleMs={throttleMs}
          />
        </DataTableAdvancedToolbar>
      </DataTable>
    </>
  );
}
