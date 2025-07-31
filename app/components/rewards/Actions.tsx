"use client";

import MiniAppExternalLink from "@/app/components/MiniAppExternalLink";
import HowToDrawer from "@/app/components/rewards/HowToDrawer";
import ShareableLeaderboard from "@/app/components/rewards/ShareableLeaderboard";
import { Button } from "@/app/components/ui/button";
import { useGrant } from "@/app/context/GrantContext";
import { useSponsor } from "@/app/context/SponsorContext";
import { useUser } from "@/app/context/UserContext";
import { useUserLeaderboards } from "@/app/hooks/useRewards";
import {
  useCurrentTalentProfile,
  useTalentAccounts,
} from "@/app/hooks/useTalent";
import { SPONSOR_FARCASTER_MINI_APP_URLS } from "@/app/lib/constants";
import { TalentAccount } from "@/app/types/talent";
import { useState } from "react";

export default function Actions() {
  const [openHowToDrawer, setOpenHowToDrawer] = useState(false);
  
  const { selectedGrant } = useGrant();
  const { frameContext } = useUser();
  const { selectedSponsor } = useSponsor();

  const { data: userProfileData, isFetched: isFetchedUserProfile } =
    useCurrentTalentProfile();
  const { data: accountsData } = useTalentAccounts(
    userProfileData?.profile.id || "",
  );
  const { data: userLeaderboardData } = useUserLeaderboards();

  const hasGithubAccount = accountsData?.accounts.find(
    (account: TalentAccount) => account.source === "github",
  );

  return (
    <div className="grid auto-cols-fr grid-flow-col gap-2 sm:gap-4">
      {isFetchedUserProfile || !frameContext ? (
        <>
          {userProfileData ? (
            !hasGithubAccount && (
              <MiniAppExternalLink
                href="https://app.talentprotocol.com/accounts"
                target="_blank"
              >
                <Button
                  size="lg"
                  className="button-style mt-2 w-full cursor-pointer pr-3 pl-2 text-xs sm:text-sm"
                >
                  Connect GitHub to Earn More
                </Button>
              </MiniAppExternalLink>
            )
          ) : frameContext ? (
            <MiniAppExternalLink
              href={
                SPONSOR_FARCASTER_MINI_APP_URLS[
                  selectedSponsor?.slug as keyof typeof SPONSOR_FARCASTER_MINI_APP_URLS
                ]
              }
              target="_blank"
            >
              <Button
                size="lg"
                className="button-style mt-2 w-full cursor-pointer pr-3 pl-2 text-xs sm:text-sm"
              >
                Open Mini App
              </Button>
            </MiniAppExternalLink>
          ) : (
            <Button
              size="lg"
              className="button-style mt-2 w-full cursor-pointer pr-3 pl-2 text-xs sm:text-sm"
              onClick={() => setOpenHowToDrawer(true)}
            >
              Start Earning
            </Button>
          )}

          {userLeaderboardData &&
            parseFloat(userLeaderboardData.reward_amount!) > 0 &&
            selectedGrant &&
            ((selectedGrant.tracked && selectedGrant.track_type === "final") ||
              !selectedGrant.tracked) && (
              <ShareableLeaderboard
                id={userLeaderboardData.profile.id}
                grant_id={selectedGrant.id?.toString()}
              />
            )}
        </>
      ) : (
        <Button
          size="lg"
          className="mt-2 w-full cursor-pointer border border-neutral-300 bg-white pr-3 pl-2 text-xs text-black hover:bg-neutral-100 sm:text-sm dark:border-neutral-500 dark:bg-neutral-900 dark:text-white dark:hover:bg-neutral-800"
        >
          <div className="h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent text-neutral-400 dark:text-neutral-500" />
        </Button>
      )}

      <HowToDrawer
        open={openHowToDrawer}
        onOpenChange={setOpenHowToDrawer}
        trigger={false}
      />
    </div>
  );
}
