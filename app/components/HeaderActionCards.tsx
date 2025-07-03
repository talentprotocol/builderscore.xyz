import ActionCard from "@/app/components/ActionCard";
import PulsingIndicator from "@/app/components/PulsingIndicator";
import { getTimeRemaining } from "@/app/lib/utils";

export default function HeaderActionCards({
  round,
  totalBuilders,
  totalRewards,
  activity,
  rewards,
}: {
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
    value: string;
    max: number;
  };
  rewards: {
    value: string;
    max: number;
    ticker: string;
  };
}) {
  const rewardsProgress =
    parseFloat(rewards.value) > rewards.max
      ? 1
      : parseFloat(rewards.value) / rewards.max;
  const activityProgress =
    parseFloat(activity.value) > activity.max
      ? 1
      : parseFloat(activity.value) / activity.max;

  return (
    <div className="mt-3 grid grid-cols-2 gap-2">
      <ActionCard
        titleMono
        title={
          round.ended ? totalBuilders!.toString() : getTimeRemaining(round.ends)
        }
        description={round.ended ? "Total Builders" : "Round Ends"}
        indicator={!round.ended && <PulsingIndicator />}
      />

      <ActionCard
        titleMono
        title={`${totalRewards.value} ${totalRewards.ticker}`}
        description="Total Rewards"
      />

      <ActionCard
        titleMono
        title={`${((parseFloat(activity.value) / activity.max) * 100).toFixed(0)}%`}
        description="Your Activity"
        progress={activityProgress * 100}
        onClick={() => {
          console.log("clicked");
        }}
      />

      <ActionCard
        titleMono
        title={`${rewards.value} ${rewards.ticker}`}
        description="Your Rewards"
        progress={rewardsProgress * 100}
        onClick={() => {
          console.log("clicked");
        }}
      />
    </div>
  );
}
