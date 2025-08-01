"use client";

import { Progress } from "@/app/components/ui/progress";
import { useSponsor } from "@/app/context/SponsorContext";
import { SPONSOR_HOF_MAX_REWARDS } from "@/app/lib/constants";
import {
  INDIVIDUAL_REWARD_AMOUNT_DISPLAY_TOKEN_DECIMALS,
  formatNumber,
  isEmptyOrInvisible,
} from "@/app/lib/utils";
import { LeaderboardEntry } from "@/app/types/rewards/leaderboards";
import { CrownIcon } from "lucide-react";

/* eslint-disable @next/next/no-img-element */

export default function LeaderboardRow({
  leaderboardData,
  isHighlighted = false,
  first = false,
  last = false,
  className = "",
  onBuilderSelect,
  isAllTime,
  isHofAllTime,
}: {
  leaderboardData: LeaderboardEntry;
  isHighlighted?: boolean;
  first?: boolean;
  last?: boolean;
  className?: string;
  onBuilderSelect?: (builder: LeaderboardEntry) => void;
  isAllTime?: boolean;
  isHofAllTime?: boolean;
}) {
  const { sponsorTokenTicker, selectedSponsor } = useSponsor();

  const isHof =
    leaderboardData.reward_amount &&
    parseFloat(leaderboardData.reward_amount) >=
      SPONSOR_HOF_MAX_REWARDS[
        selectedSponsor?.slug as keyof typeof SPONSOR_HOF_MAX_REWARDS
      ];

  const isHofToUse = isHof || isHofAllTime;

  // Heuristic detection: New builders likely have null ranking_change 
  // (no previous position to compare to) and earned rewards
  const isNewBuilder = 
    !isAllTime && // Only show in weekly/current views, not all-time
    leaderboardData.ranking_change === null && 
    leaderboardData.reward_amount && 
    parseFloat(leaderboardData.reward_amount) > 0 &&
    !isHofToUse; // Don't show for HOF builders



  return (
    <div
      onClick={() => onBuilderSelect?.(leaderboardData)}
      className={`flex cursor-pointer items-center justify-between bg-white px-3 py-2 pr-5 dark:bg-neutral-900 ${isHighlighted && "border-primary rounded-lg border"} ${first && "rounded-t-lg"} ${last && "rounded-b-lg"} ${!first && "border-t border-neutral-300 dark:border-neutral-800"} ${className}`}
    >
      <div className="flex items-center gap-1">
        <div className="flex min-w-6 flex-col items-start">
          <p className="secondary-text-style font-mono text-xs">
            {isHofToUse && <CrownIcon className="size-3 text-yellow-500" />}
            {((!isAllTime && !isHofAllTime) || isAllTime) && (
              <>
                #
                {leaderboardData.leaderboard_position
                  ? leaderboardData.leaderboard_position
                  : "-"}
              </>
            )}
          </p>
          {isNewBuilder && (
            <span className="text-xs font-medium text-blue-500">New</span>
          )}
        </div>

        <span
          className={`min-w-10 text-xs ${
            (!isAllTime && !isHofAllTime) || isAllTime
              ? leaderboardData.ranking_change === null
                ? "secondary-text-style"
                : leaderboardData.ranking_change !== 0
                  ? leaderboardData.ranking_change < 0
                    ? "text-red-500"
                    : "text-green-500"
                  : "text-neutral-500"
              : "text-neutral-500"
          }`}
        >
          {(!isAllTime && !isHofAllTime) || isAllTime
            ? leaderboardData.ranking_change !== null
              ? leaderboardData.ranking_change !== 0
                ? leaderboardData.ranking_change < 0
                  ? `↓ ${Math.abs(leaderboardData.ranking_change)}`
                  : `↑ ${Math.abs(leaderboardData.ranking_change)}`
                : "-"
              : "-"
            : "-"}
        </span>

        <div className="flex items-center gap-4">
          {leaderboardData.profile.image_url &&
          leaderboardData.profile.image_url.startsWith("https") ? (
            <img
              src={leaderboardData.profile.image_url}
              alt={leaderboardData.profile.display_name || "Talent Builder"}
              width={isHighlighted ? 48 : 36}
              height={isHighlighted ? 48 : 36}
              className={`h-[36px] w-[36px] rounded-full object-cover ${isHofToUse && "border-2 border-yellow-500"} ${
                isHighlighted && "ml-[-6px] h-[48px] w-[48px]"
              }`}
            />
          ) : (
            <div className="flex h-[36px] w-[36px] items-center justify-center rounded-full bg-neutral-200 dark:bg-neutral-800">
              <p className="text-sm text-neutral-800 dark:text-white">
                {leaderboardData.profile.display_name?.charAt(0).toUpperCase()}
              </p>
            </div>
          )}
          <div>
            <p className="max-w-32 truncate text-sm text-neutral-800 dark:text-white">
              {isEmptyOrInvisible(leaderboardData.profile.display_name || "")
                ? leaderboardData.profile.id.slice(0, 6) +
                  "..." +
                  leaderboardData.profile.id.slice(-4)
                : leaderboardData.profile.display_name}

              {process.env.NODE_ENV === "development" && (
                <span className="ml-5 text-xs text-green-500">
                  ID: {leaderboardData.id}
                </span>
              )}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white pl-2 dark:bg-neutral-900">
        <p className="text-sm text-neutral-800 dark:text-white">
          <span className="font-mono">
            {isHofToUse
              ? ">" +
                formatNumber(
                  parseFloat(
                    String(
                      SPONSOR_HOF_MAX_REWARDS[
                        selectedSponsor?.slug as keyof typeof SPONSOR_HOF_MAX_REWARDS
                      ] || "0",
                    ),
                  ),
                  INDIVIDUAL_REWARD_AMOUNT_DISPLAY_TOKEN_DECIMALS[
                    sponsorTokenTicker
                  ],
                )
              : formatNumber(
                  parseFloat(leaderboardData.reward_amount || "0"),
                  INDIVIDUAL_REWARD_AMOUNT_DISPLAY_TOKEN_DECIMALS[
                    sponsorTokenTicker
                  ],
                )}
          </span>
          <span className="ml-2 text-xs text-neutral-600 dark:text-neutral-500">
            {sponsorTokenTicker}
          </span>
        </p>

        {isAllTime &&
          SPONSOR_HOF_MAX_REWARDS[
            selectedSponsor?.slug as keyof typeof SPONSOR_HOF_MAX_REWARDS
          ] && (
            <Progress
              value={
                (parseFloat(leaderboardData.reward_amount || "0") /
                  SPONSOR_HOF_MAX_REWARDS[
                    selectedSponsor?.slug as keyof typeof SPONSOR_HOF_MAX_REWARDS
                  ]) *
                100
              }
              className="mt-1 h-1 w-full"
            />
          )}
      </div>
    </div>
  );
}
