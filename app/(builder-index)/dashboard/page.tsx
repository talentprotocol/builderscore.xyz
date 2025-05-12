import { ProfilesTable } from "@/app/components/index/ProfilesTable";
import { getValidFilters } from "@/app/lib/data-table/data-table";
import { filterColumns } from "@/app/lib/data-table/filter-columns";
import { transformSortingForApi } from "@/app/lib/data-table/parsers";
import {
  searchParamsCache,
  statsParamsCache,
} from "@/app/lib/data-table/validations";
import { searchProfiles } from "@/app/services/index/search";
import { fetchDailyStats } from "@/app/services/index/stats";
import type { SearchParams } from "@/app/types/index";
import { connection } from "next/server";
import { Suspense } from "react";

interface PageProps {
  searchParams: Promise<SearchParams>;
}

export default async function Page(props: PageProps) {
  // This is a workaround to ensure PPR is enabled
  await connection();

  const urlSearchParams = await props.searchParams;
  const search = searchParamsCache.parse(urlSearchParams);
  const stats = statsParamsCache.parse(urlSearchParams);

  const validFilters = getValidFilters(search.filters);
  const queryFilters = filterColumns({
    filters: validFilters,
    // joinOperator: search.joinOperator,
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

  const dailyStats = await fetchDailyStats({
    chartDatapoints: stats.chartDatapoints,
    dateRange: stats.chartDateRange,
  });

  return (
    <div className="w-full">
      <Suspense
        fallback={
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent text-neutral-400 dark:text-neutral-500" />
        }
      >
        <ProfilesTable initialData={initialData} dailyStats={dailyStats} />
      </Suspense>
    </div>
  );
}
