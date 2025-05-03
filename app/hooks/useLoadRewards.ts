"use client";

import { useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import { useSponsor } from "@/app/context/SponsorContext";
import { getSponsors } from "@/app/services/sponsors";
import { DEFAULT_SPONSOR_SLUG } from "@/app/lib/constants";
import { useGrant } from "@/app/context/GrantContext";
import { getGrants } from "@/app/services/grants";

export function useLoadRewards() {
  const params = useParams();

  const {
    sponsors,
    setSponsors,
    loadingSponsors,
    setLoadingSponsors,
    setSelectedSponsorFromSlug,
    selectedSponsor,
  } = useSponsor();

  const { setGrants, setLoadingGrants } = useGrant();

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
}
