import { ENDPOINTS } from "@/app/config/api";
import { useGrant } from "@/app/context/GrantContext";
import { useSponsor } from "@/app/context/SponsorContext";
import { useUser } from "@/app/context/UserContext";
import { ALL_TIME_GRANT } from "@/app/lib/constants";
import { fetchSearchAdvanced } from "@/app/services/index/search-advanced";
import { fetchGrants } from "@/app/services/rewards/grants";
import { fetchLeaderboards } from "@/app/services/rewards/leaderboards";
import { fetchLeaderboardEntry } from "@/app/services/rewards/leaderboards";
import { fetchSponsors } from "@/app/services/rewards/sponsors";
import { fetchUserByFid } from "@/app/services/talent";
import { AdvancedSearchRequest } from "@/app/types/advancedSearchRequest";
import { SearchDataResponse } from "@/app/types/index/search";
import { GrantsResponse } from "@/app/types/rewards/grants";
import { Grant } from "@/app/types/rewards/grants";
import { LeaderboardResponse } from "@/app/types/rewards/leaderboards";
import { LeaderboardEntry } from "@/app/types/rewards/leaderboards";
import { SponsorsResponse } from "@/app/types/rewards/sponsors";
import { TalentProfileResponse } from "@/app/types/talent";
import { isServer, useInfiniteQuery, useQuery } from "@tanstack/react-query";
import axios from "axios";

export function useSponsors() {
  return useQuery<SponsorsResponse>({
    queryKey: ["sponsors"],
    queryFn: async () => {
      if (isServer) {
        const response = await fetchSponsors();
        return response;
      } else {
        const response = await axios.get(ENDPOINTS.localApi.talent.sponsors);
        return response.data;
      }
    },
  });
}

export function useGrants() {
  const { selectedSponsor } = useSponsor();

  const { isLoading: loadingSponsors } = useSponsors();

  return useQuery<GrantsResponse>({
    queryKey: ["grants", selectedSponsor?.slug],
    queryFn: async () => {
      const requestParams = {
        sponsor_slug: selectedSponsor!.slug,
      };

      if (isServer) {
        const response = await fetchGrants(requestParams);
        return response;
      } else {
        const queryParams = new URLSearchParams({
          sponsor_slug: selectedSponsor!.slug,
        }).toString();
        const response = await axios.get(
          `${ENDPOINTS.localApi.talent.grants}?${queryParams}`,
        );
        return response.data;
      }
    },
    enabled: !!selectedSponsor && !loadingSponsors,
  });
}

export function useUserProfiles() {
  const { frameContext, isSDKLoaded } = useUser();

  return useQuery<TalentProfileResponse>({
    queryKey: ["userProfiles", frameContext?.user?.fid],
    queryFn: async () => {
      if (!frameContext?.user?.fid) {
        throw new Error("No FID available");
      }

      if (isServer) {
        const response = await fetchUserByFid(frameContext.user.fid);
        return response;
      } else {
        const response = await axios.get(
          `${ENDPOINTS.localApi.talent.profile}?fid=${frameContext.user.fid}`,
        );
        return response.data;
      }
    },
    enabled: !!(frameContext?.user?.fid && isSDKLoaded),
    retry: false,
  });
}

export function useLeaderboards() {
  const { selectedGrant, isAllTimeSelected } = useGrant();
  const { selectedSponsor } = useSponsor();

  const { isLoading: loadingSponsors } = useSponsors();
  const { isLoading: loadingGrants } = useGrants();

  return useInfiniteQuery<LeaderboardResponse>({
    queryKey: [
      "leaderboards",
      selectedSponsor?.slug,
      selectedGrant?.id,
      isAllTimeSelected(),
    ],
    initialPageParam: 1,
    queryFn: async ({ pageParam = 1 }) => {
      const requestParams = {
        per_page: 20,
        page: pageParam as number,
        sponsor_slug:
          selectedSponsor?.slug === "global"
            ? undefined
            : selectedSponsor?.slug,
        grant_id: isAllTimeSelected()
          ? undefined
          : selectedGrant?.id?.toString(),
      };

      if (isServer) {
        const response = await fetchLeaderboards(requestParams);
        return response;
      } else {
        const queryParams = new URLSearchParams();
        Object.entries(requestParams).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            queryParams.append(key, value.toString());
          }
        });
        const response = await axios.get(
          `${ENDPOINTS.localApi.talent.leaderboards}?${queryParams.toString()}`,
        );
        if (
          response.data &&
          response.data.users.length === 0 &&
          pageParam === 1
        ) {
          throw new Error("Rewards Calculation hasn't started yet.");
        }
        return response.data;
      }
    },
    getNextPageParam: (lastPage) => {
      if (!lastPage?.pagination) return undefined;
      const { current_page, last_page } = lastPage.pagination;
      return current_page < last_page ? current_page + 1 : undefined;
    },
    enabled: !!(selectedGrant && !loadingSponsors && !loadingGrants),
  });
}

