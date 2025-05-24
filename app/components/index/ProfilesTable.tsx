"use client";

import { ClientOnly } from "@/app/components/ClientOnly";
import { DataTable } from "@/app/components/data-table";
import { getProfilesTableColumns } from "@/app/components/index/ProfilesTableColumns";
import TablePagination from "@/app/components/index/TablePagination";
import {
  useSearchFields,
  useSearchProfiles,
} from "@/app/hooks/useSearchQueries";
import { getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { useEffect, useState } from "react";
import {
  QueryBuilder as QueryBuilderComponent,
  RuleGroupType,
} from "react-querybuilder";

export function ProfilesTable({
  initialQuery,
}: {
  initialQuery: RuleGroupType;
}) {
  const [query, setQuery] = useState(initialQuery);
  const [perPage, setPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(1);

  const { data: fields } = useSearchFields();
  const { data: profiles } = useSearchProfiles({
    query,
    fields,
    page,
    perPage,
  });

  const table = useReactTable({
    data: profiles?.profiles || [],
    columns: getProfilesTableColumns(),
    getCoreRowModel: getCoreRowModel(),
  });

  useEffect(() => {
    setTotalPages(profiles?.pagination.last_page || 0);
  }, [profiles]);

  return (
    <div>
      <ClientOnly>
        <QueryBuilderComponent
          fields={fields}
          query={query}
          onQueryChange={setQuery}
          controlClassnames={{
            queryBuilder: "bg-white text-black p-4",
          }}
        />
      </ClientOnly>

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
