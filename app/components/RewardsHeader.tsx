"use client";

import { useGrant } from '@/app/context/GrantContext';
import { useLeaderboard } from '@/app/context/LeaderboardContext';
import { useUser } from '@/app/context/UserContext';
import ToggleLeaderboard from '@/app/components/ToggleLeaderboard';
import Link from 'next/link';

export default function RewardsHeader() {
  const { grants, selectedGrant, isLoading } = useGrant();
  const { userLeaderboard, showUserLeaderboard } = useLeaderboard();
  const { isLoading: isUserLoading, talentProfile } = useUser();
  const grantsToUse = selectedGrant ? [selectedGrant] : grants;

  const rewardsByTicker = grantsToUse.reduce((acc, grant) => {
    const amount = parseFloat(grant.rewards_pool);
    const ticker = grant.token_ticker || 'Tokens';
    acc[ticker] = (acc[ticker] || 0) + (isNaN(amount) ? 0 : amount);
    return acc;
  }, {} as Record<string, number>);

  const avgBuildersPerGrant = grantsToUse.length ? 
    Math.round(grantsToUse.reduce((sum, grant) => sum + grant.total_builders, 0) / grantsToUse.length) : 
    0;

  const { weightedScore, totalBuilders } = grantsToUse.reduce((acc, grant) => {
    return {
      weightedScore: acc.weightedScore + (grant.avg_builder_score * grant.total_builders),
      totalBuilders: acc.totalBuilders + grant.total_builders
    };
  }, { weightedScore: 0, totalBuilders: 0 });
  
  const weightedAvgBuilderScore = totalBuilders ? Math.round(weightedScore / totalBuilders) : 0;

  if (isLoading) {
    return (
      <div className="bg-neutral-900 rounded-lg border border-neutral-800 animate-pulse">
        <div className="h-32"></div>
      </div>
    );
  }

  const shouldShowUserLeaderboard = showUserLeaderboard && userLeaderboard;

  return (
    <div>
      {!isUserLoading && !talentProfile && (
        <div className="bg-primary/30 rounded-lg border border-primary p-4 pb-5 mb-3">
          <p className="text-white text-sm mb-4">
            Builder Rewards is a Talent Protocol initiative to reward Builders
            for their onchain and offchain contributions.
            <br />
            Create a Talent Protocol account and connect your Farcaster account
            to start earning rewards.
          </p>
          <Link
            href="https://login.talentprotocol.com/join"
            target="_blank"
            className="bg-primary text-white text-sm font-bold py-2 px-4 rounded-lg"
          >
            Get Started
          </Link>
        </div>
      )}
      <div className="bg-neutral-900 rounded-lg border border-neutral-800">
        <div className="flex flex-col items-center justify-between p-4 relative">
          {userLeaderboard && (
            <div className="absolute top-2 left-2">
              <ToggleLeaderboard />
            </div>
          )}
          <h2 className="text-neutral-500 text-sm">
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
          </h2>
          <div className="flex flex-col items-center gap-2 mt-2">
            {shouldShowUserLeaderboard ? (
              <div className="flex items-end gap-2">
                <span className="text-4xl font-mono font-semibold">
                  {parseFloat(userLeaderboard.reward_amount).toFixed(2)}
                </span>
                <span className="text-neutral-500">$TALENT</span>
              </div>
            ) : (
              Object.entries(rewardsByTicker).map(([ticker, amount]) => (
                <div key={ticker} className="flex items-end gap-2">
                  <span className="text-4xl font-mono font-semibold">
                    {amount.toFixed(2)}
                  </span>
                  <span className="text-neutral-500">{ticker}</span>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="flex justify-evenly border-t border-neutral-800 p-4">
          <div className="flex flex-col items-center justify-between">
            <p className="text-neutral-500 text-sm">
              {shouldShowUserLeaderboard
                ? "Your Rank"
                : selectedGrant
                ? "Total Builders"
                : "Avg. Builders"}
            </p>
            <p className="text-2xl font-mono font-semibold">
              {shouldShowUserLeaderboard
                ? `#${userLeaderboard.leaderboard_position || "-"}`
                : avgBuildersPerGrant}
            </p>
          </div>

          <div className="flex flex-col items-center justify-between">
            <p className="text-neutral-500 text-sm">
              {shouldShowUserLeaderboard
                ? "Builder Score"
                : "Avg. Builder Score"}
            </p>
            <p className="text-2xl font-mono font-semibold">
              {shouldShowUserLeaderboard
                ? `${userLeaderboard.user.passport.score}`
                : weightedAvgBuilderScore}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
