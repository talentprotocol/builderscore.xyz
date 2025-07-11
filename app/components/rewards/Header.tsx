"use client";

import ToggleLeaderboard from "@/app/components/rewards/ToggleLeaderboard";
import { useGrant } from "@/app/context/GrantContext";
import { useLeaderboard } from "@/app/context/LeaderboardContext";
import { useSponsor } from "@/app/context/SponsorContext";
import { useGrants } from "@/app/hooks/useRewards";
import { useUserLeaderboards } from "@/app/hooks/useRewardsAnalytics";
import { ALL_TIME_GRANT } from "@/app/lib/constants";
import {
  INDIVIDUAL_REWARD_AMOUNT_DISPLAY_TOKEN_DECIMALS,
  TOTAL_REWARD_AMOUNT_DISPLAY_TOKEN_DECIMALS,
  formatDate,
  formatNumber,
  getTimeRemaining,
} from "@/app/lib/utils";

export default function Header() {
  const { selectedGrant } = useGrant();
  const { data: grantsData } = useGrants();
  const { showUserLeaderboard } = useLeaderboard();
  const { data: userLeaderboardData } = useUserLeaderboards();
  const { selectedSponsor, sponsorTokenTicker } = useSponsor();
  const grantsToUse =
    selectedGrant && selectedGrant.id !== ALL_TIME_GRANT.id
      ? [selectedGrant]
      : grantsData?.grants || [];

  const rewardsByTicker = grantsToUse.reduce(
    (acc, grant) => {
      const amount = parseFloat(grant.rewards_pool);
      const ticker = grant.token_ticker || "Tokens";
      acc[ticker] = (acc[ticker] || 0) + (isNaN(amount) ? 0 : amount);
      return acc;
    },
    {} as Record<string, number>,
  );

  const getDisplayAmount = (ticker: string, amount: number) => {
    let displayAmount = amount;

    switch (selectedSponsor?.slug) {
      case "base":
        displayAmount = Math.max(amount, 2);
        break;
      case "celo":
        displayAmount = Math.max(amount, 10000);
        break;
      default:
        displayAmount = amount;
        break;
    }

    return displayAmount;
  };

  const totalRewardedBuilders = grantsToUse.reduce(
    (sum, grant) => sum + grant.rewarded_builders,
    0,
  );

  const { weightedScore, totalBuilders } = grantsToUse.reduce(
    (acc, grant) => {
      return {
        weightedScore:
          acc.weightedScore + grant.avg_builder_score * grant.rewarded_builders,
        totalBuilders: acc.totalBuilders + grant.rewarded_builders,
      };
    },
    { weightedScore: 0, totalBuilders: 0 },
  );

  const weightedAvgBuilderScore = totalBuilders
    ? Math.round(weightedScore / totalBuilders)
    : 0;

  const isIntermediateGrant = selectedGrant?.track_type === "intermediate";
  const shouldShowUserLeaderboard = showUserLeaderboard && userLeaderboardData;

  function renderIntermediateGrantInfo() {
    if (!isIntermediateGrant || selectedGrant?.id === ALL_TIME_GRANT.id)
      return null;

    return (
      <div className="border-primary text-primary rounded-md border px-3 py-1 text-xs">
        <span className="font-semibold">
          {getTimeRemaining(selectedGrant.end_date)}
        </span>{" "}
        to Earn Rewards - Ends {formatDate(selectedGrant.end_date)}
      </div>
    );
  }

  function renderHeaderSection() {
    return (
      <div className="relative flex flex-col items-center justify-between p-4">
        {renderToggleLeaderboard()}
        {renderHeaderTitle()}
        {renderRewardsAmount()}
      </div>
    );
  }

  function renderToggleLeaderboard() {
    if (!userLeaderboardData) return null;

    return (
      <div className="absolute top-2 left-2">
        <ToggleLeaderboard />
      </div>
    );
  }

  function renderHeaderTitle() {
    const titleText = shouldShowUserLeaderboard
      ? "Rewards Earned"
      : selectedGrant
        ? "Rewards Pool"
        : "Total Rewards Pool";

    return (
      <h2 className="secondary-text-style text-sm">
        {process.env.NODE_ENV === "development" && userLeaderboardData && (
          <span className="mr-4 text-xs text-green-500">
            ID: {userLeaderboardData.id}
          </span>
        )}

        {titleText}

        {process.env.NODE_ENV === "development" && (
          <span className="ml-4 text-xs text-green-500">
            Tracking: {selectedGrant?.track_type}
          </span>
        )}
      </h2>
    );
  }

  function renderRewardsAmount() {
    return (
      <div className="mt-2 flex flex-col items-center gap-2">
        {shouldShowUserLeaderboard
          ? renderUserRewards()
          : Object.entries(rewardsByTicker).length > 0
            ? renderPoolRewards()
            : renderDefaultRewards()}
      </div>
    );
  }

  function renderUserRewards() {
    if (!userLeaderboardData) return null;

    return (
      <div className="flex items-end gap-2 font-mono">
        <span className="text-4xl font-semibold">
          {userLeaderboardData.reward_amount
            ? formatNumber(
                parseFloat(userLeaderboardData.reward_amount),
                INDIVIDUAL_REWARD_AMOUNT_DISPLAY_TOKEN_DECIMALS[
                  sponsorTokenTicker
                ],
              )
            : "0"}
        </span>
        <span className="secondary-text-style mb-[1px]">
          {sponsorTokenTicker}
        </span>
      </div>
    );
  }

  function renderPoolRewards() {
    return Object.entries(rewardsByTicker).map(([ticker, amount]) => (
      <div key={ticker} className="flex items-end gap-2 font-mono">
        <span className="text-4xl font-semibold">
          {formatNumber(
            getDisplayAmount(ticker, amount),
            TOTAL_REWARD_AMOUNT_DISPLAY_TOKEN_DECIMALS[ticker],
          )}
        </span>
        <span className="secondary-text-style mb-[1px]">{ticker}</span>
      </div>
    ));
  }

  function renderDefaultRewards() {
    let displayAmount = 0;
    switch (selectedSponsor?.slug) {
      case "base":
        displayAmount = 2;
        break;
      case "celo":
        displayAmount = 10000;
        break;
      default:
        displayAmount = 0;
        break;
    }

    return (
      <div className="flex items-end gap-2 font-mono">
        <span className="text-4xl font-semibold">
          {formatNumber(
            displayAmount,
            TOTAL_REWARD_AMOUNT_DISPLAY_TOKEN_DECIMALS[sponsorTokenTicker],
          )}
        </span>
        <span className="secondary-text-style mb-[1px]">
          {sponsorTokenTicker}
        </span>
      </div>
    );
  }

  function renderStatsSection() {
    return (
      <div className="flex justify-evenly border-t border-neutral-300 p-4 dark:border-neutral-800">
        {renderBuilderStats()}
        {renderScoreStats()}
      </div>
    );
  }

  function renderBuilderStats() {
    const titleText = shouldShowUserLeaderboard
      ? "Your Rank"
      : isIntermediateGrant
        ? "Builders"
        : "Builders Rewarded";

    const valueText =
      shouldShowUserLeaderboard && userLeaderboardData
        ? `#${userLeaderboardData.leaderboard_position || "-"}`
        : totalRewardedBuilders;

    return (
      <div className="flex flex-col items-center justify-between">
        <p className="secondary-text-style text-sm">{titleText}</p>
        <p className="font-mono text-2xl font-semibold">{valueText}</p>
      </div>
    );
  }

  function renderScoreStats() {
    const titleText = shouldShowUserLeaderboard
      ? "Builder Score"
      : "Avg. Builder Score";

    const scoreValue =
      shouldShowUserLeaderboard && userLeaderboardData && userLeaderboardData.profile
        ? `${
            "builder_score" in userLeaderboardData.profile
              ? userLeaderboardData.profile.builder_score?.points || "-"
              : "-"
          }`
        : weightedAvgBuilderScore;

    return (
      <div className="flex flex-col items-center justify-between">
        <p className="secondary-text-style text-sm">{titleText}</p>
        <p className="font-mono text-2xl font-semibold">{scoreValue}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {renderIntermediateGrantInfo()}
      <div className="card-style">
        {renderHeaderSection()}
        {renderStatsSection()}
      </div>
    </div>
  );
}
