import ActionCard from "@/app/components/ActionCard";
import PulsingIndicator from "@/app/components/PulsingIndicator";
import Actions from "@/app/components/rewards/Actions";
import {
  useCurrentTalentProfile,
  useTalentBuilderScore,
} from "@/app/hooks/useTalent";
import { getTimeRemaining } from "@/app/lib/utils";

export default function HeaderActionCards({
  allTime,
  round,
  totalBuilders,
  totalRewards,
  activity,
  rewards,
  setOpen,
}: {
  allTime?: boolean;
  round: {
    ended: boolean;
    ends: string;
  };
  totalBuilders: number;
  totalRewards: {
    value: string;
    ticker: string;
  };
  activity: {
    value: number;
    max: number;
  };
  rewards: {
    value: string;
    max: number;
    ticker: string;
  };
  setOpen: (open: boolean) => void;
}) {
  const { data: userProfileData, isFetched: isFetchedUserProfile } =
    useCurrentTalentProfile();
  const { data: builderScoreData } = useTalentBuilderScore(
    userProfileData?.profile.id || "",
  );

  const rewardsProgress =
    parseFloat(rewards.value) > rewards.max
      ? 1
      : parseFloat(rewards.value) / rewards.max;

  const activityProgress =
    activity.value > activity.max ? 1 : activity.value / activity.max;

  return (
    <div className="flex flex-col">
      <div className="mt-3 grid grid-cols-2 gap-2">
        {round.ends && (
          <ActionCard
            titleMono
            title={
              round.ended
                ? totalBuilders!.toString()
                : getTimeRemaining(round.ends)
            }
            description={round.ended ? "Total Builders" : "Round Ends"}
            indicator={!round.ended && <PulsingIndicator />}
          />
        )}

        {!round.ends ? (
          <div className="col-span-2">
            <ActionCard
              titleMono
              title={`${totalRewards.value} ${totalRewards.ticker}`}
              description="Total Rewards"
            />
          </div>
        ) : (
          <ActionCard
            titleMono
            title={`${totalRewards.value} ${totalRewards.ticker}`}
            description="Total Rewards"
          />
        )}

        {isFetchedUserProfile && userProfileData && (
          <>
            {allTime ? (
              <ActionCard
                titleMono
                title={builderScoreData?.score.points.toString() || "0"}
                description="Builder Score"
              />
            ) : (
              <ActionCard
                titleMono
                title={`${((activity.value / activity.max) * 100).toFixed(0)}%`}
                description="Your Activity"
                progress={activityProgress * 100}
                onClick={() => {
                  setOpen(true);
                }}
              />
            )}

            <ActionCard
              titleMono
              title={`${rewards.value} ${rewards.ticker}`}
              description="Your Rewards"
              progress={rewards.max && rewardsProgress * 100}
            />
          </>
        )}
      </div>

      <Actions />
    </div>
  );
}
