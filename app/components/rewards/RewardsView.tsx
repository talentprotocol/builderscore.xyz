"use client";

import Header from "@/app/components/rewards/Header";
import LeaderboardWrapper from "@/app/components/rewards/LeaderboardWrapper";
import { useSponsor } from "@/app/context/SponsorContext";
import { useEffect } from "react";

export default function RewardsView({ sponsor }: { sponsor: string }) {
  const { setSelectedSponsorFromSlug } = useSponsor();

  useEffect(() => {
    if (sponsor) {
      setSelectedSponsorFromSlug(sponsor);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sponsor]);

  return (
    <>
      <Header />
      <LeaderboardWrapper />
    </>
  );
}
