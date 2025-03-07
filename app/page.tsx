import RewardsActions from "@/app/components/RewardsActions";
import RewardsHeader from "@/app/components/RewardsHeader";
import RewardsLeaderboard from "@/app/components/RewardsLeaderboard";

export default function Home() {
  return (
    <>
      <RewardsHeader />
      <RewardsActions />
      <RewardsLeaderboard />
    </>
  );
}
