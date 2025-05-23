"use client";

import { ClientOnly } from "@/app/components/ClientOnly";
import { DataTable } from "@/app/components/data-table";
import { getProfilesTableColumns } from "@/app/components/index/ProfilesTableColumns";
import { SearchDataResponse } from "@/app/types/index/search";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getCoreRowModel, useReactTable } from "@tanstack/react-table";
import axios from "axios";
import { useState } from "react";
import {
  Field,
  QueryBuilder as QueryBuilderComponent,
  RuleGroupType,
} from "react-querybuilder";

const fields: Field[] = [{ name: "builder_score", label: "Builder Score" }];

export function ProfilesTable({
  initialQuery,
}: {
  initialQuery: RuleGroupType;
}) {
  const [query, setQuery] = useState(initialQuery);

  const { data } = useQuery({
    queryKey: ["searchProfiles", query],
    queryFn: () =>
      axios
        .post("/api/search/profiles", query)
        .then((res) => res.data as SearchDataResponse),
    placeholderData: keepPreviousData,
  });

  const table = useReactTable({
    data: data?.profiles || [],
    columns: getProfilesTableColumns(),
    getCoreRowModel: getCoreRowModel(),
  });

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
    </div>
  );
}