export function useLeaderboardsEarnings(uuid: string) {
  const { selectedSponsor } = useSponsor();

  const { isLoading: loadingSponsors } = useSponsors();

  return useInfiniteQuery<LeaderboardResponse>({
    queryKey: ["leaderboardsEarnings", selectedSponsor?.slug, uuid],
    initialPageParam: 1,
    queryFn: async ({ pageParam = 1 }) => {
      const requestParams = {
        per_page: 20,
        page: pageParam as number,
        id: uuid,
        sponsor_slug: selectedSponsor?.slug,
      };

      if (isServer) {
        const response = await fetchLeaderboards(requestParams);
        return response;
      } else {
        const queryParams = new URLSearchParams();
        Object.entries(requestParams).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            queryParams.append(key, value.toString());
          }
        });
        const response = await axios.get(
          `${ENDPOINTS.localApi.talent.leaderboards}?${queryParams.toString()}`,
        );
        if (
          response.data &&
          response.data.users.length === 0 &&
          pageParam === 1
        ) {
          throw new Error("No earnings found.");
        }
        return response.data;
      }
    },
    getNextPageParam: (lastPage) => {
      if (!lastPage?.pagination) return undefined;
      const { current_page, last_page } = lastPage.pagination;
      return current_page < last_page ? current_page + 1 : undefined;
    },
    enabled: !!(uuid && !loadingSponsors),
  });
}

export function useUserLeaderboards(grant?: Grant | null, userId?: string) {
  const { selectedSponsor } = useSponsor();
  const { frameContext } = useUser();

  const { data: userProfileData, isLoading: loadingUserProfile } =
    useUserProfiles();
  const { isLoading: loadingGrants } = useGrants();
  const { isLoading: loadingSponsors } = useSponsors();

  return useQuery<LeaderboardEntry>({
    queryKey: [
      "userLeaderboards",
      userId || userProfileData?.profile?.id,
      grant?.id,
      selectedSponsor?.slug,
      grant?.id === ALL_TIME_GRANT.id,
    ],
    queryFn: async () => {
      if (isServer) {
        const entry = await fetchLeaderboardEntry(
          userId || userProfileData!.profile!.id.toString(),
          grant?.id === ALL_TIME_GRANT.id ? undefined : grant?.id?.toString(),
          selectedSponsor?.slug,
        );
        return entry;
      } else {
        const queryParams = new URLSearchParams({
          user_id: userId || userProfileData!.profile!.id.toString(),
          ...(grant?.id === ALL_TIME_GRANT.id
            ? {}
            : { grant_id: grant?.id?.toString() }),
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
      grant
    ),
    retry: false,
  });
}

export function useInfiniteSearchProfiles(searchQuery: string) {
  return useInfiniteQuery<SearchDataResponse>({
    queryKey: ["infiniteSearchProfiles", searchQuery],
    initialPageParam: 1,
    queryFn: async ({ pageParam = 1 }) => {
      const requestBody: AdvancedSearchRequest = {
        query: {
          identity: searchQuery,
        },
        sort: {
          score: {
            order: "desc",
          },
          id: {
            order: "desc",
          },
        },
        page: pageParam as number,
        per_page: 20,
      };

      const queryString = Object.keys(requestBody)
        .map(
          (key) =>
            `${key}=${encodeURIComponent(JSON.stringify(requestBody[key as keyof AdvancedSearchRequest]))}`,
        )
        .join("&");

      if (isServer) {
        const response = await fetchSearchAdvanced({
          documents: "profiles",
          queryString: queryString,
        });
        return response;
      } else {
        const queryString = Object.keys(requestBody)
          .map(
            (key) =>
              `${key}=${encodeURIComponent(JSON.stringify(requestBody[key as keyof typeof requestBody]))}`,
          )
          .join("&");

        const response = await axios.get(
          `${ENDPOINTS.localApi.talent.searchAdvanced}/profiles?${queryString}`,
        );
        return response.data;
      }
    },
    getNextPageParam: (lastPage) => {
      if (!lastPage?.pagination) return undefined;
      const { current_page, last_page } = lastPage.pagination;
      return current_page < last_page ? current_page + 1 : undefined;
    },
  });
}
