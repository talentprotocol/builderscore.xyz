"use client";

import { useSponsor } from "@/app/context/SponsorContext";
import { ALL_TIME_GRANT } from "@/app/lib/constants";
import { Grant } from "@/app/types/rewards/grants";
import { ReactNode, createContext, useContext, useState } from "react";

interface GrantContextType {
  selectedGrant: Grant | null;
  setSelectedGrant: (grant: Grant | null) => void;
  isAllTimeSelected: () => boolean;
}

const GrantContext = createContext<GrantContextType | undefined>(undefined);

export function GrantProvider({
  children,
  initialGrant,
}: {
  children: ReactNode;
  initialGrant: Grant | null;
}) {
  const [selectedGrant, setSelectedGrant] = useState<Grant | null>(
    initialGrant,
  );

  const isAllTimeSelected = () => {
    return selectedGrant === ALL_TIME_GRANT;
  };

  return (
    <GrantContext.Provider
      value={{
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
