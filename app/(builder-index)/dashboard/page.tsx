import { ProfilesTable } from "@/app/components/index/ProfilesTable";
import { getValidFilters } from "@/app/lib/data-table/data-table";
import { filterColumns } from "@/app/lib/data-table/filter-columns";
import { searchParamsCache } from "@/app/lib/data-table/validations";
import { searchProfiles } from "@/app/services/index/search";
import { Suspense } from "react";

interface PageProps {
  searchParams: Record<string, string | string[] | undefined>;
}

export default async function Page({ searchParams }: PageProps) {
  const search = searchParamsCache.parse(searchParams);
  const validFilters = getValidFilters(search.filters);
  const query = filterColumns({
    filters: validFilters,
    joinOperator: search.joinOperator,
  });

  const initialData = await searchProfiles({
    page: search.page,
    per_page: search.perPage,
    query,
    sort: search.sort,
  });

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
