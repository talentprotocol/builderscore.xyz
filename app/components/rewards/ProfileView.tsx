"use client";

import ProfileActionCards from "@/app/components/rewards/ProfileActionCards";
import ProfileHeader from "@/app/components/rewards/ProfileHeader";
import ProfileTabs from "@/app/components/rewards/ProfileTabs";
import RewardsEarned from "@/app/components/rewards/RewardsEarned";
import { Button } from "@/app/components/ui/button";
import { useSponsor } from "@/app/context/SponsorContext";
import { useUserLeaderboards } from "@/app/hooks/useRewards";
import { ALL_TIME_GRANT } from "@/app/lib/constants";
import { cn } from "@/app/lib/utils";
import { TalentProfileSearchApi } from "@/app/types/talent";
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
      <ProfileHeader profile={profile} />
      <ProfileActionCards
        profile={profile}
        rewardsAmount={parseFloat(rewardsData?.reward_amount || "0")}
        detailed={detailed || false}
        setOpenRewardsEarned={setOpenRewardsEarned}
      />

      <RewardsEarned
        open={openRewardsEarned}
        setOpen={setOpenRewardsEarned}
        profileId={profile.id}
      />

      {detailed && (
        <div className="w-full">
          <ProfileTabs profileId={profile.id} />
        </div>
      )}

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
