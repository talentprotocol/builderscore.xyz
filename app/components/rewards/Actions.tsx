"use client";

import MiniAppExternalLink from "@/app/components/MiniAppExternalLink";
import HowToDrawer from "@/app/components/rewards/HowToDrawer";
import ShareableLeaderboard from "@/app/components/rewards/ShareableLeaderboard";
import { Button } from "@/app/components/ui/button";
import { useGrant } from "@/app/context/GrantContext";
import { useLeaderboard } from "@/app/context/LeaderboardContext";
import { useUser } from "@/app/context/UserContext";

export default function Actions() {
  const { talentProfile, hasGithubCredential } = useUser();
  const { selectedGrant } = useGrant();
  const { userLeaderboard } = useLeaderboard();
  return (
    <div className="mt-3 grid w-full auto-cols-fr grid-flow-col gap-4">
      {!hasGithubCredential && (
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
            className="w-full cursor-pointer border border-neutral-300 bg-white text-black hover:bg-neutral-100 dark:border-neutral-500 dark:bg-neutral-900 dark:text-white dark:hover:bg-neutral-800"
          >
            {talentProfile ? "Connect GitHub" : "Sign Up for Talent"}
          </Button>
        </MiniAppExternalLink>
      )}

      <HowToDrawer />

      {userLeaderboard &&
        selectedGrant &&
        ((selectedGrant.tracked && selectedGrant.track_type === "final") ||
          !selectedGrant.tracked) && (
          <ShareableLeaderboard
            id={userLeaderboard.profile.id}
            grant_id={selectedGrant.id?.toString()}
          />
        )}
    </div>
  );
}
