import { ProfilesTable } from "@/app/components/index/ProfilesTable";
import { getValidFilters } from "@/app/lib/data-table/data-table";
import { filterColumns } from "@/app/lib/data-table/filter-columns";
import { transformSortingForApi } from "@/app/lib/data-table/parsers";
import { searchParamsCache } from "@/app/lib/data-table/validations";
import { searchProfiles } from "@/app/services/index/search";
import type { SearchParams } from "@/app/types/index";
import { Suspense } from "react";

interface PageProps {
  searchParams: Promise<SearchParams>;
}

export default async function Page(props: PageProps) {
  const urlSearchParams = await props.searchParams;
  const search = searchParamsCache.parse(urlSearchParams);

  const validFilters = getValidFilters(search.filters);
  const queryFilters = filterColumns({
    filters: validFilters,
    joinOperator: search.joinOperator,
  });

  const searchParams = {
    page: search.page,
    per_page: search.perPage,
    sort: transformSortingForApi(search.sort),
    query: {
      ...search.filters,
      ...queryFilters,
    },
  };

  const initialData = await searchProfiles(searchParams);

  return (
    <div className="w-full">
      <Suspense
        fallback={
          <div className="w-full p-8 text-center">Loading profiles data...</div>
        }
      >
        <ProfilesTable initialData={initialData} />
      </Suspense>
    </div>
  );
}
