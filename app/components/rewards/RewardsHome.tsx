import RewardsActions from "@/app/components/RewardsActions";
import RewardsHeader from "@/app/components/RewardsHeader";
import RewardsLeaderboard from "@/app/components/rewards/RewardsLeaderboard";

export default function RewardsHome() {
  return (
    <>
      <RewardsHeader />
      <RewardsActions />
      <RewardsLeaderboard />
    </>
  );
}
