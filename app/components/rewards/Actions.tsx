"use client";

import MiniAppExternalLink from "@/app/components/MiniAppExternalLink";
import HowToDrawer from "@/app/components/rewards/HowToDrawer";
import ShareableLeaderboard from "@/app/components/rewards/ShareableLeaderboard";
import { Button } from "@/app/components/ui/button";
import { useGrant } from "@/app/context/GrantContext";
import { useLeaderboard } from "@/app/context/LeaderboardContext";
import { useUser } from "@/app/context/UserContext";

export default function Actions() {
  const { loadingUser, talentProfile, github } = useUser();
  const { selectedGrant } = useGrant();
  const { isLoading, userLeaderboard } = useLeaderboard();

  return (
    <div className="mt-3 grid w-full auto-cols-fr grid-flow-col gap-2 sm:gap-4">
      {loadingUser ? (
        <Button
          size="lg"
          className="cursor-pointer border border-neutral-300 bg-white text-black hover:bg-neutral-100 dark:border-neutral-500 dark:bg-neutral-900 dark:text-white dark:hover:bg-neutral-800"
        >
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent text-neutral-400 dark:text-neutral-500" />
        </Button>
      ) : (
        <>
          {!github && (
            <MiniAppExternalLink
              href={
                talentProfile
                  ? "https://app.talentprotocol.com/accounts"
                  : "https://app.talentprotocol.com"
              }
              target="_blank"
              className="w-full"
            >
              <Button
                size="lg"
                className="button-style w-full cursor-pointer text-xs sm:text-sm"
              >
                <span className="hidden sm:block">
                  {talentProfile ? "Connect GitHub" : "Sign Up for Talent"}
                </span>
                <span className="block sm:hidden">
                  {talentProfile ? "GitHub" : "Talent Protocol"}
                </span>
              </Button>
            </MiniAppExternalLink>
          )}

          <HowToDrawer />

          {!isLoading &&
            userLeaderboard &&
            // userLeaderboard.reward_amount &&
            // parseFloat(userLeaderboard.reward_amount) > 0 &&
            selectedGrant &&
            ((selectedGrant.tracked && selectedGrant.track_type === "final") ||
              !selectedGrant.tracked) && (
              <ShareableLeaderboard
                id={userLeaderboard.profile.id}
                grant_id={selectedGrant.id?.toString()}
              />
            )}
        </>
      )}
    </div>
  );
}
