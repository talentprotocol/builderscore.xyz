"use client";

import { ENDPOINTS } from "@/app/config/api";
import { ALL_TIME_GRANT, useGrant } from "@/app/context/GrantContext";
import { useLeaderboard } from "@/app/context/LeaderboardContext";
import { useSponsor } from "@/app/context/SponsorContext";
import { useUser } from "@/app/context/UserContext";
import { DEFAULT_SPONSOR_SLUG } from "@/app/lib/constants";
import { fetchGrants } from "@/app/services/rewards/grants";
import {
  fetchLeaderboardEntry,
  fetchLeaderboards,
} from "@/app/services/rewards/leaderboards";
import { fetchSponsors } from "@/app/services/rewards/sponsors";
import { SponsorsResponse } from "@/app/types/rewards/sponsors";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import axios from "axios";
import { useParams } from "next/navigation";
import { useCallback, useEffect } from "react";

const isServer = typeof window === "undefined";

export function useSponsors() {
  return useSuspenseQuery<SponsorsResponse>({
    queryKey: ["sponsors"],
    queryFn: async () => {
      if (isServer) {
        const response = await fetchSponsors();
        return response.sponsors || [];
      } else {
        const response = await axios.get(ENDPOINTS.localApi.talent.sponsors);
        return response.data.sponsors || [];
      }
    },
  });
}

