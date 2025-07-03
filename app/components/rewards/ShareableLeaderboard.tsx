"use client";

import MiniAppExternalLink from "@/app/components/MiniAppExternalLink";
import { Button } from "@/app/components/ui/button";
import { Dialog, DialogContent } from "@/app/components/ui/dialog";
import { ENDPOINTS } from "@/app/config/api";
import { useGrant } from "@/app/context/GrantContext";
import { useUser } from "@/app/context/UserContext";
import { useUserLeaderboards } from "@/app/hooks/useRewards";
import {
  INDIVIDUAL_REWARD_AMOUNT_DISPLAY_TOKEN_DECIMALS,
  formatNumber,
} from "@/app/lib/utils";
import { CopyIcon, ShareIcon } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { FaXTwitter } from "react-icons/fa6";
import { SiFarcaster } from "react-icons/si";

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
  const { frameContext } = useUser();
  const { data: userLeaderboardData } = useUserLeaderboards();
  const { selectedGrant } = useGrant();
  const [open, setOpen] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  const params = new URLSearchParams({
    ...(grant_id && { grant_id }),
    ...(sponsor_slug && { sponsor_slug }),
  });

  const getSummaryForPlatform = (platform: "farcaster" | "twitter") => {
    if (!userLeaderboardData?.summary) return "";
    const maxLength = platform === "farcaster" ? 180 : 75;
    return `\n\n"${userLeaderboardData.summary.slice(0, maxLength)}${userLeaderboardData.summary.length > maxLength ? "..." : ""}"`;
  };

  const rewardsNumber = formatNumber(
    parseFloat(userLeaderboardData?.reward_amount || "0"),
    INDIVIDUAL_REWARD_AMOUNT_DISPLAY_TOKEN_DECIMALS[
      selectedGrant?.token_ticker || ""
    ],
  );

  const baseShareText = `I earned ${rewardsNumber} ${selectedGrant?.token_ticker} for ranking #${userLeaderboardData?.leaderboard_position} on this week's ${selectedGrant?.sponsor.name} Builder Rewards!`;
  const farcasterShareText =
    baseShareText +
    (userLeaderboardData?.summary && userLeaderboardData?.summary !== ""
      ? getSummaryForPlatform("farcaster")
      : "");
  const twitterShareText =
    baseShareText +
    (userLeaderboardData?.summary && userLeaderboardData?.summary !== ""
      ? getSummaryForPlatform("twitter")
      : "");

  const tagsTextFarcaster =
    selectedGrant?.sponsor.slug === "base"
      ? `Sponsored by @base and powered by @talent`
      : `Powered by @talent`;
  const tagsTextTwitter =
    selectedGrant?.sponsor.slug === "base"
      ? `Sponsored by @base and powered by @TalentProtocol`
      : `Powered by @TalentProtocol`;

  const url = `${ENDPOINTS.localApi.builderRewards.leaderboards}/${id}/shareable?${params.toString()}`;
  const shareUrl = `${process.env.NEXT_PUBLIC_BUILDER_REWARDS_URL}/${sponsor_slug}/share/${grant_id}/${id}`;

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
        className="button-style w-full cursor-pointer text-xs sm:text-sm"
        onClick={handleShare}
      >
        <ShareIcon />
        Share
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="flex flex-col gap-2 p-2">
          <div className="relative w-full">
            {imageLoading && (
              <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-neutral-100 dark:bg-neutral-800">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent text-neutral-400 dark:text-neutral-500" />
              </div>
            )}
            <Image
              src={url}
              alt="Shareable Leaderboard"
              width={1620}
              height={1080}
              className="h-full w-full rounded-lg object-contain"
              onLoadingComplete={() => setImageLoading(false)}
            />
          </div>

          <MiniAppExternalLink
            href={`https://warpcast.com/~/compose?text=${encodeURIComponent(
              farcasterShareText + "\n\n" + tagsTextFarcaster,
            )}&embeds[]=${encodeURIComponent(shareUrl)}`}
            target="_blank"
            className="w-full"
          >
            <Button
              size="lg"
              className="w-full cursor-pointer border border-neutral-300 bg-white text-black hover:bg-neutral-100 dark:border-neutral-500 dark:bg-neutral-900 dark:text-white dark:hover:bg-neutral-800"
            >
              <SiFarcaster />
              Share on Warpcast
            </Button>
          </MiniAppExternalLink>

          <MiniAppExternalLink
            href={`https://x.com/intent/tweet?text=${encodeURIComponent(
              twitterShareText + "\n\n" + tagsTextTwitter + "\n\n",
            )}&url=${encodeURIComponent(shareUrl)}`}
            target="_blank"
            className="w-full"
          >
            <Button
              size="lg"
              className="w-full cursor-pointer border border-neutral-300 bg-white text-black hover:bg-neutral-100 dark:border-neutral-500 dark:bg-neutral-900 dark:text-white dark:hover:bg-neutral-800"
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
            className="w-full cursor-pointer border border-neutral-300 bg-white text-black hover:bg-neutral-100 dark:border-neutral-500 dark:bg-neutral-900 dark:text-white dark:hover:bg-neutral-800"
          >
            <CopyIcon />
            Copy Image
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
}
