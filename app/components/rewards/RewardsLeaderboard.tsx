"use client";

import { useEffect, useState } from "react";
import Leaderboard from "@/app/components/Leaderboard";
import LeaderboardRow from "@/app/components/LeaderboardRow";
import { getLeaderboards } from "@/app/services/leaderboards";
import { LeaderboardResponse } from "@/app/types/leaderboards";
import { useSponsor } from "@/app/context/SponsorContext";

export default function RewardsLeaderboard() {
  const { selectedSponsorSlug } = useSponsor();
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardResponse>();
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchLeaderboard = async (page: number = 1, append: boolean = false) => {
    try {
      const loadingState = append ? setIsLoadingMore : setIsLoading;
      loadingState(true);
      setError(null);

      const response = await getLeaderboards({
        per_page: 20,
        page,
        sponsor_slug: selectedSponsorSlug === "global" ? undefined : selectedSponsorSlug
      });

      setLeaderboardData(prevData => {
        if (append && prevData) {
          return {
            ...response,
            users: [...prevData.users, ...response.users]
          };
        }
        return response;
      });

      setHasMore(response.pagination.current_page < response.pagination.last_page);
    } catch (err) {
      setError('Failed to fetch leaderboard data');
      console.error('Error fetching leaderboard:', err);
    } finally {
      const loadingState = append ? setIsLoadingMore : setIsLoading;
      loadingState(false);
    }
  };

  useEffect(() => {
    setCurrentPage(1);
    fetchLeaderboard();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSponsorSlug]);

  const handleLoadMore = () => {
    if (!isLoadingMore && hasMore) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      fetchLeaderboard(nextPage, true);
    }
  };

  return (
    <div className="h-full flex flex-col mt-8">
      <h2 className="text-sm font-semibold ml-1 mb-3">Leaderboard</h2>

      {isLoading && (
        <div className="flex items-center justify-center h-full">
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent text-neutral-400" />
          </div>
        </div>
      )}

      {error && (
        <div className="flex items-center justify-center h-full">
          <p className="text-neutral-400">Error loading Leaderboard.</p>
        </div>
      )}

      {leaderboardData && leaderboardData?.users?.length > 0 && !error && (
        <>
          <LeaderboardRow
            leaderboardData={leaderboardData!.users[0]}
            isHighlighted={true}
            className="mb-2"
          />
          <Leaderboard 
            leaderboardData={leaderboardData!}
            onLoadMore={handleLoadMore}
            hasMore={hasMore}
            isLoadingMore={isLoadingMore}
          />
        </>
      )}
    </div>
  );
}
