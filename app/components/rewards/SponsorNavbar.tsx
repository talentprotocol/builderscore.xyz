"use client";

import Navbar from "@/app/components/Navbar";
import { useSponsor } from "@/app/context/SponsorContext";

export default function SponsorNavbar({
  sponsor,
  title,
}: {
  sponsor?: string;
  title: string;
}) {
  const { selectedSponsor } = useSponsor();

  let sponsorSlug = sponsor;

  if (selectedSponsor && selectedSponsor?.slug !== sponsor) {
    sponsorSlug = selectedSponsor?.slug;
  }

  return <Navbar title={title} sponsor={sponsorSlug} />;
}
