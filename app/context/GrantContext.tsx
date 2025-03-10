"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Grant } from '@/app/types/grants';
import { getGrants } from '@/app/services/grants';
import { useSponsor } from './SponsorContext';

interface GrantContextType {
  selectedGrant: Grant | null;
  setSelectedGrant: (grant: Grant | null) => void;
  grants: Grant[];
  isLoading: boolean;
  error: string | null;
}

const GrantContext = createContext<GrantContextType | undefined>(undefined);

export function GrantProvider({ children }: { children: ReactNode }) {
  const { selectedSponsorSlug } = useSponsor();
  const [selectedGrant, setSelectedGrant] = useState<Grant | null>(null);
  const [grants, setGrants] = useState<Grant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchGrants() {
      try {
        setIsLoading(true);
        setError(null);
        const params = selectedSponsorSlug !== "global" ? { sponsor_slug: selectedSponsorSlug } : undefined;
        const response = await getGrants(params);        
        setGrants(response.grants);
        setSelectedGrant(null);
      } catch (err) {
        setError('Failed to fetch grants');
        console.error('Error fetching grants:', err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchGrants();
  }, [selectedSponsorSlug]);

  return (
    <GrantContext.Provider 
      value={{ 
        selectedGrant,
        setSelectedGrant,
        grants,
        isLoading,
        error 
      }}
    >
      {children}
    </GrantContext.Provider>
  );
}

export function useGrant() {
  const context = useContext(GrantContext);
  if (context === undefined) {
    throw new Error('useGrant must be used within a GrantProvider');
  }
  return context;
} 