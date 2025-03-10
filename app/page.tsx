import RewardsActions from "@/app/components/RewardsActions";
import RewardsHeader from "@/app/components/RewardsHeader";
import RewardsLeaderboard from "@/app/components/rewards/RewardsLeaderboard";
import { SponsorProvider } from "@/app/context/SponsorContext";
import { GrantProvider } from "@/app/context/GrantContext";

export default function Home() {
  return (
    <SponsorProvider>
      <GrantProvider>
        <RewardsHeader />
        <RewardsActions />
        <RewardsLeaderboard />
      </GrantProvider>
    </SponsorProvider>
  );
}
