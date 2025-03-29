"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { LeaderboardEntry } from '@/app/types/leaderboards';
import { getLeaderboardEntry } from "@/app/services/leaderboards";
import { useUser } from '@/app/context/UserContext';
import { useGrant } from '@/app/context/GrantContext';
import { useSponsor } from '@/app/context/SponsorContext';

interface LeaderboardContextType {
  userLeaderboard: LeaderboardEntry | null;
  showUserLeaderboard: boolean;
  toggleUserLeaderboard: () => void;
}

const LeaderboardContext = createContext<LeaderboardContextType | undefined>(undefined);

export function LeaderboardProvider({ children }: { children: ReactNode }) {
  const { frameContext, talentProfile } = useUser();
  const { selectedGrant } = useGrant();
  const { selectedSponsor } = useSponsor();
  const [userLeaderboard, setUserLeaderboard] = useState<LeaderboardEntry | null>(null);
  const [showUserLeaderboard, setShowUserLeaderboard] = useState(true);

  const toggleUserLeaderboard = () => setShowUserLeaderboard(prev => !prev);

  useEffect(() => {
    const fetchUserLeaderboard = async () => {
      if (frameContext?.user?.fid && talentProfile?.id) {
        try {
          const entry = await getLeaderboardEntry(
            talentProfile.id.toString(),
            selectedGrant?.id?.toString(),
            selectedSponsor?.slug
          );
          setUserLeaderboard(entry);
        } catch {
          setUserLeaderboard(null);
        }
      }
    };

    fetchUserLeaderboard();
  }, [frameContext?.user?.fid, selectedGrant?.id, selectedSponsor?.slug, talentProfile?.id]);

  return (
    <LeaderboardContext.Provider 
      value={{ 
        userLeaderboard,
        showUserLeaderboard,
        toggleUserLeaderboard
      }}
    >
      {children}
    </LeaderboardContext.Provider>
  );
}

export function useLeaderboard() {
  const context = useContext(LeaderboardContext);
  if (context === undefined) {
    throw new Error('useLeaderboard must be used within a LeaderboardProvider');
  }
  return context;
} 