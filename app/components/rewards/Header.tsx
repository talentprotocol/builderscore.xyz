"use client";

import HeaderActionCards from "@/app/components/HeaderActionCards";
import { WideTabs } from "@/app/components/WideTabs";
import ActivityDrawer from "@/app/components/rewards/ActivityDrawer";
import { useGrant } from "@/app/context/GrantContext";
import { useSponsor } from "@/app/context/SponsorContext";
import { useGrants, useUserLeaderboards } from "@/app/hooks/useRewards";
import {
  ALL_TIME_GRANT,
  HOF_MAX_ETH,
  SPONSOR_BANNERS,
  SPONSOR_MIN_REWARDS,
  SPONSOR_REWARDS_PERIOD,
  SPONSOR_TOTAL_REWARDED,
} from "@/app/lib/constants";
import {
  INDIVIDUAL_REWARD_AMOUNT_DISPLAY_TOKEN_DECIMALS,
  TOTAL_REWARD_AMOUNT_DISPLAY_TOKEN_DECIMALS,
  formatNumber,
} from "@/app/lib/utils";
import { Grant } from "@/app/types/rewards/grants";
import {
  LeaderboardEntry,
  LeaderboardMetric,
} from "@/app/types/rewards/leaderboards";
import { useEffect, useState } from "react";

