"use client";

import { CopyIcon, ShareIcon } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Dialog, DialogContent } from "@/app/components/ui/dialog";
import { useState } from "react";
import Image from "next/image";
import { useTheme } from "@/app/context/ThemeContext";
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
  const [open, setOpen] = useState(false);

  const params = new URLSearchParams({
    ...(grant_id && { grant_id }),
    ...(sponsor_slug && { sponsor_slug }),
  });

  const url = `/api/leaderboards/${id}/shareable?${params.toString()}`;

  return (
    <>
      <Button
        size="lg"
        className="bg-white hover:bg-neutral-100 border border-neutral-200 cursor-pointer w-full text-black"
        onClick={() => setOpen(true)}
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
              navigator.clipboard.writeText(
                `${process.env.NEXT_PUBLIC_BUILDER_REWARDS_URL}/share/${grant_id}/${id}`
              );
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
