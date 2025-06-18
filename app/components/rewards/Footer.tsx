"use client";

import MiniAppExternalLink from "@/app/components/MiniAppExternalLink";
import { useSponsor } from "@/app/context/SponsorContext";
import { SPONSOR_TERMS } from "@/app/lib/constants";

export function Footer() {
  const { selectedSponsor } = useSponsor();

  return (
    <div className="flex flex-col justify-center gap-0 py-6">
      <p className="secondary-text-style text-center text-xs">
        {selectedSponsor &&
          selectedSponsor?.slug !== "talent-protocol" &&
          `Sponsored by ${selectedSponsor?.name} and`}{" "}
        Powered by{" "}
        <MiniAppExternalLink
          href="https://www.talentprotocol.com"
          className="text-neutral-600 text-xs text-center underline dark:text-neutral-500"
        >
          Talent Protocol
        </MiniAppExternalLink>
      </p>

      <p className="secondary-text-style text-center text-xs">
        © {new Date().getFullYear()}{" "}
        <MiniAppExternalLink
          href={
            selectedSponsor?.slug
              ? SPONSOR_TERMS[
                  selectedSponsor?.slug as
                    | keyof typeof SPONSOR_TERMS
                    | "default"
                ]
              : SPONSOR_TERMS["default"]
          }
          className="text-center text-xs text-neutral-600 underline dark:text-neutral-500"
        >
          Terms and Conditions
        </MiniAppExternalLink>
      </p>
    </div>
  );
}