export default function Header() {
  const { selectedSponsor, sponsorTokenTicker } = useSponsor();
  const { setSelectedGrant } = useGrant();
  const { data: grantsData } = useGrants();
  const { data: userLeaderboardDataThisWeek } = useUserLeaderboards(
    grantsData?.grants[0],
  );
  const { data: userLeaderboardDataLastWeek } = useUserLeaderboards(
    grantsData?.grants[1],
  );
  const { data: userLeaderboardDataAllTime } =
    useUserLeaderboards(ALL_TIME_GRANT);

  const [open, setOpen] = useState(false);

  const sponsorRewardsPeriod =
    SPONSOR_REWARDS_PERIOD[
      selectedSponsor?.slug as keyof typeof SPONSOR_REWARDS_PERIOD
    ];

  const tabValues = {
    this_week: {
      name: `This ${sponsorRewardsPeriod ? sponsorRewardsPeriod.charAt(0).toUpperCase() + sponsorRewardsPeriod.slice(1) : "Week"}`,
      value: "this_week",
    },
    last_week: {
      name: `Last ${sponsorRewardsPeriod ? sponsorRewardsPeriod.charAt(0).toUpperCase() + sponsorRewardsPeriod.slice(1) : "Week"}`,
      value: "last_week",
    },
    all_time: {
      name: "All Time",
      value: "all_time",
    },
  };

  const [activeTab, setActiveTab] = useState<string>(tabValues.this_week.value);

  useEffect(() => {
    if (selectedSponsor && grantsData?.grants[0]) {
      setActiveTab(tabValues.this_week.value);
      setSelectedGrant(grantsData.grants[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSponsor, grantsData?.grants[0]]);

  const GrantActionCards = ({
    grant,
    leaderboardData,
    activity,
    allTime,
  }: {
    grant?: Grant;
    leaderboardData?: LeaderboardEntry;
    activity?: LeaderboardMetric[];
    allTime?: boolean;
  }) => {
    const rewardedBuilders = allTime
      ? grantsData?.grants.reduce(
          (sum, grant) => sum + grant.rewarded_builders,
          0,
        )
      : SPONSOR_TOTAL_REWARDED[
          selectedSponsor?.slug as keyof typeof SPONSOR_TOTAL_REWARDED
        ] || 100;

    const activityTotal = activity?.filter(
      (metric) => metric.category === "total",
    )[0];

    const ended =
      allTime ||
      (grant?.end_date ? new Date(grant.end_date) < new Date() : false);

    return (
      <>
        <HeaderActionCards
          setOpen={setOpen}
          allTime={allTime}
          round={{
            ended: ended,
            ends: grant?.end_date || "",
          }}
          totalBuilders={rewardedBuilders || 0}
          totalRewards={{
            value: formatNumber(
              grant
                ? allTime
                  ? grantsData?.grants
                      .filter((g) =>
                        g.end_date ? new Date(g.end_date) < new Date() : false,
                      )
                      .reduce(
                        (sum, grant) => sum + parseFloat(grant.rewards_pool),
                        0,
                      ) || 0
                  : parseFloat(grant?.rewards_pool || "0")
                : SPONSOR_MIN_REWARDS[
                    selectedSponsor?.slug as keyof typeof SPONSOR_MIN_REWARDS
                  ],
              TOTAL_REWARD_AMOUNT_DISPLAY_TOKEN_DECIMALS[sponsorTokenTicker],
            ),
            ticker: sponsorTokenTicker,
          }}
          activity={{
            value: activityTotal?.raw_value || 0,
            max: 100,
          }}
          rewards={{
            value: formatNumber(
              parseFloat(leaderboardData?.reward_amount || "0"),
              INDIVIDUAL_REWARD_AMOUNT_DISPLAY_TOKEN_DECIMALS[
                sponsorTokenTicker
              ],
            ),
            max: HOF_MAX_ETH,
            ticker: sponsorTokenTicker,
          }}
        />

        <ActivityDrawer
          activity={activity || []}
          open={open}
          setOpen={setOpen}
        />
      </>
    );
  };

  const getFirstTabLabel = () => {
    const grant = grantsData?.grants[0];
    if (!grant) return "Upcoming";

    const isEnded = grant.end_date
      ? new Date(grant.end_date) < new Date()
      : false;

    if (isEnded) {
      return "Latest";
    }

    return tabValues.this_week.name;
  };

  const getSecondTabLabel = () => {
    const grant1 = grantsData?.grants[1];

    if (grant1?.end_date) {
      const endedDate = new Date(grant1.end_date);
      const twoWeeksAgo = new Date();
      twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);

      if (endedDate < twoWeeksAgo) {
        return `Previous ${sponsorRewardsPeriod ? sponsorRewardsPeriod.charAt(0).toUpperCase() + sponsorRewardsPeriod.slice(1) : "Week"}`;
      }
    }

    return tabValues.last_week.name;
  };

  return (
    <div className="flex flex-col">
      {(() => {
        const BannerComponent =
          SPONSOR_BANNERS[
            selectedSponsor?.slug as keyof typeof SPONSOR_BANNERS
          ];
        return BannerComponent ? <BannerComponent /> : null;
      })()}
      <WideTabs
        value={activeTab}
        activationMode="manual"
        tabs={[
          {
            label: getFirstTabLabel(),
            value: tabValues.this_week.value,
            content: (
              <GrantActionCards
                grant={grantsData?.grants[0]}
                activity={userLeaderboardDataThisWeek?.metrics}
                leaderboardData={userLeaderboardDataThisWeek}
              />
            ),
            active: true,
            onClick: () => {
              setActiveTab(tabValues.this_week.value);
              setSelectedGrant(grantsData?.grants[0] || null);
            },
          },
          ...(grantsData?.grants[1]
            ? [
                {
                  label: getSecondTabLabel(),
                  value: tabValues.last_week.value,
                  content: (
                    <GrantActionCards
                      grant={grantsData?.grants[1]}
                      activity={userLeaderboardDataLastWeek?.metrics}
                      leaderboardData={userLeaderboardDataLastWeek}
                    />
                  ),
                  onClick: () => {
                    setActiveTab(tabValues.last_week.value);
                    setSelectedGrant(grantsData?.grants[1] || null);
                  },
                },
              ]
            : []),
          ...(grantsData?.grants[2]
            ? [
                {
                  label: tabValues.all_time.name,
                  value: tabValues.all_time.value,
                  content: (
                    <GrantActionCards
                      grant={ALL_TIME_GRANT}
                      leaderboardData={userLeaderboardDataAllTime}
                      allTime={true}
                    />
                  ),
                  onClick: () => {
                    setActiveTab(tabValues.all_time.value);
                    setSelectedGrant(ALL_TIME_GRANT);
                  },
                },
              ]
            : []),
        ]}
        defaultTab={tabValues.this_week.value}
      />
    </div>
  );
}
