"use client";

import HowToDrawer from "@/app/components/HowToDrawer";
import { Button } from "@/app/components/ui/button";
import { useUser } from "@/app/context/UserContext";
import { useGrant } from "@/app/context/GrantContext";
import { useLeaderboard } from "@/app/context/LeaderboardContext";
import ExternalLink from "@/app/components/ExternalLink";
import ShareableLeaderboard from "@/app/components/ShareableLeaderboard";
import { useTheme } from "../context/ThemeContext";

export default function RewardsActions() {
  const { talentProfile, hasGithubCredential } = useUser();
  const { selectedGrant } = useGrant();
  const { userLeaderboard } = useLeaderboard();
  const { isDarkMode } = useTheme();
  return (
    <div className="grid auto-cols-fr grid-flow-col gap-4 mt-3 w-full">
      {!hasGithubCredential && (
        <ExternalLink
          href={
            talentProfile
              ? "https://app.talentprotocol.com/settings/connected_accounts"
              : "https://app.talentprotocol.com"
          }
          target="_blank"
          className="w-full"
        >
          <Button
            size="lg"
            className={`bg-white hover:bg-neutral-100 border border-neutral-200 cursor-pointer w-full text-black ${
              isDarkMode ? "bg-neutral-900 hover:bg-neutral-800 border-neutral-300 text-white" : ""
            }`}
          >
            {talentProfile ? "Connect GitHub" : "Sign Up for Talent"}
          </Button>
        </ExternalLink>
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
