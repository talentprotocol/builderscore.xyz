"use client";

import Leaderboard from "@/app/components/rewards/Leaderboard";
import LeaderboardRow from "@/app/components/rewards/LeaderboardRow";
import LeaderboardRowDrawer from "@/app/components/rewards/LeaderboardRowDrawer";
import { useGrant } from "@/app/context/GrantContext";
import {
  useLeaderboards,
  useUserLeaderboards,
  useUserProfiles,
} from "@/app/hooks/useRewards";
import { formatDate } from "@/app/lib/utils";
import { LeaderboardEntry } from "@/app/types/rewards/leaderboards";
import { useState } from "react";

export default function LeaderboardWrapper() {
  const { selectedGrant } = useGrant();

  const { data: userProfileData } = useUserProfiles();
  const { data: userLeaderboardData } = useUserLeaderboards(selectedGrant);
  const {
    data: leaderboardData,
    error: leaderboardError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useLeaderboards();

  const [selectedBuilder, setSelectedBuilder] =
    useState<LeaderboardEntry | null>(null);

  return (
    <div className="mt-3 flex h-full flex-col">
      {userProfileData && userProfileData.profile && userLeaderboardData ? (
        <LeaderboardRow
          leaderboardData={userLeaderboardData}
          isHighlighted={true}
          className="mb-2"
          onBuilderSelect={setSelectedBuilder}
        />
      ) : (
        userProfileData?.profile && (
          <LeaderboardRow
            leaderboardData={{
              id: 0,
              profile: userProfileData.profile,
              leaderboard_position: null,
              ranking_change: null,
              reward_amount: null,
              reward_transaction_hash: null,
              summary: null,
            }}
            isHighlighted={true}
            className="mb-2"
            onBuilderSelect={setSelectedBuilder}
          />
        )
      )}

      {leaderboardData ? (
        <Leaderboard
          leaderboardData={{
            pagination: {
              total: leaderboardData.pages[0].pagination.total,
              current_page:
                leaderboardData.pages[leaderboardData.pages.length - 1]
                  .pagination.current_page,
              last_page: leaderboardData.pages[0].pagination.last_page,
            },
            users: leaderboardData.pages.flatMap((page) => page.users),
          }}
          onLoadMore={fetchNextPage}
          hasMore={hasNextPage}
          isLoadingMore={isFetchingNextPage}
          onBuilderSelect={setSelectedBuilder}
        />
      ) : (
        <div className="flex h-96 items-center justify-center">
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent text-neutral-400 dark:text-neutral-500" />
          </div>
        </div>
      )}

      {selectedBuilder && (
        <LeaderboardRowDrawer
          selectedBuilder={selectedBuilder}
          onClose={() => setSelectedBuilder(null)}
          weekly={!!selectedGrant}
          context={
            selectedGrant
              ? formatDate(selectedGrant.start_date) +
                " - " +
                formatDate(selectedGrant.end_date)
              : "All Time"
          }
        />
      )}

      {leaderboardError && (
        <div className="mt-10 mb-6 flex h-full items-center justify-center text-sm">
          <p className="text-neutral-600 dark:text-neutral-500">
            {leaderboardError.message}
          </p>
        </div>
      )}
    </div>
  );
}
