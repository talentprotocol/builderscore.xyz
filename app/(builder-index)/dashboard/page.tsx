import { ProfilesTable } from "@/app/components/index/ProfilesTable";
import {
  DEFAULT_SEARCH_DOCUMENT,
  DEFAULT_SEARCH_PAGE,
  DEFAULT_SEARCH_PER_PAGE,
  DEFAULT_SEARCH_QUERY,
  DEFAULT_SEARCH_SORT,
} from "@/app/lib/constants";
import { buildNestedQuery } from "@/app/lib/react-querybuilder-utils";
import { AdvancedSearchRequest } from "@/app/types/advancedSearchRequest";
import { SearchDataResponse } from "@/app/types/index/search";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import axios from "axios";

export const dynamic = "force-dynamic";

export default async function Page() {
  const queryClient = new QueryClient();

  const query = DEFAULT_SEARCH_QUERY;
  const sort = DEFAULT_SEARCH_SORT;
  const page = DEFAULT_SEARCH_PAGE;
  const perPage = DEFAULT_SEARCH_PER_PAGE;

  await queryClient.prefetchQuery({
    queryKey: ["searchProfiles", query, sort, page, perPage],
    queryFn: async () => {
      const requestBody: AdvancedSearchRequest = {
        query: {
          customQuery: buildNestedQuery(query),
        },
        sort: {
          score: {
            order: sort,
          },
          id: {
            order: sort,
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

      const res = await axios.get(
        `${process.env.BUILDER_REWARDS_URL}/api/search/advanced/${DEFAULT_SEARCH_DOCUMENT}?${queryString}`,
      );

      return res.data as SearchDataResponse;
    },
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProfilesTable initialQuery={query} />
    </HydrationBoundary>
  );
}
