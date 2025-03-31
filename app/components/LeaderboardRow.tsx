"use client";

import Image from "next/image";
import { LeaderboardEntry } from "@/app/types/leaderboards";
import { formatNumber, TOKEN_DECIMALS } from "@/app/lib/utils";
import { useTheme } from "@/app/context/ThemeContext";
import { useSponsor } from "@/app/context/SponsorContext";

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
  const { isDarkMode } = useTheme();
  const { sponsorToken } = useSponsor();

  return (
    <div
      onClick={() => onBuilderSelect?.(leaderboardData)}
      className={`flex items-center justify-between py-2 px-3 pr-5 cursor-pointer
        ${isDarkMode ? "bg-neutral-900" : "bg-white"}
        ${
          isHighlighted &&
          `border ${
            isDarkMode ? "border-primary" : "border-primary"
          } rounded-lg`
        }
        ${first && "rounded-t-lg"}
        ${last && "rounded-b-lg"}
        ${
          !first &&
          `border-t ${isDarkMode ? "border-neutral-800" : "border-neutral-200"}`
        }
        ${className}`}
    >
      <div className="flex items-center gap-4">
        {leaderboardData.leaderboard_position && (
          <p
            className={`${
              isDarkMode ? "text-neutral-500" : "text-neutral-600"
            } text-xs min-w-6 font-mono`}
          >
            #{leaderboardData.leaderboard_position}
          </p>
        )}

        <span
          className={`min-w-8 text-xs ${
            leaderboardData.ranking_change === null
              ? isDarkMode
                ? "text-neutral-500"
                : "text-neutral-600"
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
                ? `↓ ${leaderboardData.ranking_change}`
                : `↑ ${leaderboardData.ranking_change}`
              : "0"
            : "0"}
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
            className={`rounded-full object-cover h-[36px] w-[36px] ${
              isHighlighted && "h-[48px] w-[48px] ml-[-6px]"
            }`}
          />
          <div>
            <p className={isDarkMode ? "text-white" : "text-neutral-800"}>
              {leaderboardData.profile.name}

              {process.env.NODE_ENV === "development" && (
                <span className="ml-5 text-green-500 text-xs">
                  ID: {leaderboardData.id}
                </span>
              )}
            </p>
          </div>
        </div>
      </div>
      <p className={isDarkMode ? "text-white" : "text-neutral-800"}>
        {leaderboardData.reward_amount ? (
          <>
            <span className="font-mono">
              {formatNumber(
                parseFloat(leaderboardData.reward_amount),
                TOKEN_DECIMALS[sponsorToken]
              )}
            </span>
            <span
              className={`${
                isDarkMode ? "text-neutral-500" : "text-neutral-600"
              } ml-2 text-xs`}
            >
              {sponsorToken}
            </span>
          </>
        ) : (
          <span className={`${isDarkMode ? "text-neutral-500" : "text-neutral-600"} ml-2 text-xs`}>No Rewards Earned</span>
        )}
      </p>
    </div>
  );
}