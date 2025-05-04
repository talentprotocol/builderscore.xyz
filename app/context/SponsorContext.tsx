"use client";

import { SPONSORS } from "@/app/lib/constants";
import { getSponsorThemeClassName, getSponsorTicker } from "@/app/lib/theme";
import { Sponsor } from "@/app/types/sponsors";
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

interface SponsorContextType {
  loadingSponsors: boolean;
  setLoadingSponsors: (loadingSponsors: boolean) => void;
  sponsors: Sponsor[];
  setSponsors: (sponsors: Sponsor[]) => void;
  selectedSponsor: Sponsor | null;
  setSelectedSponsor: (sponsor: Sponsor | null) => void;
  setSelectedSponsorFromSlug: (sponsorSlug: string) => void;
  sponsorTokenTicker: string;
}

const SponsorContext = createContext<SponsorContextType | undefined>(undefined);

export function SponsorProvider({ children }: { children: ReactNode }) {
  const [loadingSponsors, setLoadingSponsors] = useState(true);
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [selectedSponsor, setSelectedSponsor] = useState<Sponsor | null>(null);
  const [sponsorTokenTicker, setSponsorTokenTicker] = useState<string>("");

  const setSelectedSponsorFromSlug = (sponsorSlug: string) => {
    setSelectedSponsor(
      sponsors.find((sponsor) => sponsor.slug === sponsorSlug) || null,
    );
  };

  useEffect(() => {
    if (selectedSponsor) {
      const ticker = getSponsorTicker(selectedSponsor?.slug);
      setSponsorTokenTicker(ticker);

      for (const sponsor of Object.keys(SPONSORS)) {
        document.documentElement.classList.remove(
          SPONSORS[sponsor as keyof typeof SPONSORS].themeClassName,
        );
      }

      const themeClassName = getSponsorThemeClassName(selectedSponsor.slug);
      document.documentElement.classList.add(themeClassName);
    }
  }, [selectedSponsor]);

  return (
    <SponsorContext.Provider
      value={{
        loadingSponsors,
        setLoadingSponsors,
        sponsors,
        setSponsors,
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
