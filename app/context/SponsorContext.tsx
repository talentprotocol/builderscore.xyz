"use client";

import { useSponsors } from "@/app/hooks/useLoadRewards";
import { SPONSORS } from "@/app/lib/constants";
import { getSponsorThemeClassName, getSponsorTicker } from "@/app/lib/theme";
import { Sponsor } from "@/app/types/rewards/sponsors";
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

interface SponsorContextType {
  selectedSponsor: Sponsor | null;
  setSelectedSponsor: (sponsor: Sponsor | null) => void;
  setSelectedSponsorFromSlug: (sponsorSlug: string) => void;
  sponsorTokenTicker: string;
}

const SponsorContext = createContext<SponsorContextType | undefined>(undefined);

export function SponsorProvider({
  children,
  initialSponsor,
}: {
  children: ReactNode;
  initialSponsor: Sponsor | null;
}) {
  const { data: sponsorsData } = useSponsors();

  const [selectedSponsor, setSelectedSponsor] = useState<Sponsor | null>(
    initialSponsor,
  );
  const [sponsorTokenTicker, setSponsorTokenTicker] = useState<string>("");

  const setSelectedSponsorFromSlug = (sponsorSlug: string) => {
    setSelectedSponsor(
      sponsorsData?.sponsors.find((sponsor) => sponsor.slug === sponsorSlug) ||
        null,
    );
  };

  useEffect(() => {
    if (selectedSponsor) {
      // Set the sponsor attribute on the document element
      document.documentElement.setAttribute(
        "data-sponsor",
        selectedSponsor.slug,
      );

      // Set the sponsor token ticker
      const ticker = getSponsorTicker(selectedSponsor?.slug);
      setSponsorTokenTicker(ticker);

      // Remove the old sponsor theme class
      for (const sponsor of Object.keys(SPONSORS)) {
        document.documentElement.classList.remove(
          SPONSORS[sponsor as keyof typeof SPONSORS].themeClassName,
        );
      }

      // Add the new sponsor theme class
      const themeClassName = getSponsorThemeClassName(selectedSponsor.slug);
      document.documentElement.classList.add(themeClassName);
    }
  }, [selectedSponsor]);

  return (
    <SponsorContext.Provider
      value={{
        selectedSponsor,
        setSelectedSponsor,
        setSelectedSponsorFromSlug,
        sponsorTokenTicker,
      }}
    >
      {children}
    </SponsorContext.Provider>
  );
}

export function useSponsor() {
  const context = useContext(SponsorContext);
  if (context === undefined) {
    throw new Error("useSponsor must be used within a SponsorProvider");
  }
  return context;
}
