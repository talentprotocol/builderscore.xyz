"use client";

import { ReactNode, createContext, useContext, useState } from "react";

interface LeaderboardContextType {
  showUserLeaderboard: boolean;
  toggleUserLeaderboard: () => void;
}

const LeaderboardContext = createContext<LeaderboardContextType | undefined>(
  undefined,
);

export function LeaderboardProvider({ children }: { children: ReactNode }) {
  const [showUserLeaderboard, setShowUserLeaderboard] = useState(true);

  const toggleUserLeaderboard = () => setShowUserLeaderboard((prev) => !prev);

  return (
    <LeaderboardContext.Provider
      value={{
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
