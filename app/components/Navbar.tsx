"use client";

import SelectSponsor from "@/app/components/rewards/SelectSponsor";
import { SPONSORS } from "@/app/lib/constants";
import Link from "next/link";

export default function Navbar({
  sponsor,
  title,
}: {
  sponsor?: string;
  title: string;
}) {
  const currentSponsor = sponsor
    ? SPONSORS[sponsor]
    : SPONSORS["talent-protocol"];

  const Logo = currentSponsor.logo;

  return (
    <nav className="mb-3 flex items-center justify-between">
      <Link href="/" className="ml-1 flex items-center gap-2">
        <Logo height={15} color={currentSponsor.color} />
        <h1 className="text-foreground font-semibold whitespace-nowrap">
          {title}
        </h1>
      </Link>

      {sponsor && <SelectSponsor />}
    </nav>
  );
}
