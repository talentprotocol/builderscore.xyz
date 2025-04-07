"use client";

import { CopyIcon, ShareIcon } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Dialog, DialogContent } from "@/app/components/ui/dialog";
import { useState } from "react";
import Image from "next/image";
import { useTheme } from "@/app/context/ThemeContext";
import { useUser } from "@/app/context/UserContext";
import { useLeaderboard } from "@/app/context/LeaderboardContext";
import { useGrant } from "@/app/context/GrantContext";  
import { sdk } from "@farcaster/frame-sdk";

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

  const shareSummary = `:\n\n${userLeaderboard?.summary}`;
  const shareText = `I'm #${userLeaderboard?.leaderboard_position} on this week's ${selectedGrant?.sponsor.name} Builder Rewards and I've just earned ${userLeaderboard?.reward_amount} ${selectedGrant?.token_ticker}${userLeaderboard?.summary && userLeaderboard?.summary !== "" ? shareSummary : ""}`;

  const url = `/api/leaderboards/${id}/shareable?${params.toString()}`;
  const shareUrl = `${process.env.NEXT_PUBLIC_BUILDER_REWARDS_URL}/share/${grant_id}/${id}`;

  const handleShare = async () => {
    if (frameContext) {
      sdk.actions.ready();
      await sdk.actions.composeCast({
        text: shareText,
        embeds: [shareUrl],
      });
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
        Share on Farcaster
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="p-4 pt-12">
          <Image
            src={url}
            alt="Shareable Leaderboard"
            width={300}
            height={300}
            className="w-full h-full object-contain rounded-lg"
          />

          <Button
            onClick={() => {
              navigator.clipboard.writeText(shareUrl);
              setOpen(false);
            }}
            className={`bg-white hover:bg-neutral-100 border border-neutral-200 cursor-pointer w-full text-black ${
              isDarkMode ? "bg-neutral-900 hover:bg-neutral-800 border-neutral-300 text-white" : ""
            }`}
          >
            <CopyIcon />
            Copy
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
}
