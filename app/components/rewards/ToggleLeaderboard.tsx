"use client";

import { Switch } from "@/app/components/ui/switch";
import { useLeaderboard } from "@/app/context/LeaderboardContext";
import { useTheme } from "@/app/context/ThemeContext";

export default function ToggleLeaderboard() {
  const { showUserLeaderboard, toggleUserLeaderboard } = useLeaderboard();
  const { isDarkMode } = useTheme();

  return (
    <div className="flex items-center gap-1">
      <Switch
        checked={!showUserLeaderboard}
        onCheckedChange={toggleUserLeaderboard}
        className={`data-[state=checked]:bg-green-500 scale-75 ${
          isDarkMode 
            ? "data-[state=unchecked]:bg-neutral-700"
            : "data-[state=unchecked]:bg-neutral-300"
        }`}
      />
      <label className={`text-xs ${isDarkMode ? "text-neutral-500" : "text-neutral-600"}`}>
        Total
      </label>
    </div>
  );
} 