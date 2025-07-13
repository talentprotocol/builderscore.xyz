import { ENDPOINTS } from "@/app/config/api";
import { useSponsor } from "@/app/context/SponsorContext";
import { CSVRow } from "@/app/lib/csv-parser";
import { fetchAnalyticsActiveUsers } from "@/app/services/rewards/active-users";
import { fetchNotificationTokensData } from "@/app/services/rewards/notification-tokens";
import { fetchTopBuildersLeaderboard } from "@/app/services/rewards/top-builders";
import { GoogleAnalyticsApiResponse } from "@/app/types/rewards/googleAnalytics";
import { NotificationTokensApiResponse } from "@/app/types/rewards/neynar";
import { isServer, useQuery } from "@tanstack/react-query";
import axios from "axios";

export function useAnalyticsActiveUsers() {
  return useQuery<GoogleAnalyticsApiResponse>({
    queryKey: ["analytics", "activeUsers"],
    queryFn: async () => {
      if (isServer) {
        const response = await fetchAnalyticsActiveUsers();
        return response;
      } else {
        const response = await axios.get(
          ENDPOINTS.localApi.analytics.activeUsers,
        );
        return response.data;
      }
    },
  });
}

export function useNotificationTokens() {
  return useQuery<NotificationTokensApiResponse>({
    queryKey: ["neynar", "notificationTokens"],
    queryFn: async () => {
      if (isServer) {
        const response = await fetchNotificationTokensData();
        return response;
      } else {
        const response = await axios.get(
          ENDPOINTS.localApi.neynar.notificationTokens,
        );
        return response.data;
      }
    },
  });
}

export function useTopBuildersLeaderboard(data: CSVRow[]) {
  const { selectedSponsor } = useSponsor();

  return useQuery({
    queryKey: ["topBuildersLeaderboard", selectedSponsor?.slug],
    queryFn: async () => {
      if (isServer) {
        const response = await fetchTopBuildersLeaderboard(data);
        return response;
      } else {
        const queryParams = new URLSearchParams({
          ...(selectedSponsor?.slug && {
            sponsor_slug: selectedSponsor.slug,
          }),
        }).toString();
        const response = await axios.get(
          `${ENDPOINTS.localApi.analytics.topBuilders}?${queryParams}`,
        );
        return response.data;
      }
    },
    enabled: data.length > 0,
  });
}
