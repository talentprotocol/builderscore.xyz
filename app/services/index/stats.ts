import { API_BASE_URL, DEFAULT_HEADERS, ENDPOINTS } from "@/app/config/api";
import { CACHE_60_MINUTES, CACHE_TAGS } from "@/app/lib/cache-utils";
import { DataPointSchema } from "@/app/lib/data-table/parsers";
import { unstable_cache } from "@/app/lib/unstable-cache";
import { StatsResponse } from "@/app/types/stats";

type DailyStatsQueryParams = {
  chartDatapoints: DataPointSchema[];
  dateRange?: {
    from: string;
    to: string;
  };
};

export const fetchDailyStats = unstable_cache(
  async function (queryParams: DailyStatsQueryParams): Promise<StatsResponse> {
    const metrics = queryParams.chartDatapoints.map(
      (dataPoint) => dataPoint.dataPoint,
    );

    if (metrics.length === 0) {
      return { data: [] };
    }

    const query = {
      metrics,
      date_from: queryParams.dateRange?.from,
      date_to: queryParams.dateRange?.to,
      cumulative: true,
    };

    const encodedQuery = encodeURIComponent(JSON.stringify(query));

    const response = await fetch(
      `${API_BASE_URL}${ENDPOINTS.talent.statsDaily}?q=${encodedQuery}`,
      {
        headers: DEFAULT_HEADERS,
        next: {
          revalidate: 0,
        },
      },
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch daily stats: ${response.statusText}`);
    }

    const data = await response.json();

    return data;
  },
  [CACHE_TAGS.STATS_DAILY],
  { revalidate: CACHE_60_MINUTES },
);
