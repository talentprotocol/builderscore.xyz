"use client";

import { useGrant } from '@/app/context/GrantContext';
import { useLeaderboard } from '@/app/context/LeaderboardContext';
import { useTheme } from '@/app/context/ThemeContext';
import { useSponsor } from '@/app/context/SponsorContext';
import ToggleLeaderboard from '@/app/components/ToggleLeaderboard';
import { formatNumber, formatDate, getTimeRemaining, TOKEN_DECIMALS } from '@/app/lib/utils';

export default function RewardsHeader() {
  const { grants, selectedGrant, isLoading } = useGrant();
  const { userLeaderboard, showUserLeaderboard } = useLeaderboard();
  const { isDarkMode } = useTheme();
  const { sponsorToken } = useSponsor();
  const grantsToUse = selectedGrant ? [selectedGrant] : grants;

  const rewardsByTicker = grantsToUse.reduce((acc, grant) => {
    const amount = parseFloat(grant.rewards_pool);
    const ticker = grant.token_ticker || 'Tokens';
    acc[ticker] = (acc[ticker] || 0) + (isNaN(amount) ? 0 : amount);
    return acc;
  }, {} as Record<string, number>);

  const totalRewardedBuilders = grantsToUse.reduce(
    (sum, grant) => sum + grant.rewarded_builders,
    0
  );

  const { weightedScore, totalBuilders } = grantsToUse.reduce((acc, grant) => {
    return {
      weightedScore:
        acc.weightedScore + grant.avg_builder_score * grant.rewarded_builders,
      totalBuilders: acc.totalBuilders + grant.rewarded_builders,
    };
  }, { weightedScore: 0, totalBuilders: 0 });
  
  const weightedAvgBuilderScore = totalBuilders ? Math.round(weightedScore / totalBuilders) : 0;

  const isIntermediateGrant = selectedGrant?.track_type === "intermediate";

  if (isLoading) {
    return (
      <div className={`
        ${isDarkMode
          ?'bg-neutral-900 border-neutral-800'
          : 'bg-white border-neutral-200'
        }
        rounded-lg border animate-pulse
      `}>
        <div className="h-32"></div>
      </div>
    );
  }

  const shouldShowUserLeaderboard = showUserLeaderboard && userLeaderboard;

  return (
    <div className="flex flex-col gap-3">
      {isIntermediateGrant && (
        <div
          className={`
          ${
            isDarkMode
              ? "border border-amber-600 text-amber-600"
              : "border border-amber-600 text-amber-600"
          }
          text-xs rounded-lg px-3 py-1 animate-pulse`}
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
            : "bg-white border-neutral-200"
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
                        TOKEN_DECIMALS[sponsorToken]
                      )
                    : "0"}
                </span>
                <span
                  className={`${
                    isDarkMode ? "text-neutral-500" : "text-neutral-600"
                  }`}
                >
                  {sponsorToken}
                </span>
              </div>
            ) : Object.entries(rewardsByTicker).length > 0 ? (
              Object.entries(rewardsByTicker).map(([ticker, amount]) => (
                <div key={ticker} className="flex items-end gap-2 font-mono">
                  <span className="text-4xl font-semibold">
                    {formatNumber(amount, TOKEN_DECIMALS[ticker])}
                  </span>
                  <span
                    className={`${
                      isDarkMode ? "text-neutral-500" : "text-neutral-600"
                    }`}
                  >
                    {ticker}
                  </span>
                </div>
              ))
            ) : (
              <div className="flex items-end gap-2 font-mono">
                <span className="text-4xl font-semibold">0</span>
                <span
                  className={`${
                    isDarkMode ? "text-neutral-500" : "text-neutral-600"
                  }`}
                >
                  {sponsorToken}
                </span>
              </div>
            )}
          </div>
        </div>

        <div
          className={`flex justify-evenly border-t ${
            isDarkMode ? "border-neutral-800" : "border-neutral-200"
          } p-4`}
        >
          <div className="flex flex-col items-center justify-between">
            <p
              className={`${
                isDarkMode ? "text-neutral-500" : "text-neutral-600"
              } text-sm`}
            >
              {shouldShowUserLeaderboard ? "Your Rank" : "Builders Rewarded"}
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
                ? `${userLeaderboard.profile.builder_score?.points || "-"}`
                : weightedAvgBuilderScore}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
