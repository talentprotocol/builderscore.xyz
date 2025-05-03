"use client";

import { useUser } from "@/app/context/UserContext";
import { X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function MiniAppBanner() {
  const [isVisible, setIsVisible] = useState(true);
  const { loadingUser, frameContext } = useUser();
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

  if (!isVisible || frameContext || loadingUser) return null;

  return (
    <div className="border-b border-b-neutral-200 bg-white dark:border-b-neutral-800 dark:bg-neutral-900">
      <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-2">
        <button
          onClick={handleClose}
          className="rounded-full p-1 text-neutral-500 hover:bg-neutral-800 dark:text-neutral-500 dark:hover:bg-neutral-800"
          aria-label="Close banner"
        >
          <X className="h-4 w-4" />
        </button>
        <Image
          src="/images/farcaster_logo_purple.svg"
          alt="Warpcast"
          width={36}
          height={36}
        />
        <div>
          <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
            Add Builder Rewards App
          </p>
          <p className="text-sm text-neutral-500">
            Weekly Rewards for the most impactful builders.
          </p>
        </div>
        <Link
          href="https://www.warpcast.com/~/mini-apps/launch?domain=www.builderscore.xyz"
          target="_blank"
          className="ml-auto rounded-lg bg-black px-3 py-1.5 text-sm text-white hover:bg-neutral-900 dark:bg-white dark:text-black dark:hover:bg-neutral-100"
        >
          Add
        </Link>
      </div>
    </div>
  );
}
