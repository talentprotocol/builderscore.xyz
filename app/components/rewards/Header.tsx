"use client";

import ToggleLeaderboard from "@/app/components/rewards/ToggleLeaderboard";
import { ALL_TIME_GRANT, useGrant } from "@/app/context/GrantContext";
import { useLeaderboard } from "@/app/context/LeaderboardContext";
import { useSponsor } from "@/app/context/SponsorContext";
import { useUser } from "@/app/context/UserContext";
import {
  INDIVIDUAL_REWARD_AMOUNT_DISPLAY_TOKEN_DECIMALS,
  TOTAL_REWARD_AMOUNT_DISPLAY_TOKEN_DECIMALS,
  formatDate,
  formatNumber,
  getTimeRemaining,
} from "@/app/lib/utils";

export default function Header() {
  const { grants, selectedGrant, loadingGrants } = useGrant();
  const { userLeaderboard, showUserLeaderboard, loadingLeaderboard } =
    useLeaderboard();
  const { selectedSponsor, sponsorTokenTicker, loadingSponsors } = useSponsor();
  const { loadingUser } = useUser();
  const grantsToUse =
    selectedGrant && selectedGrant.id !== ALL_TIME_GRANT.id
      ? [selectedGrant]
      : grants;
  const isLoading =
    loadingGrants || loadingSponsors || loadingLeaderboard || loadingUser;

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
  const shouldShowUserLeaderboard = showUserLeaderboard && userLeaderboard;

  function renderIntermediateGrantInfo() {
    if (
      !isIntermediateGrant ||
      isLoading ||
      selectedGrant?.id === ALL_TIME_GRANT.id
    )
      return null;

    return (
      <div className="border-primary text-primary rounded-lg border px-3 py-1 text-xs">
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
    if (!userLeaderboard) return null;

    return (
      <div className="absolute top-2 left-2">
        <ToggleLeaderboard />
      </div>
    );
  }

  function renderHeaderTitle() {
    const titleText = isLoading
      ? "Rewards"
      : shouldShowUserLeaderboard
        ? "Rewards Earned"
        : selectedGrant
          ? "Rewards Pool"
          : "Total Rewards Pool";

    return (
      <h2 className="text-sm text-neutral-600 dark:text-neutral-500">
        {process.env.NODE_ENV === "development" && userLeaderboard && (
          <span className="mr-4 text-xs text-green-500">
            ID: {userLeaderboard.id}
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
    if (isLoading) {
      return (
        <div className="mt-2 flex flex-col items-center gap-2">
          <div className="flex items-end gap-2 font-mono">
            <span className="text-4xl font-semibold">-</span>
          </div>
        </div>
      );
    }

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
    if (!userLeaderboard) return null;

    return (
      <div className="flex items-end gap-2 font-mono">
        <span className="text-4xl font-semibold">
          {userLeaderboard.reward_amount
            ? formatNumber(
                parseFloat(userLeaderboard.reward_amount),
                INDIVIDUAL_REWARD_AMOUNT_DISPLAY_TOKEN_DECIMALS[
                  sponsorTokenTicker
                ],
              )
            : "0"}
        </span>
        <span className="mb-[1px] text-neutral-600 dark:text-neutral-500">
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
        <span className="mb-[1px] text-neutral-600 dark:text-neutral-500">
          {ticker}
        </span>
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
        <span className="mb-[1px] text-neutral-600 dark:text-neutral-500">
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
    const titleText = isLoading
      ? "Builders"
      : shouldShowUserLeaderboard
        ? "Your Rank"
        : isIntermediateGrant
          ? "Builders"
          : "Builders Rewarded";

    const valueText = isLoading
      ? "-"
      : shouldShowUserLeaderboard && userLeaderboard
        ? `#${userLeaderboard.leaderboard_position || "-"}`
        : totalRewardedBuilders;

    return (
      <div className="flex flex-col items-center justify-between">
        <p className="text-sm text-neutral-600 dark:text-neutral-500">
          {titleText}
        </p>
        <p className="font-mono text-2xl font-semibold">{valueText}</p>
      </div>
    );
  }

  function renderScoreStats() {
    const titleText = isLoading
      ? "Builder Score"
      : shouldShowUserLeaderboard
        ? "Builder Score"
        : "Avg. Builder Score";

    const scoreValue = isLoading
      ? "-"
      : shouldShowUserLeaderboard && userLeaderboard
        ? `${
            "builder_score" in userLeaderboard.profile
              ? userLeaderboard.profile.builder_score?.points || "-"
              : "-"
          }`
        : weightedAvgBuilderScore;

    return (
      <div className="flex flex-col items-center justify-between">
        <p className="text-sm text-neutral-600 dark:text-neutral-500">
          {titleText}
        </p>
        <p className="font-mono text-2xl font-semibold">{scoreValue}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {renderIntermediateGrantInfo()}
      <div className="rounded-lg border border-neutral-300 bg-white dark:border-neutral-800 dark:bg-neutral-900">
        {renderHeaderSection()}
        {renderStatsSection()}
      </div>
    </div>
  );
}
