"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { Grant } from "@/app/types/grants";
import { useSponsor } from "@/app/context/SponsorContext";

interface GrantContextType {
  loadingGrants: boolean;
  setLoadingGrants: (loadingGrants: boolean) => void;
  grants: Grant[];
  setGrants: (grants: Grant[]) => void;
  selectedGrant: Grant | null;
  setSelectedGrant: (grant: Grant | null) => void;
}

const GrantContext = createContext<GrantContextType | undefined>(undefined);

export function GrantProvider({ children }: { children: ReactNode }) {
  const [loadingGrants, setLoadingGrants] = useState(true);
  const [grants, setGrants] = useState<Grant[]>([]);
  const [selectedGrant, setSelectedGrant] = useState<Grant | null>(null);

  const { selectedSponsor } = useSponsor();

  useEffect(() => {
    setLoadingGrants(true);
    setGrants([]);
    setSelectedGrant(null);
  }, [selectedSponsor]);

  return (
    <GrantContext.Provider
      value={{
        loadingGrants,
        setLoadingGrants,
        grants,
        setGrants,
        selectedGrant,
        setSelectedGrant,
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
