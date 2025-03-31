"use client";

import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { useTheme } from '@/app/context/ThemeContext';
import { useUser } from '@/app/context/UserContext';
import Image from 'next/image';
import Link from 'next/link';
export default function WarpcastBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const { isDarkMode } = useTheme();
  const { frameContext } = useUser();
  const localStorageKey = 'builder-rewards-warpcast-banner-closed';

  useEffect(() => {
    const hasClosedBanner = localStorage.getItem(localStorageKey);
    if (!hasClosedBanner) {
      setIsVisible(true);
    }
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    localStorage.setItem(localStorageKey, 'true');
  };

  if (!isVisible || frameContext) return null;

  return (
    <div
      className={`
      ${
        isDarkMode
          ? "bg-neutral-900 border-b-neutral-800"
          : "bg-white border-b-neutral-200"
      }
      border-b`}
    >
      <div className="flex items-center gap-3 max-w-3xl mx-auto px-4 py-2">
        <button
          onClick={handleClose}
          className={`p-1 rounded-full ${
            isDarkMode
              ? "hover:bg-neutral-800 text-neutral-500"
              : "hover:bg-neutral-100 text-neutral-600"
          }`}
          aria-label="Close banner"
        >
          <X className="w-4 h-4" />
        </button>
        <Image
          src="/images/farcaster_logo_purple.svg"
          alt="Warpcast"
          width={36}
          height={36}
        />
        <div>
          <p
            className={`font-semibold text-sm ${
              isDarkMode ? "text-neutral-100" : "text-neutral-900"
            }`}
          >
            Add Builder Rewards App
          </p>
          <p
            className={`text-sm ${
              isDarkMode ? "text-neutral-500" : "text-neutral-500"
            }`}
          >
            Ship, Earn, Repeat.
          </p>
        </div>
        <Link
          href="https://www.warpcast.com/~/mini-apps/launch?domain=www.builderscore.xyz"
          target="_blank"
          className={`ml-auto text-sm px-3 py-1.5 rounded-lg ${
            isDarkMode
              ? "bg-white hover:bg-neutral-100 text-black"
              : "bg-black hover:bg-neutral-900 text-white"
          }`}
        >
          Add
        </Link>
      </div>
    </div>
  );
} 