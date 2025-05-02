"use client";

import { CopyIcon, ShareIcon } from "lucide-react";
import { SiFarcaster } from "react-icons/si";
import { FaXTwitter } from "react-icons/fa6";
import { Button } from "@/app/components/ui/button";
import { Dialog, DialogContent } from "@/app/components/ui/dialog";
import { useState } from "react";
import Image from "next/image";
import MiniAppExternalLink from "@/app/components/MiniAppExternalLink";
import { useTheme } from "@/app/context/ThemeContext";
import { useUser } from "@/app/context/UserContext";
import { useLeaderboard } from "@/app/context/LeaderboardContext";
import { useGrant } from "@/app/context/GrantContext";  
import {
  formatNumber,
  INDIVIDUAL_REWARD_AMOUNT_DISPLAY_TOKEN_DECIMALS,
} from "@/app/lib/utils";
// import { sdk } from "@farcaster/frame-sdk";

export default function ShareableLeaderboard({
  id,
  grant_id,
  sponsor_slug,
}: {
  id: string;
  grant_id?: string;
  sponsor_slug?: string;
}) {
  const { isDarkMode } = useTheme();
  const { frameContext } = useUser();
  const { userLeaderboard } = useLeaderboard();
  const { selectedGrant } = useGrant();
  const [open, setOpen] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  const params = new URLSearchParams({
    ...(grant_id && { grant_id }),
    ...(sponsor_slug && { sponsor_slug }),
  });

  const getSummaryForPlatform = (platform: 'farcaster' | 'twitter') => {
    if (!userLeaderboard?.summary) return '';
    const maxLength = platform === 'farcaster' ? 180 : 75;
    return `\n\n"${userLeaderboard.summary.slice(0, maxLength)}${userLeaderboard.summary.length > maxLength ? '...' : ''}"`;
  };

  const rewardsNumber = formatNumber(
    parseFloat(userLeaderboard?.reward_amount || "0"),
    INDIVIDUAL_REWARD_AMOUNT_DISPLAY_TOKEN_DECIMALS[selectedGrant?.token_ticker || ""]
  );
  
  const baseShareText = `I earned ${rewardsNumber} ${selectedGrant?.token_ticker} for ranking #${userLeaderboard?.leaderboard_position} on this week's ${selectedGrant?.sponsor.name} Builder Rewards!`;
  const farcasterShareText = baseShareText + (userLeaderboard?.summary && userLeaderboard?.summary !== "" ? getSummaryForPlatform('farcaster') : "");
  const twitterShareText = baseShareText + (userLeaderboard?.summary && userLeaderboard?.summary !== "" ? getSummaryForPlatform('twitter') : "");
  
  const tagsTextFarcaster =
    selectedGrant?.sponsor.slug === "base"
      ? `Sponsored by @base and powered by @talent`
      : `Powered by @talent`;
  const tagsTextTwitter =
    selectedGrant?.sponsor.slug === "base"
      ? `Sponsored by @base and powered by @TalentProtocol`
      : `Powered by @TalentProtocol`;

  const url = `/api/leaderboards/${id}/shareable?${params.toString()}`;
  const shareUrl = `${process.env.NEXT_PUBLIC_BUILDER_REWARDS_URL}/share/${grant_id}/${id}`;

  const handleShare = async () => {
    if (frameContext) {
      // TODO: Implement this when composeCast works
      // sdk.actions.ready();
      // await sdk.actions.composeCast({
      //   text: shareText,
      //   embeds: [shareUrl],
      // });

      setOpen(true);
    } else {
      setOpen(true);
    }
  };

  return (
    <>
      <Button
        size="lg"
        className="bg-white hover:bg-neutral-100 border border-neutral-300 cursor-pointer w-full text-black"
        onClick={handleShare}
      >
        <ShareIcon />
        Share
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="p-2 flex flex-col gap-2">
          <div className="relative w-full">
            {imageLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-neutral-100 dark:bg-neutral-800 rounded-lg">
                <div
                  className={`h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent ${
                    isDarkMode ? "text-neutral-500" : "text-neutral-400"
                  }`}
                />
              </div>
            )}
            <Image
              src={url}
              alt="Shareable Leaderboard"
              width={1620}
              height={1080}
              className="w-full h-full object-contain rounded-lg"
              onLoadingComplete={() => setImageLoading(false)}
            />
          </div>

          <MiniAppExternalLink
            href={`https://warpcast.com/~/compose?text=${encodeURIComponent(
              farcasterShareText + "\n\n" + tagsTextFarcaster
            )}&embeds[]=${encodeURIComponent(shareUrl)}`}
            target="_blank"
            className="w-full"
          >
            <Button
              size="lg"
              className={`bg-white hover:bg-neutral-100 border border-neutral-300 cursor-pointer w-full text-black ${
                isDarkMode
                  ? "bg-neutral-900 hover:bg-neutral-800 border-neutral-300 text-white"
                  : ""
              }`}
            >
              <SiFarcaster />
              Share on Warpcast
            </Button>
          </MiniAppExternalLink>

          <MiniAppExternalLink
            href={`https://x.com/intent/tweet?text=${encodeURIComponent(
              twitterShareText + "\n\n" + tagsTextTwitter + "\n\n"
            )}&url=${encodeURIComponent(shareUrl)}`}
            target="_blank"
            className="w-full"
          >
            <Button
              size="lg"
              className={`bg-white hover:bg-neutral-100 border border-neutral-300 cursor-pointer w-full text-black ${
                isDarkMode
                  ? "bg-neutral-900 hover:bg-neutral-800 border-neutral-300 text-white"
                  : ""
              }`}
            >
              <FaXTwitter />
              Share on X
            </Button>
          </MiniAppExternalLink>

          <Button
            onClick={() => {
              navigator.clipboard.writeText(shareUrl);
              setOpen(false);
            }}
            className={`bg-white hover:bg-neutral-100 border border-neutral-300 cursor-pointer w-full text-black ${
              isDarkMode
                ? "bg-neutral-900 hover:bg-neutral-800 border-neutral-300 text-white"
                : ""
            }`}
          >
            <CopyIcon />
            Copy Image
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
}
