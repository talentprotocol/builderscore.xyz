import ActionCard from "@/app/components/ActionCard";
import { useSponsor } from "@/app/context/SponsorContext";
import { SPONSORS } from "@/app/lib/constants";
import { INDIVIDUAL_REWARD_AMOUNT_DISPLAY_TOKEN_DECIMALS } from "@/app/lib/utils";
import { formatNumber } from "@/app/lib/utils";
import { TalentProfileSearchApi } from "@/app/types/talent";

export default function ProfileActionCards({
  profile,
  rewardsAmount,
  detailed,
  setOpenRewardsEarned,
}: {
  profile: TalentProfileSearchApi;
  rewardsAmount: number;
  detailed: boolean;
  setOpenRewardsEarned: (open: boolean) => void;
}) {
  const { selectedSponsor } = useSponsor();

  return (
    <div className="mt-2 grid w-full grid-cols-2 gap-2">
      <ActionCard
        titleMono
        title={profile.builder_score?.points?.toString() || "-"}
        description="Builder Score"
      />

      <ActionCard
        titleMono
        title={`${formatNumber(
          rewardsAmount,
          INDIVIDUAL_REWARD_AMOUNT_DISPLAY_TOKEN_DECIMALS[
            SPONSORS[selectedSponsor?.slug as keyof typeof SPONSORS].ticker
          ],
        )} ${SPONSORS[selectedSponsor?.slug as keyof typeof SPONSORS].ticker}`}
        description="Rewards Earned"
        onClick={detailed ? () => setOpenRewardsEarned(true) : undefined}
      />
    </div>
  );
}
