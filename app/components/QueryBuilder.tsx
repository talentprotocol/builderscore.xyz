"use client";

import { ClientOnly } from "@/app/components/ClientOnly";
import { ENDPOINTS } from "@/app/config/api";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import {
  Field,
  QueryBuilder as QueryBuilderComponent,
  RuleGroupType,
} from "react-querybuilder";

const fields: Field[] = [
  { name: "firstName", label: "First Name" },
  { name: "lastName", label: "Last Name" },
];

export function QueryBuilder({
  initialQuery,
}: {
  initialQuery: RuleGroupType;
}) {
  const [query, setQuery] = useState(initialQuery);

  const { data } = useQuery({
    queryKey: ["searchProfiles", query],
    queryFn: () =>
      fetch(ENDPOINTS.localApi.talent.searchProfiles, {
        method: "POST",
        body: JSON.stringify(query),
      }).then((res) => res.json()),
    placeholderData: keepPreviousData,
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

      {data?.map((item: string) => <div key={item}>{item}</div>)}
    </div>
  );
}
