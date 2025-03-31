"use client";

import { useTheme } from "@/app/context/ThemeContext";
import ExternalLink from "./ExternalLink";

export function Footer() {
  const { isDarkMode } = useTheme();
  
  return (
    <div className="py-6 flex flex-col gap-0 justify-center">
      <p
        className={`text-center ${
          isDarkMode ? "text-neutral-500" : "text-neutral-600"
        } text-xs`}
      >
        Talent Protocol, {new Date().getFullYear()}
      </p>

      <ExternalLink
        href="https://talentprotocol.notion.site/terms-and-conditions-for-builder-rewards-program"
        className={`text-center text-xs underline ${
          isDarkMode ? "text-neutral-500" : "text-neutral-600"
        }`}
      >
        Terms and Conditions
      </ExternalLink>
    </div>
  );
}
