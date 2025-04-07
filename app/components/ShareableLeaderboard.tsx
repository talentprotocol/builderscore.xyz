"use client";

import { CopyIcon, ShareIcon } from "lucide-react";
import { SiFarcaster } from "react-icons/si";
import { FaXTwitter } from "react-icons/fa6";
import { Button } from "@/app/components/ui/button";
import { Dialog, DialogContent } from "@/app/components/ui/dialog";
import { useState } from "react";
import Image from "next/image";
import ExternalLink from "@/app/components/ExternalLink";
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

  const params = new URLSearchParams({
    ...(grant_id && { grant_id }),
    ...(sponsor_slug && { sponsor_slug }),
  });

  const shareSummary = `\n\n"${userLeaderboard?.summary}"`;
  const rewardsNumber = formatNumber(
    parseFloat(userLeaderboard?.reward_amount || "0"),
    INDIVIDUAL_REWARD_AMOUNT_DISPLAY_TOKEN_DECIMALS[selectedGrant?.token_ticker || ""]
  );
  const shareText = `I earned ${rewardsNumber} ${selectedGrant?.token_ticker} for ranking #${userLeaderboard?.leaderboard_position} on this week's ${selectedGrant?.sponsor.name} Builder Rewards.${userLeaderboard?.summary && userLeaderboard?.summary !== "" ? shareSummary : ""}\n\nBuild on ${selectedGrant?.sponsor.name} and be Rewarded!`;

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
        className="bg-white hover:bg-neutral-100 border border-neutral-200 cursor-pointer w-full text-black"
        onClick={handleShare}
      >
        <ShareIcon />
        Share
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="p-4 pt-12 flex flex-col gap-2">
          <Image
            src={url}
            alt="Shareable Leaderboard"
            width={300}
            height={300}
            className="w-full h-full object-contain rounded-lg"
          />

          <ExternalLink
            href={`https://warpcast.com/~/compose?text=${encodeURIComponent(
              shareText
            )}&embeds[]=${encodeURIComponent(shareUrl)}`}
            target="_blank"
            className="w-full"
          >
            <Button
              size="lg"
              className={`bg-white hover:bg-neutral-100 border border-neutral-200 cursor-pointer w-full text-black ${
                isDarkMode
                  ? "bg-neutral-900 hover:bg-neutral-800 border-neutral-300 text-white"
                  : ""
              }`}
            >
              <SiFarcaster />
              Share on Warpcast
            </Button>
          </ExternalLink>

          <ExternalLink
            href={`https://x.com/intent/tweet?text=${encodeURIComponent(
              shareText + "\n\n"
            )}&url=${encodeURIComponent(shareUrl)}`}
            target="_blank"
            className="w-full"
          >
            <Button
              size="lg"
              className={`bg-white hover:bg-neutral-100 border border-neutral-200 cursor-pointer w-full text-black ${
                isDarkMode
                  ? "bg-neutral-900 hover:bg-neutral-800 border-neutral-300 text-white"
                  : ""
              }`}
            >
              <FaXTwitter />
              Share on X
            </Button>
          </ExternalLink>

          <Button
            onClick={() => {
              navigator.clipboard.writeText(shareUrl);
              setOpen(false);
            }}
            className={`bg-white hover:bg-neutral-100 border border-neutral-200 cursor-pointer w-full text-black ${
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
