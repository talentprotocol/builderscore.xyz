"use client";

import { useGrant } from "@/app/context/GrantContext";
import { useLeaderboard } from "@/app/context/LeaderboardContext";
import { useSponsor } from "@/app/context/SponsorContext";
import { useUser } from "@/app/context/UserContext";

export default function RewardsStatus() {
  const { loadingUser } = useUser();
  const { loadingSponsors, selectedSponsor } = useSponsor();
  const { loadingGrants, selectedGrant } = useGrant();
  const {
    isLoading: loadingLeaderboardData,
    loadingLeaderboard,
    leaderboardData,
  } = useLeaderboard();

  const isLoading =
    loadingUser ||
    loadingSponsors ||
    loadingGrants ||
    loadingLeaderboard ||
    loadingLeaderboardData;

  return (
    <div
      className={`mb-2 inline-flex items-center justify-between gap-2 rounded-full border px-2 py-1 ${
        isLoading
          ? "border-gray-500 bg-gray-500/10"
          : "border-green-500/20 bg-green-500/10"
      }`}
    >
      <div className="flex items-center gap-2">
        <div
          className={`h-2 w-2 animate-pulse rounded-full ${isLoading ? "bg-gray-500" : "bg-green-500"}`}
        ></div>
        <span
          className={`text-xs ${isLoading ? "text-gray-500" : "text-green-500"}`}
        >
          Rewards {isLoading ? "Loading..." : "Ready"}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <span
          className={`text-xs ${
            isLoading ? "text-gray-500" : "text-green-500"
          }`}
        >
          User: {!loadingUser ? "Ready" : "Loading..."}
        </span>
        <span
          className={`text-xs ${
            isLoading ? "text-gray-500" : "text-green-500"
          }`}
        >
          Sponsors:{" "}
          {!loadingSponsors ? `Ready (${selectedSponsor?.name})` : "Loading..."}
        </span>
        <span
          className={`text-xs ${
            isLoading ? "text-gray-500" : "text-green-500"
          }`}
        >
          Grants:{" "}
          {!loadingGrants
            ? `Ready (ID: ${selectedGrant ? selectedGrant.id : "All Time"})`
            : "Loading..."}
        </span>
        <span
          className={`text-xs ${
            isLoading ? "text-gray-500" : "text-green-500"
          }`}
        >
          Leaderboard:{" "}
          {!loadingLeaderboard && !loadingLeaderboardData
            ? `Ready (Page: ${leaderboardData?.pagination.current_page})`
            : "Loading..."}
        </span>
      </div>
    </div>
  );
}
