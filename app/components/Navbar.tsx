"use client";

import SelectSponsor from "@/app/components/rewards/SelectSponsor";
import { useSponsor } from "@/app/context/SponsorContext";
import Image from "next/image";
import Link from "next/link";

export default function Navbar({ sponsored }: { sponsored?: boolean }) {
  const { selectedSponsor } = useSponsor();

  let sponsorLogo = "";

  switch (selectedSponsor?.slug) {
    case "base":
      sponsorLogo = "/images/base_logo_blue.svg";
      break;
    case "celo":
      sponsorLogo = "/images/celo_logo_black.svg";
      break;
    case "talent-protocol":
      sponsorLogo = "/images/talent_protocol_icon_white.svg";
      break;
  }

  return (
    <nav className="mb-3 flex items-center justify-between">
      <Link href="/" className="ml-1 flex items-center gap-2">
        {sponsorLogo && (
          <Image
            src={sponsorLogo}
            alt="Talent Protocol"
            fill={false}
            height={15}
            width={15}
            style={{ width: "auto", height: "15px" }}
          />
        )}
        <h1 className="text-foreground font-semibold whitespace-nowrap">
          Builder Rewards
        </h1>
      </Link>

      {sponsored && <SelectSponsor />}
    </nav>
  );
}
