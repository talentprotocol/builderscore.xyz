"use client";

import Spinner from "@/app/components/Spinner";
import Leaderboard from "@/app/components/rewards/Leaderboard";
import LeaderboardRow from "@/app/components/rewards/LeaderboardRow";
import LeaderboardRowDrawer from "@/app/components/rewards/LeaderboardRowDrawer";
import { useGrant } from "@/app/context/GrantContext";
import { useSponsor } from "@/app/context/SponsorContext";
import {
  useGrants,
  useHallOfFameLeaderboards,
  useLeaderboards,
  useUserLeaderboards,
} from "@/app/hooks/useRewards";
import { useCurrentTalentProfile } from "@/app/hooks/useTalent";
import {
  ALL_TIME_GRANT,
  SPONSOR_REWARDS_START_DATE,
} from "@/app/lib/constants";
import { formatDate } from "@/app/lib/utils";
import { LeaderboardEntry } from "@/app/types/rewards/leaderboards";
import { useState } from "react";

export default function LeaderboardWrapper() {
  const { selectedSponsor } = useSponsor();
  const { selectedGrant } = useGrant();

  const { data: grantsData } = useGrants();
  const { data: userProfileData } = useCurrentTalentProfile();
  const { data: userLeaderboardData } = useUserLeaderboards(selectedGrant);
  const {
    data: leaderboardData,
    error: leaderboardError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useLeaderboards();
  const { data: hallOfFameLeaderboardData } = useHallOfFameLeaderboards();

  const [selectedBuilder, setSelectedBuilder] =
    useState<LeaderboardEntry | null>(null);

  const isAllTime = selectedGrant?.id === ALL_TIME_GRANT.id;

  return (
    <div className="mt-3 flex h-full flex-col">
      {userProfileData && userProfileData.profile && userLeaderboardData ? (
        <LeaderboardRow
          leaderboardData={userLeaderboardData}
          isHighlighted={true}
          className="mb-2"
          onBuilderSelect={setSelectedBuilder}
          isAllTime={isAllTime}
          isHofAllTime={userLeaderboardData.hall_of_fame}
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
              distributed_at: null,
              hall_of_fame: false,
              metrics: [],
              recipient_wallet: null,
            }}
            isHighlighted={true}
            className="mb-2"
            onBuilderSelect={setSelectedBuilder}
            isAllTime={isAllTime}
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
          isAllTime={isAllTime}
          hallOfFameData={hallOfFameLeaderboardData?.pages.flatMap(
            (page) => page.users,
          )}
        />
      ) : (
        <div className="flex h-32 items-center justify-center">
          {grantsData?.grants.length === 0 ? (
            <div className="flex items-center gap-2">
              <p className="text-center text-sm text-neutral-600 dark:text-neutral-500">
                {selectedSponsor?.name} Builder Rewards will start on{" "}
                {formatDate(
                  SPONSOR_REWARDS_START_DATE[
                    selectedSponsor?.slug as keyof typeof SPONSOR_REWARDS_START_DATE
                  ],
                )}
                .
              </p>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Spinner />
            </div>
          )}
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
          isAllTime={isAllTime}
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
