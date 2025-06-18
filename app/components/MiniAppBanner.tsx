"use client";

import FarcasterLogo from "@/app/components/logos/FarcasterLogo";
import { useSponsor } from "@/app/context/SponsorContext";
import { useUser } from "@/app/context/UserContext";
import { useUserProfiles } from "@/app/hooks/useRewards";
import { X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function MiniAppBanner({ className }: { className?: string }) {
  const [isVisible, setIsVisible] = useState(true);
  const { frameContext } = useUser();
  const { data: userProfileData } = useUserProfiles();
  const { selectedSponsor } = useSponsor();
  const localStorageKey = "builder-rewards-warpcast-banner-closed";

  useEffect(() => {
    const hasClosedBanner = localStorage.getItem(localStorageKey);
    if (hasClosedBanner) {
      setIsVisible(false);
    }
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    localStorage.setItem(localStorageKey, "true");
  };

  if (!isVisible || frameContext || !userProfileData) return null;

  let appUrl;

  switch (selectedSponsor?.slug) {
    case "base":
      appUrl = "https://warpcast.com/miniapps/003OFAiGOJCy/builder-rewards";
      break;
    case "celo":
      appUrl =
        "https://warpcast.com/miniapps/XhQmVJM8RIeD/celo-builder-rewards";
      break;
    case "talent-protocol":
      appUrl = "https://warpcast.com/miniapps/003OFAiGOJCy/builder-rewards";
      break;
    default:
      appUrl = "https://warpcast.com/miniapps/003OFAiGOJCy/builder-rewards";
  }

  return (
    <div className="border-b border-b-neutral-200 bg-white dark:border-b-neutral-800 dark:bg-neutral-900">
      <div className={`mx-auto flex items-center gap-3 px-4 py-2 ${className}`}>
        <button
          onClick={handleClose}
          className="rounded-full p-1 text-neutral-500 hover:bg-neutral-800 dark:text-neutral-500 dark:hover:bg-neutral-800"
          aria-label="Close banner"
        >
          <X className="h-4 w-4" />
        </button>
        <FarcasterLogo height={36} width={36} color="#855DCD" />
        <div>
          <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
            Add {selectedSponsor?.name} Builder Rewards App
          </p>
          <p className="text-sm text-neutral-500">
            Weekly Rewards for the most impactful builders.
          </p>
        </div>
        <Link
          href={appUrl}
          target="_blank"
          className="ml-auto rounded-lg bg-black px-3 py-1.5 text-sm text-white hover:bg-neutral-900 dark:bg-white dark:text-black dark:hover:bg-neutral-100"
        >
          Add
        </Link>
      </div>
    </div>
  );
}
