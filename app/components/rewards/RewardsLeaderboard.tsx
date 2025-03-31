"use client";

import { useEffect, useState } from "react";
import Leaderboard from "@/app/components/Leaderboard";
import LeaderboardRow from "@/app/components/LeaderboardRow";
import { getLeaderboards } from "@/app/services/leaderboards";
import { LeaderboardEntry, LeaderboardResponse } from "@/app/types/leaderboards";
import { useSponsor } from "@/app/context/SponsorContext";
import { useGrant } from "@/app/context/GrantContext";
import { useLeaderboard } from "@/app/context/LeaderboardContext";
import { useUser } from "@/app/context/UserContext";
import { useTheme } from "@/app/context/ThemeContext";
import SelectGrant from "@/app/components/SelectGrant";
import LeaderboardRowDrawer from "@/app/components/LeaderboardRowDrawer";
import { format } from "date-fns";

export default function RewardsLeaderboard() {
  const { isLoading: isSponsorLoading, selectedSponsorSlug } = useSponsor();
  const { selectedGrant } = useGrant();
  const { talentProfile } = useUser();
  const { isDarkMode } = useTheme();
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardResponse>();
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const { userLeaderboard } = useLeaderboard();
  const [selectedBuilder, setSelectedBuilder] = useState<LeaderboardEntry | null>(null);

  const defaultUserLeaderboard: LeaderboardEntry = {
    id: 0,
    profile: talentProfile!,
    leaderboard_position: null,
    ranking_change: null,
    reward_amount: null,
    reward_transaction_hash: null,
    summary: null,
  };

  const fetchLeaderboard = async (page: number = 1, append: boolean = false) => {
    try {
      const loadingState = append ? setIsLoadingMore : setIsLoading;
      loadingState(true);
      setError(null);

      const response = await getLeaderboards({
        per_page: 20,
        page,
        sponsor_slug: selectedSponsorSlug === "global" ? undefined : selectedSponsorSlug,
        grant_id: selectedGrant?.id?.toString()
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
      setError(`Failed to fetch leaderboard data: ${err}`);
    } finally {
      const loadingState = append ? setIsLoadingMore : setIsLoading;
      loadingState(false);
    }
  };

  useEffect(() => {
    if (!isSponsorLoading) {
      setCurrentPage(1);
      fetchLeaderboard();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSponsorSlug, selectedGrant, isSponsorLoading]);

  const handleLoadMore = () => {
    if (!isLoadingMore && hasMore) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      fetchLeaderboard(nextPage, true);
    }
  };

  const isIntermediateGrant = selectedGrant?.track_type === "intermediate";

  return (
    <div className="h-full flex flex-col mt-8">
      <div className="flex items-end justify-between mb-3">
        <h2
          className={`
          text-sm font-semibold ml-1
          ${
            isDarkMode
              ? `${isIntermediateGrant ? "text-primary" : ""}`
              : `${isIntermediateGrant ? "text-primary" : "text-neutral-800"}`
          }
        `}
        >
          {isIntermediateGrant ? "Provisional" : "Leaderboard"}
        </h2>
        <SelectGrant />
      </div>

      {!isLoading && leaderboardData
        ? leaderboardData?.users?.length > 0 &&
          !error && (
            <>
              {userLeaderboard ? (
                <LeaderboardRow
                  leaderboardData={userLeaderboard}
                  isHighlighted={true}
                  className="mb-2"
                  onBuilderSelect={setSelectedBuilder}
                />
              ) : (
                talentProfile && (
                  <LeaderboardRow
                    leaderboardData={defaultUserLeaderboard}
                    isHighlighted={true}
                    className="mb-2"
                    onBuilderSelect={setSelectedBuilder}
                  />
                )
              )}
              <Leaderboard
                leaderboardData={leaderboardData!}
                onLoadMore={handleLoadMore}
                hasMore={hasMore}
                isLoadingMore={isLoadingMore}
                onBuilderSelect={setSelectedBuilder}
              />
              <LeaderboardRowDrawer
                selectedBuilder={selectedBuilder}
                onClose={() => setSelectedBuilder(null)}
                weekly={!!selectedGrant}
                context={
                  selectedGrant ? (
                    format(
                      new Date(selectedGrant?.start_date || ""),
                      "MMM d"
                    ) +
                    " - " +
                    format(new Date(selectedGrant?.end_date || ""), "MMM d, yyyy")
                  ) : "All Time"
                }
              />
            </>
          )
        : talentProfile && (
            <>
              <LeaderboardRow
                leaderboardData={defaultUserLeaderboard}
                isHighlighted={true}
                className="mb-2"
                onBuilderSelect={setSelectedBuilder}
              />
              <LeaderboardRowDrawer
                selectedBuilder={selectedBuilder}
                onClose={() => setSelectedBuilder(null)}
              />
            </>
          )}

      {(isLoading || isSponsorLoading) && (
        <div className="flex items-center justify-center h-96">
          <div className="flex items-center gap-2">
            <div
              className={`h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent ${
                isDarkMode ? "text-neutral-500" : "text-neutral-400"
              }`}
            />
          </div>
        </div>
      )}

      {error && (
        <div className="flex items-center justify-center h-full text-sm mt-10 mb-6">
          <p className={isDarkMode ? "text-neutral-500" : "text-neutral-600"}>
            Rewards Calculation hasn&apos;t started yet.
          </p>
        </div>
      )}
    </div>
  );
}
