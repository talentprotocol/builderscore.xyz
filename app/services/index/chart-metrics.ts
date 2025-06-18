import { API_BASE_URL, DEFAULT_HEADERS } from "@/app/config/api";
import { CACHE_60_MINUTES, CACHE_TAGS } from "@/app/lib/cache-utils";
import { unstable_cache } from "@/app/lib/unstable-cache";
import { DataPointDefinition } from "@/app/types/index/chart";
import axios, { AxiosError } from "axios";

export const fetchChartMetrics = unstable_cache(
  async (): Promise<DataPointDefinition[]> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/stats/daily/metrics`, {
        headers: DEFAULT_HEADERS,
      });

      return response.data;
    } catch (err) {
      const error = err as AxiosError<Error>;
      throw new Error(`HTTP error! status: ${error.response?.status}`);
    }
  },
  [CACHE_TAGS.CHART_METRICS],
  { revalidate: CACHE_60_MINUTES },
);
