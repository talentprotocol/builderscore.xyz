"use client";

import Actions from "@/app/components/rewards/Actions";
import Header from "@/app/components/rewards/Header";
import LeaderboardWrapper from "@/app/components/rewards/LeaderboardWrapper";
import { useSponsor } from "@/app/context/SponsorContext";
import { useUser } from "@/app/context/UserContext";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function RewardsView({ sponsor }: { sponsor: string }) {
  const { setSelectedSponsorFromSlug } = useSponsor();
  const { setSimulatedFid } = useUser();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (sponsor) {
      setSelectedSponsorFromSlug(sponsor);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sponsor]);

  useEffect(() => {
    const fidParam = searchParams.get("fid");

    if (fidParam) {
      const fid = parseInt(fidParam);
      if (!isNaN(fid)) {
        setSimulatedFid(fid);
      }
    }
  }, [searchParams, setSimulatedFid]);

  return (
    <>
      <Header />
      <Actions />
      <LeaderboardWrapper />
    </>
  );
}
