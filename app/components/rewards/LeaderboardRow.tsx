"use client";

import { useSponsor } from "@/app/context/SponsorContext";
import {
  INDIVIDUAL_REWARD_AMOUNT_DISPLAY_TOKEN_DECIMALS,
  formatNumber,
} from "@/app/lib/utils";
import { LeaderboardEntry } from "@/app/types/leaderboards";
import Image from "next/image";

export default function LeaderboardRow({
  leaderboardData,
  isHighlighted = false,
  first = false,
  last = false,
  className = "",
  onBuilderSelect,
}: {
  leaderboardData: LeaderboardEntry;
  isHighlighted?: boolean;
  first?: boolean;
  last?: boolean;
  className?: string;
  onBuilderSelect?: (builder: LeaderboardEntry) => void;
}) {
  const { sponsorTokenTicker } = useSponsor();

  return (
    <div
      onClick={() => onBuilderSelect?.(leaderboardData)}
      className={`flex cursor-pointer items-center justify-between bg-white px-3 py-2 pr-5 dark:bg-neutral-900 ${isHighlighted && "border-primary rounded-lg border"} ${first && "rounded-t-lg"} ${last && "rounded-b-lg"} ${!first && "border-t border-neutral-300 dark:border-neutral-800"} ${className}`}
    >
      <div className="flex items-center gap-4">
        <p className="min-w-6 font-mono text-xs text-neutral-600 dark:text-neutral-500">
          #
          {leaderboardData.leaderboard_position
            ? leaderboardData.leaderboard_position
            : "-"}
        </p>

        <span
          className={`min-w-8 text-xs ${
            leaderboardData.ranking_change === null
              ? "text-neutral-600 dark:text-neutral-500"
              : leaderboardData.ranking_change !== 0
                ? leaderboardData.ranking_change < 0
                  ? "text-red-500"
                  : "text-green-500"
                : "text-neutral-500"
          }`}
        >
          {leaderboardData.ranking_change !== null
            ? leaderboardData.ranking_change !== 0
              ? leaderboardData.ranking_change < 0
                ? `↓ ${Math.abs(leaderboardData.ranking_change)}`
                : `↑ ${Math.abs(leaderboardData.ranking_change)}`
              : "-"
            : "-"}
        </span>

        <div className="flex items-center gap-4">
          <Image
            src={
              leaderboardData.profile.image_url?.startsWith("http")
                ? leaderboardData.profile.image_url
                : ""
            }
            alt={leaderboardData.profile.name || "Talent Builder"}
            width={isHighlighted ? 48 : 36}
            height={isHighlighted ? 48 : 36}
            className={`h-[36px] w-[36px] rounded-full object-cover ${
              isHighlighted && "ml-[-6px] h-[48px] w-[48px]"
            }`}
          />
          <div>
            <p className="text-neutral-800 dark:text-white">
              {leaderboardData.profile.name}

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
        <p className="text-neutral-800 dark:text-white">
          {leaderboardData.reward_amount ? (
            <>
              <span className="font-mono">
                {formatNumber(
                  parseFloat(leaderboardData.reward_amount),
                  INDIVIDUAL_REWARD_AMOUNT_DISPLAY_TOKEN_DECIMALS[
                    sponsorTokenTicker
                  ],
                )}
              </span>
              <span className="ml-2 text-xs text-neutral-600 dark:text-neutral-500">
                {sponsorTokenTicker}
              </span>
            </>
          ) : (
            <span className="ml-2 text-xs text-neutral-600 dark:text-neutral-500">
              No Rewards Earned
            </span>
          )}
        </p>
      </div>
    </div>
  );
}
