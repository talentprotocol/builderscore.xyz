import { ENDPOINTS } from "@/app/config/api";
import { CACHE_60_MINUTES, CACHE_TAGS } from "@/app/lib/cache-utils";
import { unstable_cache } from "@/app/lib/unstable-cache";
import { NotificationTokensApiResponse } from "@/app/types/rewards/neynar";
import axios, { AxiosError } from "axios";

export const fetchNotificationTokensData = unstable_cache(
  async (): Promise<NotificationTokensApiResponse> => {
    try {
      const response = await axios.get(
        ENDPOINTS.localApi.neynar.notificationTokens,
      );
      return response.data as NotificationTokensApiResponse;
    } catch (err) {
      const error = err as AxiosError<Error>;
      throw new Error(`HTTP error! status: ${error.response?.status}`);
    }
  },
  [CACHE_TAGS.NOTIFICATION_TOKENS],
  { revalidate: CACHE_60_MINUTES },
);
