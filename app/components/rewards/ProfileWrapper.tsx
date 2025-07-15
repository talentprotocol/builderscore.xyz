"use client";

import Spinner from "@/app/components/Spinner";
import ProfileActionCards from "@/app/components/rewards/ProfileActionCards";
import ProfileHeader from "@/app/components/rewards/ProfileHeader";
import ProfileTabs from "@/app/components/rewards/ProfileTabs";
import RewardsEarned from "@/app/components/rewards/RewardsEarned";
import { Button } from "@/app/components/ui/button";
import { useSponsor } from "@/app/context/SponsorContext";
import { useUser } from "@/app/context/UserContext";
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
import { ExternalLinkIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ProfileWrapper({
  profile,
  fid,
  className,
  detailed,
  rewards,
}: {
  profile: TalentProfileSearchApi;
  fid: string;
  className?: string;
  detailed?: boolean;
  rewards?: LeaderboardEntry;
}) {
  const { selectedSponsor } = useSponsor();
  const { frameContext } = useUser();
  const router = useRouter();


  const { data: rewardsClient } = useUserLeaderboards(
    ALL_TIME_GRANT,
    profile.id,
  );

  const { data: socials } = useTalentSocials(fid);
  const { data: accounts } = useTalentAccounts(fid);
  const { data: credentials } = useTalentCredentials(fid);
  const { data: contributedProjects } = useTalentContributedProjects(
    fid,
  );

  const farcasterAccount = accounts?.accounts?.find(
    (account) => account.source === "farcaster",
  );

  const ownProfile =
    farcasterAccount?.identifier &&
    frameContext?.user?.fid &&
    farcasterAccount?.identifier === frameContext?.user?.fid.toString();

  const rewardsToUse = rewardsClient || rewards;

  const prefix = selectedSponsor ? `/${selectedSponsor.slug}` : "";

  const [openRewardsEarned, setOpenRewardsEarned] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);

  const handleViewProfile = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsNavigating(true);
    const targetUrl = `${prefix}/${profile.id}`;
    router.push(targetUrl);
  };

  useEffect(() => {
    return () => {
      setIsNavigating(false);
    };
  }, []);

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

      {ownProfile && (
        <Link
          className="w-full"
          href={"https://app.talentprotocol.com/settings"}
        >
          <Button
            size="lg"
            className="button-style w-full cursor-pointer text-xs sm:text-sm"
          >
            Edit Profile on Talent Protocol
            <ExternalLinkIcon className="size-4 opacity-50" />
          </Button>
        </Link>
      )}

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
        <Button
          size="lg"
          className="mb-3 w-full cursor-pointer border border-neutral-300 bg-white text-neutral-800 hover:bg-neutral-100 dark:border-neutral-500 dark:bg-neutral-900 dark:text-white dark:hover:bg-neutral-800"
          onClick={handleViewProfile}
          disabled={isNavigating}
        >
          View Profile {isNavigating && <Spinner />}
        </Button>
      )}
    </div>
  );
}
