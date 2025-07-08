"use client";

import ActionCard from "@/app/components/ActionCard";
import RewardsEarned from "@/app/components/rewards/RewardsEarned";
import { Button } from "@/app/components/ui/button";
import { useSponsor } from "@/app/context/SponsorContext";
import { useUserLeaderboards } from "@/app/hooks/useRewards";
import { ALL_TIME_GRANT, SPONSORS } from "@/app/lib/constants";
import {
  INDIVIDUAL_REWARD_AMOUNT_DISPLAY_TOKEN_DECIMALS,
  cn,
  formatNumber,
} from "@/app/lib/utils";
import { TalentProfileSearchApi } from "@/app/types/talent";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function ProfileView({
  profile,
  className,
  detailed,
}: {
  profile: TalentProfileSearchApi;
  className?: string;
  detailed?: boolean;
}) {
  const { data: rewardsData } = useUserLeaderboards(ALL_TIME_GRANT, profile.id);
  const { selectedSponsor } = useSponsor();

  const prefix = selectedSponsor ? `/${selectedSponsor.slug}` : "";

  const [openRewardsEarned, setOpenRewardsEarned] = useState(false);

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-2",
        className,
      )}
    >
      <div className="flex w-full flex-col gap-3">
        <div className="flex w-full items-center justify-between">
          <div className="flex max-w-5/6 flex-col gap-0.5">
            <p className="font-semibold text-neutral-800 dark:text-white">
              {profile.display_name || "Builder"}
            </p>

            <p className="secondary-text-style text-sm">XX Total Followers</p>
          </div>

          <Image
            src={profile.image_url?.startsWith("http") ? profile.image_url : ""}
            alt={profile.display_name || "Builder"}
            width={60}
            height={60}
            className="h-[60px] w-[60px] rounded-full object-cover"
          />
        </div>

        <p className="secondary-text-style text-sm">{profile.bio}</p>
      </div>

      <div className="mt-3 grid w-full grid-cols-2 gap-2">
        <ActionCard
          titleMono
          title={profile.builder_score?.points?.toString() || "-"}
          description="Builder Score"
        />

        <ActionCard
          titleMono
          title={`${formatNumber(
            parseFloat(rewardsData?.reward_amount || "0"),
            INDIVIDUAL_REWARD_AMOUNT_DISPLAY_TOKEN_DECIMALS[
              SPONSORS[selectedSponsor?.slug as keyof typeof SPONSORS].ticker
            ],
          )} ${SPONSORS[selectedSponsor?.slug as keyof typeof SPONSORS].ticker}`}
          description="Rewards Earned"
          onClick={detailed ? () => setOpenRewardsEarned(true) : undefined}
        />
      </div>

      <RewardsEarned
        open={openRewardsEarned}
        setOpen={setOpenRewardsEarned}
        profileId={profile.id}
      />

      {!detailed && (
        <Link href={`${prefix}/${profile.id}`} className="w-full">
          <Button
            size="lg"
            className="mb-3 w-full cursor-pointer border border-neutral-300 bg-white text-neutral-800 hover:bg-neutral-100 dark:border-neutral-500 dark:bg-neutral-900 dark:text-white dark:hover:bg-neutral-800"
          >
            View Talent Profile
          </Button>
        </Link>
      )}
    </div>
  );
}
