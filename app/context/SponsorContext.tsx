"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { Sponsor } from "@/app/types/sponsors";
import { getSponsors } from "@/app/services/sponsors";
import { useTheme } from "@/app/context/ThemeContext";

interface SponsorContextType {
  selectedSponsor: Sponsor | null;
  selectedSponsorSlug: string;
  setSelectedSponsorSlug: (slug: string) => void;
  sponsors: Sponsor[];
  sponsorToken: string;
  isLoading: boolean;
  error: string | null;
}

const SponsorContext = createContext<SponsorContextType | undefined>(undefined);

export function SponsorProvider({ children }: { children: ReactNode }) {
  const { setIsDarkMode } = useTheme();
  const [selectedSponsorSlug, setSelectedSponsorSlug] = useState<string>("");
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSponsors() {
      try {
        setIsLoading(true);
        setError(null);
        const response = await getSponsors();
        setSponsors(response.sponsors);
      } catch (err) {
        setError(`Failed to fetch sponsors: ${err}`);
      } finally {
        setIsLoading(false);
      }
    }

    fetchSponsors();
  }, []);

  useEffect(() => {
    setIsDarkMode(selectedSponsorSlug !== "base");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSponsorSlug]);

  const selectedSponsor =
    selectedSponsorSlug === "global"
      ? null
      : (sponsors.find((sponsor) => sponsor.slug === selectedSponsorSlug) ??
        null);

  const sponsorToken =
    selectedSponsorSlug === "base"
      ? "ETH"
      : selectedSponsorSlug === "talent-protocol"
        ? "$TALENT"
        : "Tokens";

  return (
    <SponsorContext.Provider
      value={{
        selectedSponsor,
        selectedSponsorSlug,
        setSelectedSponsorSlug,
        sponsors,
        sponsorToken,
        isLoading,
        error,
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
