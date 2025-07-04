"use client";

import MiniAppExternalLink from "@/app/components/MiniAppExternalLink";
import HowToDrawer from "@/app/components/rewards/HowToDrawer";
import ShareableLeaderboard from "@/app/components/rewards/ShareableLeaderboard";
import { Button } from "@/app/components/ui/button";
import { useGrant } from "@/app/context/GrantContext";
import { useUser } from "@/app/context/UserContext";
import { useUserLeaderboards, useUserProfiles } from "@/app/hooks/useRewards";

export default function Actions() {
  const { selectedGrant } = useGrant();
  const { frameContext } = useUser();

  const { data: userProfileData, isFetched: isFetchedUserProfile } =
    useUserProfiles();
  const { data: userLeaderboardData } = useUserLeaderboards();

  return (
    <div className="grid auto-cols-fr grid-flow-col gap-2 sm:gap-4">
      {isFetchedUserProfile || !frameContext ? (
        <>
          {userProfileData ? (
            !userProfileData.github && (
              <MiniAppExternalLink
                href="https://app.talentprotocol.com/accounts"
                target="_blank"
              >
                <Button
                  size="lg"
                  className="button-style h-6 cursor-pointer pr-3 pl-2 text-xs"
                >
                  <span className="hidden sm:block">Connect GitHub</span>
                  <span className="block sm:hidden">GitHub</span>
                </Button>
              </MiniAppExternalLink>
            )
          ) : (
            <MiniAppExternalLink
              href="https://app.talentprotocol.com"
              target="_blank"
            >
              <Button
                size="lg"
                className="button-style h-6 cursor-pointer pr-3 pl-2 text-xs"
              >
                <span className="hidden sm:block">Sign Up for Talent</span>
                <span className="block sm:hidden">Talent Protocol</span>
              </Button>
            </MiniAppExternalLink>
          )}

          <HowToDrawer />

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
          className="h-6 cursor-pointer border border-neutral-300 bg-white pr-3 pl-2 text-xs text-black hover:bg-neutral-100 dark:border-neutral-500 dark:bg-neutral-900 dark:text-white dark:hover:bg-neutral-800"
        >
          <div className="h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent text-neutral-400 dark:text-neutral-500" />
        </Button>
      )}
    </div>
  );
}
