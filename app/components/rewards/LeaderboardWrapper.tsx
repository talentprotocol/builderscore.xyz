"use client";

import Leaderboard from "@/app/components/rewards/Leaderboard";
import LeaderboardRow from "@/app/components/rewards/LeaderboardRow";
import LeaderboardRowDrawer from "@/app/components/rewards/LeaderboardRowDrawer";
import SelectGrant from "@/app/components/rewards/SelectGrant";
import { useGrant } from "@/app/context/GrantContext";
import { useLeaderboard } from "@/app/context/LeaderboardContext";
import { useSponsor } from "@/app/context/SponsorContext";
import { useUser } from "@/app/context/UserContext";
import { LeaderboardEntry } from "@/app/types/rewards/leaderboards";
import { format } from "date-fns";
import { useState } from "react";

export default function LeaderboardWrapper() {
  const { loadingSponsors } = useSponsor();
  const { selectedGrant } = useGrant();
  const { talentProfile } = useUser();
  const {
    isLoading,
    isLoadingMore,
    error,
    leaderboardData,
    hasMore,
    userLeaderboard,
    handleLoadMore,
  } = useLeaderboard();
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

  const isIntermediateGrant = selectedGrant?.track_type === "intermediate";

  return (
    <div className="mt-8 flex h-full flex-col">
      <div className="mb-3 flex items-end justify-between">
        <h2
          className={`ml-1 text-sm font-semibold ${isIntermediateGrant ? "text-primary" : "text-neutral-800 dark:text-white"}`}
        >
          {isIntermediateGrant && !error ? "Provisional" : "Leaderboard"}
        </h2>
        <SelectGrant />
      </div>

      {!isLoading && talentProfile && (
        <>
          {userLeaderboard ? (
            <LeaderboardRow
              leaderboardData={userLeaderboard}
              isHighlighted={true}
              className="mb-2"
              onBuilderSelect={setSelectedBuilder}
            />
          ) : (
            <LeaderboardRow
              leaderboardData={defaultUserLeaderboard}
              isHighlighted={true}
              className="mb-2"
              onBuilderSelect={setSelectedBuilder}
            />
          )}
        </>
      )}

      {!isLoading &&
        leaderboardData &&
        leaderboardData?.users?.length > 0 &&
        !error && (
          <>
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
                  ? format(new Date(selectedGrant?.start_date || ""), "MMM d") +
                    " - " +
                    format(
                      new Date(selectedGrant?.end_date || ""),
                      "MMM d, yyyy",
                    )
                  : "All Time"
              }
            />
          </>
        )}

      {selectedBuilder && (
        <LeaderboardRowDrawer
          selectedBuilder={selectedBuilder}
          onClose={() => setSelectedBuilder(null)}
          weekly={!!selectedGrant}
          context={
            selectedGrant
              ? format(new Date(selectedGrant?.start_date || ""), "MMM d") +
                " - " +
                format(new Date(selectedGrant?.end_date || ""), "MMM d, yyyy")
              : "All Time"
          }
        />
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
          <p className="text-neutral-600 dark:text-neutral-500">{error}</p>
        </div>
      )}
    </div>
  );
}