export function useLoadRewards() {
  const params = useParams();
  const { loadingUser, frameContext, talentProfile } = useUser();

  const { sponsors, setSponsors, setSelectedSponsorFromSlug, selectedSponsor } =
    useSponsor();

  const {
    selectedGrant,
    setGrants,
    setLoadingGrants,
    setSelectedGrant,
    isAllTimeSelected,
  } = useGrant();

  const {
    setLoadingLeaderboard,
    setUserLeaderboard,
    setLeaderboardData,
    setIsLoading,
    setIsLoadingMore,
    setHasMore,
    setError,
    setCurrentPage,
    currentPage,
    fetchLeaderboard: contextFetchLeaderboard,
    handleLoadMore: contextHandleLoadMore,
  } = useLeaderboard();

  // Fetch sponsors using react-query
  const { data: sponsorsData, isLoading: loadingSponsors } = useSuspenseQuery({
    queryKey: ["sponsors"],
    queryFn: async () => {
      if (isServer) {
        const response = await fetchSponsors();
        return response.sponsors || [];
      } else {
        const response = await axios.get(ENDPOINTS.localApi.talent.sponsors);
        return response.data.sponsors || [];
      }
    },
  });

  // Fetch grants for selected sponsor
  const { data: grantsData, isLoading: loadingGrants } = useQuery({
    queryKey: ["grants", selectedSponsor?.slug],
    queryFn: async () => {
      if (!selectedSponsor) return null;

      const requestParams = {
        sponsor_slug: selectedSponsor.slug,
      };

      if (isServer) {
        const response = await fetchGrants(requestParams);
        return response.grants || [];
      } else {
        const queryParams = new URLSearchParams({
          sponsor_slug: selectedSponsor.slug,
        }).toString();
        const response = await axios.get(
          `${ENDPOINTS.localApi.talent.grants}?${queryParams}`,
        );
        return response.data.grants || [];
      }
    },
    enabled: !!selectedSponsor && !loadingSponsors,
  });

  // Fetch user leaderboard entry
  const { data: userLeaderboardData, isLoading: loadingUserLeaderboard } =
    useQuery({
      queryKey: [
        "userLeaderboard",
        talentProfile?.id,
        selectedGrant?.id,
        selectedSponsor?.slug,
        isAllTimeSelected(),
      ],
      queryFn: async () => {
        if (!frameContext || !talentProfile || !selectedGrant) {
          return null;
        }

        try {
          if (isServer) {
            const entry = await fetchLeaderboardEntry(
              talentProfile.id.toString(),
              isAllTimeSelected() ? undefined : selectedGrant?.id?.toString(),
              selectedSponsor?.slug,
            );
            return entry;
          } else {
            const queryParams = new URLSearchParams({
              user_id: talentProfile.id.toString(),
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
        } catch {
          return null;
        }
      },
      enabled: !!(
        frameContext &&
        !loadingUser &&
        !loadingGrants &&
        !loadingSponsors &&
        talentProfile &&
        selectedGrant
      ),
    });

  // Fetch leaderboard data
  const {
    data: leaderboardData,
    isLoading: loadingLeaderboardData,
    error: leaderboardError,
  } = useQuery({
    queryKey: [
      "leaderboard",
      currentPage,
      selectedSponsor?.slug,
      selectedGrant?.id,
      isAllTimeSelected(),
    ],
    queryFn: async () => {
      if (!selectedGrant) {
        return null;
      }

      if (
        !isAllTimeSelected() &&
        "sponsor" in selectedGrant &&
        selectedGrant.sponsor?.slug !== selectedSponsor?.slug
      ) {
        return null;
      }

      try {
        const requestParams = {
          per_page: 20,
          page: currentPage,
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
          if (response && response.users.length === 0 && currentPage === 1) {
            throw new Error("Rewards Calculation hasn't started yet.");
          }
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
            currentPage === 1
          ) {
            throw new Error("Rewards Calculation hasn't started yet.");
          }
          return response.data;
        }
      } catch {
        throw new Error("Rewards Calculation hasn't started yet.");
      }
    },
    enabled: !!(
      selectedGrant &&
      !loadingSponsors &&
      !loadingUser &&
      !loadingGrants
    ),
  });

  const fetchLeaderboard = useCallback(
    async (page: number = 1, append: boolean = false) => {
      if (!selectedGrant) {
        return;
      }

      if (
        !isAllTimeSelected() &&
        "sponsor" in selectedGrant &&
        selectedGrant.sponsor?.slug !== selectedSponsor?.slug
      ) {
        return;
      }

      if (!loadingSponsors && !loadingUser && !loadingGrants) {
        try {
          const loadingState = append ? setIsLoadingMore : setIsLoading;
          loadingState(true);
          setError(null);

          const requestParams = {
            per_page: 20,
            page,
            sponsor_slug:
              selectedSponsor?.slug === "global"
                ? undefined
                : selectedSponsor?.slug,
            grant_id: isAllTimeSelected()
              ? undefined
              : selectedGrant?.id?.toString(),
          };

          const queryParams = new URLSearchParams();
          Object.entries(requestParams).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
              queryParams.append(key, value.toString());
            }
          });
          const response = await axios.get(
            `${ENDPOINTS.localApi.talent.leaderboards}?${queryParams.toString()}`,
          );

          if (response.data) {
            if (response.data.users.length === 0 && !append) {
              setError("Rewards Calculation hasn't started yet.");
            }

            if (append) {
              setLeaderboardData((prevData) => {
                if (prevData) {
                  return {
                    ...response.data,
                    users: [...prevData.users, ...response.data.users],
                  };
                }
                return response.data;
              });
            } else {
              setLeaderboardData(response.data);
            }

            setHasMore(
              response.data.pagination.current_page <
                response.data.pagination.last_page,
            );
          }
        } catch {
          setError(`Rewards Calculation hasn't started yet.`);
        } finally {
          const loadingState = append ? setIsLoadingMore : setIsLoading;
          loadingState(false);
        }
      }
    },
    [
      selectedSponsor,
      selectedGrant,
      loadingSponsors,
      loadingUser,
      loadingGrants,
      setIsLoading,
      setIsLoadingMore,
      setError,
      setLeaderboardData,
      setHasMore,
      isAllTimeSelected,
    ],
  );

  const handleLoadMore = useCallback(() => {
    fetchLeaderboard(currentPage + 1, true);
    setCurrentPage(currentPage + 1);
  }, [fetchLeaderboard, currentPage, setCurrentPage]);

  // Update sponsors in context when data changes
  useEffect(() => {
    if (sponsorsData && sponsorsData.length > 0) {
      setSponsors(sponsorsData);
    }
  }, [sponsorsData, setSponsors]);

  // Update grants in context when data changes
  useEffect(() => {
    if (grantsData) {
      setLoadingGrants(false);
      if (grantsData.length > 0) {
        const sortedGrants = [...grantsData].sort(
          (a, b) =>
            new Date(b.end_date).getTime() - new Date(a.end_date).getTime(),
        );
        setGrants(grantsData);
        setSelectedGrant(sortedGrants[0] || ALL_TIME_GRANT);
      } else {
        setError("Rewards Calculation hasn't started yet.");
        setSelectedGrant(ALL_TIME_GRANT);
      }
    } else if (selectedSponsor && !loadingGrants) {
      setLoadingGrants(true);
      setGrants([]);
      setSelectedGrant(null);
      setUserLeaderboard(null);
      setLeaderboardData({
        users: [],
        pagination: {
          current_page: 1,
          last_page: 1,
          total: 0,
        },
      });
      setError(null);
    }
  }, [
    grantsData,
    selectedSponsor,
    loadingGrants,
    setGrants,
    setSelectedGrant,
    setLoadingGrants,
    setUserLeaderboard,
    setLeaderboardData,
    setError,
  ]);

  // Update user leaderboard in context when data changes
  useEffect(() => {
    setLoadingLeaderboard(loadingUserLeaderboard);
    setUserLeaderboard(userLeaderboardData ?? null);
  }, [
    userLeaderboardData,
    loadingUserLeaderboard,
    setLoadingLeaderboard,
    setUserLeaderboard,
  ]);

  // Update leaderboard data in context when data changes
  useEffect(() => {
    if (leaderboardData) {
      setLeaderboardData(leaderboardData);
      setHasMore(
        leaderboardData.pagination.current_page <
          leaderboardData.pagination.last_page,
      );
      setError(null);
    } else if (leaderboardError) {
      setError(leaderboardError.message);
    }
    setIsLoading(loadingLeaderboardData);
  }, [
    leaderboardData,
    leaderboardError,
    loadingLeaderboardData,
    setLeaderboardData,
    setHasMore,
    setError,
    setIsLoading,
  ]);

  useEffect(() => {
    if (selectedGrant) {
      setUserLeaderboard(null);
      setLeaderboardData({
        users: [],
        pagination: {
          current_page: 1,
          last_page: 1,
          total: 0,
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedGrant]);

  useEffect(() => {
    if (sponsors.length > 0) {
      const sponsorSlug = params.sponsor as string | undefined;
      setSelectedSponsorFromSlug(sponsorSlug || DEFAULT_SPONSOR_SLUG);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sponsors, params.sponsor]);

  useEffect(() => {
    if (!loadingSponsors && !loadingGrants && selectedGrant) {
      setCurrentPage(1);
      fetchLeaderboard(1, false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSponsor, selectedGrant, loadingSponsors, loadingGrants]);

  useEffect(() => {
    Object.defineProperty(contextFetchLeaderboard, "implementation", {
      value: fetchLeaderboard,
      writable: true,
    });
    Object.defineProperty(contextHandleLoadMore, "implementation", {
      value: handleLoadMore,
      writable: true,
    });
  }, [
    fetchLeaderboard,
    handleLoadMore,
    contextFetchLeaderboard,
    contextHandleLoadMore,
  ]);
}
