"use client";

import Header from "@/app/components/rewards/Header";
import LeaderboardWrapper from "@/app/components/rewards/LeaderboardWrapper";
import { useGrant } from "@/app/context/GrantContext";
import { useSponsor } from "@/app/context/SponsorContext";
import { useGrants } from "@/app/hooks/useRewards";
import { useEffect } from "react";

export default function RewardsView({ sponsor }: { sponsor: string }) {
  const { setSelectedSponsorFromSlug } = useSponsor();
  const { setSelectedGrant } = useGrant();
  const { data: grantsData } = useGrants();

  useEffect(() => {
    if (sponsor) {
      setSelectedSponsorFromSlug(sponsor);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sponsor]);

  useEffect(() => {
    setSelectedGrant(grantsData?.grants[0] || null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Header />
      <LeaderboardWrapper />
    </>
  );
}
