"use client";

import { useGrant } from "@/app/context/GrantContext";
import { useLeaderboard } from "@/app/context/LeaderboardContext";
import { useSponsor } from "@/app/context/SponsorContext";
import { useUser } from "@/app/context/UserContext";
import { DEFAULT_SPONSOR_SLUG } from "@/app/lib/constants";
import { getGrants } from "@/app/services/grants";
import { getLeaderboardEntry } from "@/app/services/leaderboards";
import { getSponsors } from "@/app/services/sponsors";
import { useParams } from "next/navigation";
import { useCallback, useEffect } from "react";

export function useLoadRewards() {
  const params = useParams();
  const { loadingUser, frameContext, talentProfile } = useUser();
  const {
    sponsors,
    setSponsors,
    loadingSponsors,
    setLoadingSponsors,
    setSelectedSponsorFromSlug,
    selectedSponsor,
  } = useSponsor();

  const { selectedGrant, setGrants, setLoadingGrants } = useGrant();
  const { setLoadingLeaderboard, setUserLeaderboard } = useLeaderboard();

  const fetchSponsors = useCallback(async () => {
    setLoadingSponsors(true);
    const response = await getSponsors();
    if (response) {
      setSponsors(response.sponsors);
    }
    setLoadingSponsors(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchGrants = useCallback(async () => {
    if (!loadingSponsors) {
      setLoadingGrants(true);
      const response = await getGrants({
        sponsor_slug: selectedSponsor?.slug,
      });
      if (response) {
        setGrants(response.grants);
      }
      setLoadingGrants(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSponsor]);

  const fetchUserLeaderboard = useCallback(async () => {
    setLoadingLeaderboard(true);
    if (!loadingUser && talentProfile) {
      try {
        const entry = await getLeaderboardEntry(
          talentProfile.id.toString(),
          selectedGrant?.id?.toString(),
          selectedSponsor?.slug,
        );
        setUserLeaderboard(entry);
      } catch {
        setUserLeaderboard(null);
      } finally {
        setLoadingLeaderboard(false);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [frameContext, selectedGrant, selectedSponsor, talentProfile]);

  useEffect(() => {
    if (sponsors.length > 0) {
      const sponsorSlug = params.sponsor as string | undefined;
      setSelectedSponsorFromSlug(sponsorSlug || DEFAULT_SPONSOR_SLUG);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sponsors, params.sponsor]);

  useEffect(() => {
    fetchSponsors();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetchGrants();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSponsor]);

  useEffect(() => {
    fetchUserLeaderboard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [frameContext, selectedGrant, selectedSponsor, talentProfile]);
}
