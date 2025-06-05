import { ProfilesComponent } from "@/app/components/index/ProfilesComponent";
import {
  DEFAULT_SEARCH_DOCUMENT,
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
import { ProfilesComponentConfig } from "@/app/types/index/profiles-component";
import { SearchDataResponse } from "@/app/types/index/search";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";

export const dynamic = "force-dynamic";

const pageConfig: {
  components: ProfilesComponentConfig[];
} = {
  components: [
    {
      id: "top-builders",
      query: DEFAULT_SEARCH_QUERY,
      selectedView: "table",
      order: "desc",
      pagination: {
        pageIndex: 0,
        pageSize: 10,
      },
      sorting: [{ id: "builder_score", desc: true }],
      showPagination: true,
      showTotal: true,
      columnOrder: [
        "row_number",
        "builder",
        "bio",
        "builder_score",
        "human_checkmark",
      ],
    },
    {
      id: "growth-chart",
      selectedView: "chart",
      dateRange: "180d",
      dateInterval: "d",
      series: {
        left: [
          {
            key: "created_accounts",
            name: "talent_created_accounts",
            dataProvider: "Talent Protocol",
            color: "var(--chart-1)",
            type: "area",
            cumulative: true,
          },
        ],
        right: [],
      },
      showPagination: false,
      showTotal: false,
    },
  ],
};

export default function Page() {
  const queryClient = getQueryClient();

  const query = DEFAULT_SEARCH_QUERY;
  const order = DEFAULT_SEARCH_SORT;
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

    ...pageConfig.components.map((config) =>
      queryClient.prefetchQuery({
        queryKey: [
          "searchProfiles",
          config.id,
          config.query ?? query,
          config.order ?? order,
          config.pagination?.pageIndex ?? 0,
          config.pagination?.pageSize ?? perPage,
        ],
        queryFn: async () => {
          const requestBody: AdvancedSearchRequest = {
            query: {
              customQuery: buildNestedQuery(config.query ?? query),
            },
            sort: {
              score: {
                order: config.order ?? order,
              },
              id: {
                order: config.order ?? order,
              },
            },
            page: (config.pagination?.pageIndex ?? 0) + 1,
            per_page: config.pagination?.pageSize ?? perPage,
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
    ),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="flex flex-col gap-6">
        {pageConfig.components.map((config) => (
          <ProfilesComponent key={config.id} config={config} />
        ))}
      </div>
    </HydrationBoundary>
  );
}
