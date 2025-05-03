"use client";

import { LeaderboardEntry } from "@/app/types/leaderboards";
import { ReactNode, createContext, useContext, useState } from "react";

interface LeaderboardContextType {
  loadingLeaderboard: boolean;
  setLoadingLeaderboard: (loadingLeaderboard: boolean) => void;
  userLeaderboard: LeaderboardEntry | null;
  setUserLeaderboard: (leaderboard: LeaderboardEntry | null) => void;
  showUserLeaderboard: boolean;
  toggleUserLeaderboard: () => void;
}

const LeaderboardContext = createContext<LeaderboardContextType | undefined>(
  undefined,
);

export function LeaderboardProvider({ children }: { children: ReactNode }) {
  const [loadingLeaderboard, setLoadingLeaderboard] = useState(true);
  const [userLeaderboard, setUserLeaderboard] =
    useState<LeaderboardEntry | null>(null);
  const [showUserLeaderboard, setShowUserLeaderboard] = useState(true);

  const toggleUserLeaderboard = () => setShowUserLeaderboard((prev) => !prev);

  return (
    <LeaderboardContext.Provider
      value={{
        loadingLeaderboard,
        setLoadingLeaderboard,
        userLeaderboard,
        setUserLeaderboard,
        showUserLeaderboard,
        toggleUserLeaderboard,
      }}
    >
      {children}
    </LeaderboardContext.Provider>
  );
}

export function useLeaderboard() {
  const context = useContext(LeaderboardContext);
  if (context === undefined) {
    throw new Error("useLeaderboard must be used within a LeaderboardProvider");
  }
  return context;
}
