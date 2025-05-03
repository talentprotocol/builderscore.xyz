"use client";

import { useGrant } from "@/app/context/GrantContext";
import { useLeaderboard } from "@/app/context/LeaderboardContext";
import { useTheme } from "@/app/context/ThemeContext";
import { useSponsor } from "@/app/context/SponsorContext";
import ToggleLeaderboard from "@/app/components/rewards/ToggleLeaderboard";
import {
  formatNumber,
  formatDate,
  getTimeRemaining,
  TOTAL_REWARD_AMOUNT_DISPLAY_TOKEN_DECIMALS,
  INDIVIDUAL_REWARD_AMOUNT_DISPLAY_TOKEN_DECIMALS,
} from "@/app/lib/utils";

export default function Header() {
  const { grants, selectedGrant } = useGrant();
  const { userLeaderboard, showUserLeaderboard } = useLeaderboard();
  const { isDarkMode } = useTheme();
  const { selectedSponsor, sponsorTokenTicker } = useSponsor();
  const grantsToUse = selectedGrant ? [selectedGrant] : grants;

  const rewardsByTicker = grantsToUse.reduce(
    (acc, grant) => {
      const amount = parseFloat(grant.rewards_pool);
      const ticker = grant.token_ticker || "Tokens";
      acc[ticker] = (acc[ticker] || 0) + (isNaN(amount) ? 0 : amount);
      return acc;
    },
    {} as Record<string, number>
  );

  // TODO: Update endpoint to return ongoing, tracked Rewards
  const getDisplayAmount = (ticker: string, amount: number) => {
    if (selectedSponsor?.slug === "base") {
      return Math.min(Math.max(amount, 2), 8);
    }
    return amount;
  };

  const totalRewardedBuilders = grantsToUse.reduce(
    (sum, grant) => sum + grant.rewarded_builders,
    0
  );

  const { weightedScore, totalBuilders } = grantsToUse.reduce(
    (acc, grant) => {
      return {
        weightedScore:
          acc.weightedScore + grant.avg_builder_score * grant.rewarded_builders,
        totalBuilders: acc.totalBuilders + grant.rewarded_builders,
      };
    },
    { weightedScore: 0, totalBuilders: 0 }
  );

  const weightedAvgBuilderScore = totalBuilders
    ? Math.round(weightedScore / totalBuilders)
    : 0;

  const isIntermediateGrant = selectedGrant?.track_type === "intermediate";

  const shouldShowUserLeaderboard = showUserLeaderboard && userLeaderboard;

  return (
    <div className="flex flex-col gap-3">
      {isIntermediateGrant && (
        <div
          className={`
          ${
            isDarkMode
              ? "border border-primary text-primary"
              : "border border-primary text-primary"
          }
          text-xs rounded-lg px-3 py-1`}
        >
          <span className="font-semibold">
            {getTimeRemaining(selectedGrant.end_date)}
          </span>{" "}
          to Earn Rewards - Ends {formatDate(selectedGrant.end_date)}
        </div>
      )}

      <div
        className={`
        ${
          isDarkMode
            ? "bg-neutral-900 border-neutral-800"
            : "bg-white border-neutral-300"
        }
        rounded-lg border`}
      >
        <div className="flex flex-col items-center justify-between p-4 relative">
          {userLeaderboard && (
            <div className="absolute top-2 left-2">
              <ToggleLeaderboard />
            </div>
          )}

          <h2
            className={`${
              isDarkMode ? "text-neutral-500" : "text-neutral-600"
            } text-sm`}
          >
            {process.env.NODE_ENV === "development" && userLeaderboard && (
              <span className="text-xs text-green-500 mr-4">
                ID: {userLeaderboard.id}
              </span>
            )}

            {shouldShowUserLeaderboard
              ? "Rewards Earned"
              : selectedGrant
                ? "Rewards Pool"
                : "Total Rewards Pool"}

            {process.env.NODE_ENV === "development" && (
              <span className="text-xs text-green-500 ml-4">
                Tracking: {selectedGrant?.track_type}
              </span>
            )}
          </h2>
          <div className="flex flex-col items-center gap-2 mt-2">
            {shouldShowUserLeaderboard ? (
              <div className="flex items-end gap-2 font-mono">
                <span className="text-4xl font-semibold">
                  {userLeaderboard.reward_amount
                    ? formatNumber(
                        parseFloat(userLeaderboard.reward_amount),
                        INDIVIDUAL_REWARD_AMOUNT_DISPLAY_TOKEN_DECIMALS[
                          sponsorTokenTicker
                        ]
                      )
                    : "0"}
                </span>
                <span
                  className={`mb-[1px] ${
                    isDarkMode ? "text-neutral-500" : "text-neutral-600"
                  }`}
                >
                  {sponsorTokenTicker}
                </span>
              </div>
            ) : Object.entries(rewardsByTicker).length > 0 ? (
              Object.entries(rewardsByTicker).map(([ticker, amount]) => (
                <div key={ticker} className="flex items-end gap-2 font-mono">
                  <span className="text-4xl font-semibold">
                    {formatNumber(
                      getDisplayAmount(ticker, amount),
                      TOTAL_REWARD_AMOUNT_DISPLAY_TOKEN_DECIMALS[ticker]
                    )}
                  </span>
                  <span
                    className={`mb-[1px] ${
                      isDarkMode ? "text-neutral-500" : "text-neutral-600"
                    }`}
                  >
                    {ticker}
                  </span>
                </div>
              ))
            ) : (
              <div className="flex items-end gap-2 font-mono">
                <span className="text-4xl font-semibold">
                  {selectedSponsor?.slug === "base" ? "2" : "0"}
                </span>
                <span
                  className={`mb-[1px] ${
                    isDarkMode ? "text-neutral-500" : "text-neutral-600"
                  }`}
                >
                  {sponsorTokenTicker}
                </span>
              </div>
            )}
          </div>
        </div>

        <div
          className={`flex justify-evenly border-t ${
            isDarkMode ? "border-neutral-800" : "border-neutral-300"
          } p-4`}
        >
          <div className="flex flex-col items-center justify-between">
            <p
              className={`${
                isDarkMode ? "text-neutral-500" : "text-neutral-600"
              } text-sm`}
            >
              {shouldShowUserLeaderboard
                ? "Your Rank"
                : isIntermediateGrant
                  ? "Builders"
                  : "Builders Rewarded"}
            </p>
            <p className="text-2xl font-mono font-semibold">
              {shouldShowUserLeaderboard
                ? `#${userLeaderboard.leaderboard_position || "-"}`
                : totalRewardedBuilders}
            </p>
          </div>

          <div className="flex flex-col items-center justify-between">
            <p
              className={`${
                isDarkMode ? "text-neutral-500" : "text-neutral-600"
              } text-sm`}
            >
              {shouldShowUserLeaderboard
                ? "Builder Score"
                : "Avg. Builder Score"}
            </p>
            <p className="text-2xl font-mono font-semibold">
              {shouldShowUserLeaderboard
                ? `${
                    "builder_score" in userLeaderboard.profile
                      ? userLeaderboard.profile.builder_score?.points || "-"
                      : "-"
                  }`
                : weightedAvgBuilderScore}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
