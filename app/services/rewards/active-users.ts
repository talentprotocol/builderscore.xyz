import { ENDPOINTS } from "@/app/config/api";
import { CACHE_60_MINUTES, CACHE_TAGS } from "@/app/lib/cache-utils";
import { unstable_cache } from "@/app/lib/unstable-cache";
import { GoogleAnalyticsApiResponse } from "@/app/types/rewards/googleAnalytics";
import axios, { AxiosError } from "axios";

export const fetchAnalyticsActiveUsers = unstable_cache(
  async (): Promise<GoogleAnalyticsApiResponse> => {
    try {
      const response = await axios.get(
        ENDPOINTS.localApi.analytics.activeUsers,
      );
      return response.data as GoogleAnalyticsApiResponse;
    } catch (err) {
      const error = err as AxiosError<Error>;
      throw new Error(`HTTP error! status: ${error.response?.status}`);
    }
  },
  [CACHE_TAGS.ANALYTICS_ACTIVE_USERS],
  { revalidate: CACHE_60_MINUTES },
);
