"use client";

import { ClientOnly } from "@/app/components/ClientOnly";
import { useGrant } from "@/app/context/GrantContext";
import { useSponsor } from "@/app/context/SponsorContext";
import {
  useGrants,
  useLeaderboards,
  useSponsors,
  useUserProfiles,
} from "@/app/hooks/useLoadRewards";

export default function RewardsStatus() {
  const { isLoading: loadingUser } = useUserProfiles();
  const { isLoading: loadingSponsors } = useSponsors();
  const { selectedSponsor } = useSponsor();
  const { selectedGrant } = useGrant();
  const { isLoading: loadingGrants } = useGrants();
  const { data: leaderboardData, isLoading: loadingLeaderboard } =
    useLeaderboards();

  const isLoading =
    loadingUser ||
    loadingSponsors ||
    loadingGrants ||
    loadingLeaderboard ||
    loadingLeaderboard;

  return (
    <ClientOnly>
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
            className={`text-xs ${isLoading ? "text-neutral-500" : "text-green-500"}`}
          >
            Rewards {isLoading ? "Loading..." : "Ready"}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`text-xs ${
              isLoading ? "text-neutral-500" : "text-green-500"
            }`}
          >
            User: {!loadingUser ? "Ready" : "Loading..."}
          </span>
          <span
            className={`text-xs ${
              isLoading ? "text-neutral-500" : "text-green-500"
            }`}
          >
            Sponsors:{" "}
            {!loadingSponsors
              ? `Ready (${selectedSponsor?.name})`
              : "Loading..."}
          </span>
          <span
            className={`text-xs ${
              isLoading ? "text-neutral-500" : "text-green-500"
            }`}
          >
            Grants:{" "}
            {!loadingGrants
              ? `Ready (ID: ${selectedGrant ? selectedGrant.id : "All Time"})`
              : "Loading..."}
          </span>
          <span
            className={`text-xs ${
              isLoading ? "text-neutral-500" : "text-green-500"
            }`}
          >
            Leaderboard:{" "}
            {!loadingLeaderboard
              ? `Ready (Page: ${leaderboardData?.pages[0].pagination.current_page})`
              : "Loading..."}
          </span>
        </div>
      </div>
    </ClientOnly>
  );
}
