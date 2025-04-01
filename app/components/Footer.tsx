"use client";

import { useTheme } from "@/app/context/ThemeContext";
import { useSponsor } from "@/app/context/SponsorContext";
import ExternalLink from "./ExternalLink";

export function Footer() {
  const { isDarkMode } = useTheme();
  const { selectedSponsorSlug, selectedSponsor } = useSponsor();

  return (
    <div className="py-6 flex flex-col gap-0 justify-center">
      <p
        className={`text-center ${
          isDarkMode ? "text-neutral-500" : "text-neutral-600"
        } text-xs`}
      >
        {selectedSponsorSlug !== "talent-protocol" &&
          `Sponsored by ${selectedSponsor?.name} and`}{" "}
        Powered by Talent Protocol
      </p>

      <p
        className={`text-center ${
          isDarkMode ? "text-neutral-500" : "text-neutral-600"
        } text-xs`}
      >
        © {new Date().getFullYear()}{" "}
        <ExternalLink
          href="https://docs.talentprotocol.com/docs/legal/builder-rewards-terms-conditions"
          className={`text-center text-xs underline ${
            isDarkMode ? "text-neutral-500" : "text-neutral-600"
          }`}
        >
          Terms and Conditions
        </ExternalLink>
      </p>
    </div>
  );
}
