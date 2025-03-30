"use client";

import Link from "next/link";
import { useTheme } from "@/app/context/ThemeContext";

export function Footer() {
  const { isDarkMode } = useTheme();
  
  return (
    <div className="py-6 flex flex-col gap-0 justify-center">
      <p
        className={`text-center ${
          isDarkMode ? "text-neutral-500" : "text-neutral-600"
        } text-xs`}
      >
        <Link
          href="https://talentprotocol.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          Talent Protocol
        </Link>
        , {new Date().getFullYear()}
      </p>

      <Link
        href="https://talentprotocol.notion.site/terms-and-conditions-for-builder-rewards-program"
        target="_blank"
        rel="noopener noreferrer"
        className={`text-center text-xs underline ${
          isDarkMode ? "text-neutral-500" : "text-neutral-600"
        }`}
      >
        Terms and Conditions
      </Link>
    </div>
  );
}
