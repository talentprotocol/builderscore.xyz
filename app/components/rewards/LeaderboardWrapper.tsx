"use client";

import Leaderboard from "@/app/components/rewards/Leaderboard";
import LeaderboardRow from "@/app/components/rewards/LeaderboardRow";
import LeaderboardRowDrawer from "@/app/components/rewards/LeaderboardRowDrawer";
import SelectGrant from "@/app/components/rewards/SelectGrant";
import { useGrant } from "@/app/context/GrantContext";
import { useLeaderboard } from "@/app/context/LeaderboardContext";
import { useSponsor } from "@/app/context/SponsorContext";
import { useUser } from "@/app/context/UserContext";
import { getLeaderboards } from "@/app/services/leaderboards";
import {
  LeaderboardEntry,
  LeaderboardResponse,
} from "@/app/types/leaderboards";
import { format } from "date-fns";
import { useEffect, useState } from "react";

export default function LeaderboardWrapper() {
  const { loadingSponsors, selectedSponsor } = useSponsor();
  const { selectedGrant } = useGrant();
  const { talentProfile } = useUser();
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardResponse>();
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const { userLeaderboard } = useLeaderboard();
  const [selectedBuilder, setSelectedBuilder] =
    useState<LeaderboardEntry | null>(null);

  const defaultUserLeaderboard: LeaderboardEntry = {
    id: 0,
    profile: talentProfile!,
    leaderboard_position: null,
    ranking_change: null,
    reward_amount: null,
    reward_transaction_hash: null,
    summary: null,
  };

  const fetchLeaderboard = async (
    page: number = 1,
    append: boolean = false,
  ) => {
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
        grant_id: selectedGrant?.id?.toString(),
      });

      if (response) {
        setLeaderboardData((prevData) => {
          if (append && prevData) {
            return {
              ...response,
              users: [...prevData.users, ...response.users],
            };
          }
          return response;
        });

        setHasMore(
          response.pagination.current_page < response.pagination.last_page,
        );
      }
    } catch (err) {
      setError(`Failed to fetch leaderboard data: ${err}`);
    } finally {
      const loadingState = append ? setIsLoadingMore : setIsLoading;
      loadingState(false);
    }
  };

  useEffect(() => {
    if (!loadingSponsors) {
      setCurrentPage(1);
      fetchLeaderboard();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSponsor, selectedGrant, loadingSponsors]);

  const handleLoadMore = () => {
    if (!isLoadingMore && hasMore) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      fetchLeaderboard(nextPage, true);
    }
  };

  const isIntermediateGrant = selectedGrant?.track_type === "intermediate";

  return (
    <div className="mt-8 flex h-full flex-col">
      <div className="mb-3 flex items-end justify-between">
        <h2
          className={`ml-1 text-sm font-semibold ${isIntermediateGrant ? "text-primary" : "text-neutral-800 dark:text-white"}`}
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
                  selectedGrant
                    ? format(
                        new Date(selectedGrant?.start_date || ""),
                        "MMM d",
                      ) +
                      " - " +
                      format(
                        new Date(selectedGrant?.end_date || ""),
                        "MMM d, yyyy",
                      )
                    : "All Time"
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

      {(isLoading || loadingSponsors) && (
        <div className="flex h-96 items-center justify-center">
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent text-neutral-400 dark:text-neutral-500" />
          </div>
        </div>
      )}

      {error && (
        <div className="mt-10 mb-6 flex h-full items-center justify-center text-sm">
          <p className="text-neutral-600 dark:text-neutral-500">
            Rewards Calculation hasn&apos;t started yet.
          </p>
        </div>
      )}
    </div>
  );
}
