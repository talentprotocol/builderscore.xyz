"use client";

import MiniAppExternalLink from "@/app/components/MiniAppExternalLink";
import { useSponsor } from "@/app/context/SponsorContext";

export function Footer() {
  const { selectedSponsor } = useSponsor();

  return (
    <div className="flex flex-col justify-center gap-0 py-6">
      <p className="text-center text-xs text-neutral-600 dark:text-neutral-500">
        {selectedSponsor &&
          selectedSponsor?.slug !== "talent-protocol" &&
          `Sponsored by ${selectedSponsor?.name} and`}{" "}
        Powered by Talent Protocol
      </p>

      <p className="text-center text-xs text-neutral-600 dark:text-neutral-500">
        © {new Date().getFullYear()}{" "}
        <MiniAppExternalLink
          href="https://docs.talentprotocol.com/docs/legal/builder-rewards-terms-conditions"
          className="text-center text-xs text-neutral-600 underline dark:text-neutral-500"
        >
          Terms and Conditions
        </MiniAppExternalLink>
      </p>
    </div>
  );
}
