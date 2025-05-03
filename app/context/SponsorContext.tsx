"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { Sponsor } from "@/app/types/sponsors";
import { useTheme } from "@/app/context/ThemeContext";

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
  const { setIsDarkMode } = useTheme();
  const [loadingSponsors, setLoadingSponsors] = useState(true);
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [selectedSponsor, setSelectedSponsor] = useState<Sponsor | null>(null);
  const [sponsorTokenTicker, setSponsorTokenTicker] = useState<string>("");

  useEffect(() => {
    setIsDarkMode(selectedSponsor?.slug !== "base");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSponsor]);

  const setSelectedSponsorFromSlug = (sponsorSlug: string) => {
    setSelectedSponsor(
      sponsors.find((sponsor) => sponsor.slug === sponsorSlug) || null
    );
  };

  useEffect(() => {
    let ticker;
    switch (selectedSponsor?.slug) {
      case "base":
        ticker = "ETH";
        break;
      case "talent-protocol":
        ticker = "$TALENT";
        break;
      default:
        ticker = "Tokens";
    }
    setSponsorTokenTicker(ticker);
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
