"use client";

import { ALL_TIME_GRANT, useGrant } from "@/app/context/GrantContext";
import { useLeaderboard } from "@/app/context/LeaderboardContext";
import { useSponsor } from "@/app/context/SponsorContext";
import { useUser } from "@/app/context/UserContext";
import { DEFAULT_SPONSOR_SLUG } from "@/app/lib/constants";
import { getGrants } from "@/app/services/grants";
import {
  getLeaderboardEntry,
  getLeaderboards,
} from "@/app/services/leaderboards";
import { getSponsors } from "@/app/services/sponsors";
import { useParams } from "next/navigation";
import { useCallback, useEffect } from "react";

export function useLoadRewards() {
  const params = useParams();
  const { loadingUser, frameContext, talentProfile } = useUser();

  const {
    sponsors,
    setSponsors,
    loadingSponsors,
    setLoadingSponsors,
    setSelectedSponsorFromSlug,
    selectedSponsor,
  } = useSponsor();

  const {
    selectedGrant,
    setGrants,
    loadingGrants,
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

  const fetchSponsors = useCallback(async () => {
    setLoadingSponsors(true);
    const response = await getSponsors();
    if (response) {
      setSponsors(response.sponsors);
    }
    setLoadingSponsors(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchUserLeaderboard = useCallback(async () => {
    if (!frameContext) {
      setLoadingLeaderboard(false);
      return;
    }

    if (
      !loadingUser &&
      !loadingGrants &&
      !loadingSponsors &&
      talentProfile &&
      selectedGrant
    ) {
      setLoadingLeaderboard(true);

      try {
        const entry = await getLeaderboardEntry(
          talentProfile.id.toString(),
          isAllTimeSelected() ? undefined : selectedGrant?.id?.toString(),
          selectedSponsor?.slug,
        );
        setUserLeaderboard(entry);
      } catch {
        setUserLeaderboard(null);
      } finally {
        setLoadingLeaderboard(false);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [frameContext, selectedGrant, selectedSponsor, talentProfile]);

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

          const response = await getLeaderboards({
            per_page: 20,
            page,
            sponsor_slug:
              selectedSponsor?.slug === "global"
                ? undefined
                : selectedSponsor?.slug,
            grant_id: isAllTimeSelected()
              ? undefined
              : selectedGrant?.id?.toString(),
          });

          if (response) {
            if (response.users.length === 0 && !append) {
              setError("Rewards Calculation hasn't started yet.");
            }

            if (append) {
              setLeaderboardData((prevData) => {
                if (prevData) {
                  return {
                    ...response,
                    users: [...prevData.users, ...response.users],
                  };
                }
                return response;
              });
            } else {
              setLeaderboardData(response);
            }

            setHasMore(
              response.pagination.current_page < response.pagination.last_page,
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
    const resetAndFetchGrants = async () => {
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

      if (!loadingSponsors && selectedSponsor) {
        const response = await getGrants({
          sponsor_slug: selectedSponsor?.slug,
        });
        if (response) {
          if (response.grants.length > 0) {
            const sortedGrants = [...response.grants].sort(
              (a, b) =>
                new Date(b.end_date).getTime() - new Date(a.end_date).getTime(),
            );

            setGrants(response.grants);
            setSelectedGrant(sortedGrants[0] || ALL_TIME_GRANT);
          } else {
            setError("Rewards Calculation hasn't started yet.");
            setSelectedGrant(ALL_TIME_GRANT);
          }
        }
        setLoadingGrants(false);
      } else {
        setLoadingGrants(false);
      }
    };

    resetAndFetchGrants();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSponsor]);

  useEffect(() => {
    if (sponsors.length > 0) {
      const sponsorSlug = params.sponsor as string | undefined;
      setSelectedSponsorFromSlug(sponsorSlug || DEFAULT_SPONSOR_SLUG);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sponsors, params.sponsor]);

  useEffect(() => {
    fetchSponsors();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetchUserLeaderboard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [frameContext, selectedGrant, selectedSponsor, talentProfile]);

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
