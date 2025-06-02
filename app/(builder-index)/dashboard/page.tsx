import { ProfilesTable } from "@/app/components/index/ProfilesTable";
import {
  DEFAULT_SEARCH_DOCUMENT,
  DEFAULT_SEARCH_PAGE,
  DEFAULT_SEARCH_PER_PAGE,
  DEFAULT_SEARCH_QUERY,
  DEFAULT_SEARCH_SORT,
} from "@/app/lib/constants";
import { getQueryClient } from "@/app/lib/get-query-client";
import { buildNestedQuery } from "@/app/lib/react-querybuilder-utils";
import { fetchChartMetrics } from "@/app/services/index/chart-metrics";
import { fetchSearchAdvanced } from "@/app/services/index/search-advanced";
import { fetchSearchAdvancedMetadataFields } from "@/app/services/index/search-fields";
import { AdvancedSearchRequest } from "@/app/types/advancedSearchRequest";
import { SearchDataResponse } from "@/app/types/index/search";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";

export const dynamic = "force-dynamic";

export default function Page() {
  const queryClient = getQueryClient();

  const query = DEFAULT_SEARCH_QUERY;
  const order = DEFAULT_SEARCH_SORT;
  const page = DEFAULT_SEARCH_PAGE;
  const perPage = DEFAULT_SEARCH_PER_PAGE;
  const selectedDocument = DEFAULT_SEARCH_DOCUMENT;

  Promise.all([
    queryClient.prefetchQuery({
      queryKey: ["searchFields", selectedDocument],
      queryFn: () =>
        fetchSearchAdvancedMetadataFields({ documents: selectedDocument }),
    }),

    queryClient.prefetchQuery({
      queryKey: ["chartMetrics"],
      queryFn: () => fetchChartMetrics(),
    }),

    queryClient.prefetchQuery({
      queryKey: ["searchProfiles", query, order, page, perPage],
      queryFn: async () => {
        const requestBody: AdvancedSearchRequest = {
          query: {
            customQuery: buildNestedQuery(query),
          },
          sort: {
            score: {
              order,
            },
            id: {
              order,
            },
          },
          page: page,
          per_page: perPage,
        };

        const queryString = Object.keys(requestBody)
          .map(
            (key) =>
              `${key}=${encodeURIComponent(JSON.stringify(requestBody[key as keyof AdvancedSearchRequest]))}`,
          )
          .join("&");

        const data = await fetchSearchAdvanced({
          documents: selectedDocument,
          queryString,
        });

        return data as SearchDataResponse;
      },
    }),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="flex flex-col gap-6">
        <ProfilesTable initialQuery={query} />
        <ProfilesTable initialQuery={query} />
      </div>
    </HydrationBoundary>
  );
}
