"use client";

import { useSponsor } from "@/app/context/SponsorContext";
import { Grant } from "@/app/types/grants";
import { ReactNode, createContext, useContext, useState } from "react";

export const ALL_TIME_GRANT = {
  id: -1,
  start_date: new Date("1970-01-01").toISOString(),
  end_date: new Date("2100-01-01").toISOString(),
  rewards_pool: "",
  token_ticker: "",
  rewarded_builders: 0,
  total_builders: 0,
  avg_builder_score: 0,
  track_type: "intermediate",
  tracked: true,
  sponsor: {
    id: 0,
    name: "all_time",
    slug: "all_time",
    description: "all_time",
    logo_url: "all_time",
    color: "all_time",
    website_url: "all_time",
  },
} as Grant;

interface GrantContextType {
  loadingGrants: boolean;
  setLoadingGrants: (loadingGrants: boolean) => void;
  grants: Grant[];
  setGrants: (grants: Grant[]) => void;
  selectedGrant: Grant | null;
  setSelectedGrant: (grant: Grant | null) => void;
  isAllTimeSelected: () => boolean;
}

const GrantContext = createContext<GrantContextType | undefined>(undefined);

export function GrantProvider({ children }: { children: ReactNode }) {
  const [loadingGrants, setLoadingGrants] = useState(true);
  const [grants, setGrants] = useState<Grant[]>([]);
  const [selectedGrant, setSelectedGrant] = useState<Grant | null>(null);

  const isAllTimeSelected = () => {
    return selectedGrant === ALL_TIME_GRANT;
  };

  return (
    <GrantContext.Provider
      value={{
        loadingGrants,
        setLoadingGrants,
        grants,
        setGrants,
        selectedGrant,
        setSelectedGrant,
        isAllTimeSelected,
      }}
    >
      {children}
    </GrantContext.Provider>
  );
}

export function useGrant() {
  const context = useContext(GrantContext);
  const sponsorContext = useSponsor();

  if (sponsorContext === undefined) {
    throw new Error("useGrant must be used within a SponsorProvider");
  }

  if (context === undefined) {
    throw new Error("useGrant must be used within a GrantProvider");
  }
  return context;
}
