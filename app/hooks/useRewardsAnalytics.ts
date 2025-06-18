import { ENDPOINTS } from "@/app/config/api";
import { useGrant } from "@/app/context/GrantContext";
import { useSponsor } from "@/app/context/SponsorContext";
import { useUser } from "@/app/context/UserContext";
import {
  useGrants,
  useSponsors,
  useUserProfiles,
} from "@/app/hooks/useRewards";
import { CSVRow } from "@/app/lib/csv-parser";
import { fetchAnalyticsActiveUsers } from "@/app/services/rewards/active-users";
import { fetchLeaderboardEntry } from "@/app/services/rewards/leaderboards";
import { fetchNotificationTokensData } from "@/app/services/rewards/notification-tokens";
import { fetchTopBuildersLeaderboard } from "@/app/services/rewards/top-builders";
import { GoogleAnalyticsApiResponse } from "@/app/types/rewards/googleAnalytics";
import { LeaderboardEntry } from "@/app/types/rewards/leaderboards";
import { NotificationTokensApiResponse } from "@/app/types/rewards/neynar";
import { isServer, useQuery } from "@tanstack/react-query";
import axios from "axios";

export function useUserLeaderboards() {
  const { selectedGrant } = useGrant();
  const { selectedSponsor } = useSponsor();
  const { isAllTimeSelected } = useGrant();
  const { frameContext } = useUser();

  const { data: userProfileData, isLoading: loadingUserProfile } =
    useUserProfiles();
  const { isLoading: loadingGrants } = useGrants();
  const { isLoading: loadingSponsors } = useSponsors();

  return useQuery<LeaderboardEntry>({
    queryKey: [
      "userLeaderboards",
      userProfileData?.profile?.id,
      selectedGrant?.id,
      selectedSponsor?.slug,
      isAllTimeSelected(),
    ],
    queryFn: async () => {
      if (isServer) {
        const entry = await fetchLeaderboardEntry(
          userProfileData!.profile!.id.toString(),
          isAllTimeSelected() ? undefined : selectedGrant?.id?.toString(),
          selectedSponsor?.slug,
        );
        return entry;
      } else {
        const queryParams = new URLSearchParams({
          user_id: userProfileData!.profile!.id.toString(),
          ...(isAllTimeSelected()
            ? {}
            : { grant_id: selectedGrant?.id?.toString() }),
          ...(selectedSponsor?.slug && {
            sponsor_slug: selectedSponsor.slug,
          }),
        }).toString();
        const response = await axios.get(
          `${ENDPOINTS.localApi.talent.leaderboardEntry}?${queryParams}`,
        );
        return response.data;
      }
    },
    enabled: !!(
      frameContext &&
      !loadingUserProfile &&
      !loadingGrants &&
      !loadingSponsors &&
      userProfileData?.profile &&
      selectedGrant
    ),
    retry: false,
  });
}

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
