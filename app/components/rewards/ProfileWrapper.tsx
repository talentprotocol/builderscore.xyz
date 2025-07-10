"use client";

import ProfileActionCards from "@/app/components/rewards/ProfileActionCards";
import ProfileHeader from "@/app/components/rewards/ProfileHeader";
import ProfileTabs from "@/app/components/rewards/ProfileTabs";
import RewardsEarned from "@/app/components/rewards/RewardsEarned";
import { Button } from "@/app/components/ui/button";
import { useSponsor } from "@/app/context/SponsorContext";
import { useUserLeaderboards } from "@/app/hooks/useRewards";
import {
  useTalentAccounts,
  useTalentContributedProjects,
  useTalentCredentials,
  useTalentSocials,
} from "@/app/hooks/useTalent";
import { ALL_TIME_GRANT } from "@/app/lib/constants";
import { cn } from "@/app/lib/utils";
import { LeaderboardEntry } from "@/app/types/rewards/leaderboards";
import { TalentProfileSearchApi } from "@/app/types/talent";
import Link from "next/link";
import { useState } from "react";

export default function ProfileWrapper({
  profile,
  className,
  detailed,
  rewards,
}: {
  profile: TalentProfileSearchApi;
  className?: string;
  detailed?: boolean;
  rewards?: LeaderboardEntry;
}) {
  const { selectedSponsor } = useSponsor();

  const { data: rewardsClient } = useUserLeaderboards(
    ALL_TIME_GRANT,
    profile.id,
  );

  const { data: socials } = useTalentSocials(profile.id);
  const { data: accounts } = useTalentAccounts(profile.id);
  const { data: credentials } = useTalentCredentials(profile.id);
  const { data: contributedProjects } = useTalentContributedProjects(
    profile.id,
  );

  const rewardsToUse = rewardsClient || rewards;

  const prefix = selectedSponsor ? `/${selectedSponsor.slug}` : "";

  const [openRewardsEarned, setOpenRewardsEarned] = useState(false);

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-2",
        className,
      )}
    >
      <ProfileHeader
        profile={profile}
        socials={socials?.socials}
        accounts={accounts?.accounts}
        detailed={detailed}
      />
      <ProfileActionCards
        profile={profile}
        rewardsAmount={parseFloat(rewardsToUse?.reward_amount || "0")}
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
          <ProfileTabs
            credentials={credentials?.credentials}
            contributedProjects={contributedProjects?.projects}
          />
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
