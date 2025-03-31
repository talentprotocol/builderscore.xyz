"use client";

import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { useTheme } from '@/app/context/ThemeContext';
import { useUser } from '@/app/context/UserContext';
import Image from 'next/image';
import sdk from '@farcaster/frame-sdk';

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

  const handleAdd = async () => {
    if (frameContext) {
      await sdk.actions.addFrame();
    }
  };

  if (!isVisible) return null;
  if (frameContext?.client.added) {
    return null;
  }

  return (
    <div
      className={`
      ${
        isDarkMode
          ? "bg-neutral-900 border-neutral-800"
          : "bg-white border-neutral-200"
      }
      border`}
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
        {frameContext ? (
          <button
            onClick={handleAdd}
            className={`ml-auto text-sm px-3 py-1.5 rounded-lg ${
              isDarkMode
                ? "bg-white hover:bg-neutral-100 text-black"
                : "bg-black hover:bg-neutral-900 text-white"
            }`}
          >
            Add
          </button>
        ) : (
          <a
            href="https://warpcast.com/talent/0x17e48a8a"
            target="_blank"
            rel="noopener noreferrer"
            className={`ml-auto text-sm px-3 py-1.5 rounded-lg ${
              isDarkMode
                ? "bg-white hover:bg-neutral-100 text-black"
                : "bg-black hover:bg-neutral-900 text-white"
            }`}
          >
            Add
          </a>
        )}
      </div>
    </div>
  );
} 