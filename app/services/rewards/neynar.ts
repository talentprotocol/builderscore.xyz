import {
  ENDPOINTS,
  NEYNAR_API_BASE_URL,
  NEYNAR_HEADERS,
} from "@/app/config/api";
import { CACHE_60_MINUTES, CACHE_TAGS } from "@/app/lib/cache-utils";
import { unstable_cache } from "@/app/lib/unstable-cache";
import {
  CumulativeNotificationData,
  NotificationToken,
  NotificationTokenData,
  NotificationTokensParams,
  NotificationTokensResponse,
} from "@/app/types/rewards/neynar";
import axios from "axios";

export const fetchNotificationTokens = unstable_cache(
  async (
    params: NotificationTokensParams = {},
  ): Promise<NotificationTokensResponse> => {
    try {
      const { limit = 100, fids, cursor } = params;
      let url = `${NEYNAR_API_BASE_URL}${ENDPOINTS.neynar.notificationTokens}?limit=${limit}`;

      if (fids && fids.length > 0) {
        url += `&fids=${fids.join(",")}`;
      }

      if (cursor) {
        url += `&cursor=${cursor}`;
      }

      const response = await axios.get(url, {
        headers: NEYNAR_HEADERS,
      });

      return response.data;
    } catch {
      return { notification_tokens: [] };
    }
  },
  [CACHE_TAGS.NOTIFICATION_TOKENS],
  { revalidate: CACHE_60_MINUTES },
);

export function processNotificationTokensData(
  tokens: NotificationToken[],
): NotificationTokenData[] {
  const dateMap = new Map<
    string,
    { enabled: number; disabled: number; total: number }
  >();

  const sortedTokens = [...tokens].sort(
    (a, b) =>
      new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
  );

  sortedTokens.forEach((token) => {
    const date = token.created_at.split("T")[0];

    if (!dateMap.has(date)) {
      dateMap.set(date, { enabled: 0, disabled: 0, total: 0 });
    }

    const dateStats = dateMap.get(date)!;
    dateStats.total += 1;

    if (token.status === "enabled") {
      dateStats.enabled += 1;
    } else {
      dateStats.disabled += 1;
    }
  });

  return Array.from(dateMap.entries()).map(([date, stats]) => ({
    date,
    enabled: stats.enabled,
    disabled: stats.disabled,
    total: stats.total,
    enabledPercentage: (stats.enabled / stats.total) * 100,
  }));
}

export function calculateCumulativeData(
  data: NotificationTokenData[],
): CumulativeNotificationData[] {
  let cumulativeSum = 0;

  const sortedData = [...data].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  );

  return sortedData.map((item) => {
    cumulativeSum += item.enabled;
    return {
      date: item.date,
      cumulativeEnabled: cumulativeSum,
    };
  });
}
