"use client";

import HeaderActionCards from "@/app/components/HeaderActionCards";
import { WideTabs } from "@/app/components/WideTabs";
import { useSponsor } from "@/app/context/SponsorContext";
import { useGrants, useUserLeaderboards } from "@/app/hooks/useRewards";
import { ALL_TIME_GRANT, HOF_MAX_ETH } from "@/app/lib/constants";
import {
  INDIVIDUAL_REWARD_AMOUNT_DISPLAY_TOKEN_DECIMALS,
  TOTAL_REWARD_AMOUNT_DISPLAY_TOKEN_DECIMALS,
  formatNumber,
} from "@/app/lib/utils";
import { Grant } from "@/app/types/rewards/grants";
import { LeaderboardEntry } from "@/app/types/rewards/leaderboards";

export default function Header() {
  const { data: grantsData } = useGrants();
  const { data: userLeaderboardDataThisWeek } = useUserLeaderboards(
    grantsData?.grants[0],
  );
  const { data: userLeaderboardDataLastWeek } = useUserLeaderboards(
    grantsData?.grants[1],
  );
  const { data: userLeaderboardDataAllTime } =
    useUserLeaderboards(ALL_TIME_GRANT);

  const { sponsorTokenTicker } = useSponsor();

  const GrantActionCards = ({
    grant,
    leaderboardData,
    allTime,
  }: {
    grant?: Grant;
    leaderboardData?: LeaderboardEntry;
    allTime?: boolean;
  }) => {
    const rewardedBuilders = allTime
      ? grantsData?.grants.reduce(
          (sum, grant) => sum + grant.rewarded_builders,
          0,
        )
      : grant?.rewarded_builders;

    const ended =
      allTime ||
      (grant?.end_date ? new Date(grant.end_date) < new Date() : false);

    return (
      <HeaderActionCards
        round={{
          ended: ended,
          ends: grant?.end_date || "",
        }}
        totalBuilders={rewardedBuilders || 0}
        totalRewards={{
          value: formatNumber(
            allTime
              ? grantsData?.grants.reduce(
                  (sum, grant) => sum + parseFloat(grant.rewards_pool),
                  0,
                ) || 0
              : parseFloat(grant?.rewards_pool || "0"),
            TOTAL_REWARD_AMOUNT_DISPLAY_TOKEN_DECIMALS[sponsorTokenTicker],
          ),
          ticker: sponsorTokenTicker,
        }}
        activity={{
          value: "10",
          max: 100,
        }}
        rewards={{
          value: formatNumber(
            parseFloat(leaderboardData?.reward_amount || "0"),
            INDIVIDUAL_REWARD_AMOUNT_DISPLAY_TOKEN_DECIMALS[sponsorTokenTicker],
          ),
          max: HOF_MAX_ETH,
          ticker: sponsorTokenTicker,
        }}
      />
    );
  };

  return (
    <div className="flex flex-col gap-3">
      <WideTabs
        tabs={[
          {
            label: "This Week",
            value: "this_week",
            content: (
              <GrantActionCards
                grant={grantsData?.grants[0]}
                leaderboardData={userLeaderboardDataThisWeek}
              />
            ),
            active: true,
          },
          {
            label: "Last Week",
            value: "last_week",
            content: (
              <GrantActionCards
                grant={grantsData?.grants[1]}
                leaderboardData={userLeaderboardDataLastWeek}
              />
            ),
          },
          {
            label: "All Time",
            value: "all_time",
            content: (
              <GrantActionCards
                grant={ALL_TIME_GRANT}
                leaderboardData={userLeaderboardDataAllTime}
                allTime={true}
              />
            ),
          },
        ]}
        defaultTab="this_week"
      />
    </div>
  );
}
