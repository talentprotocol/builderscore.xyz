import { LeaderboardResponse } from "@/app/types/leaderboards";
import LeaderboardRow from "./LeaderboardRow";
import { useCallback, useEffect } from "react";

export default function Leaderboard({
  leaderboardData,
  onLoadMore,
  hasMore,
  isLoadingMore,
}: {
  leaderboardData: LeaderboardResponse;
  onLoadMore: () => void;
  hasMore: boolean;
  isLoadingMore: boolean;
}) {
  const handleScroll = useCallback(() => {
    if (isLoadingMore || !hasMore) return;

    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const isNearBottom = documentHeight - (scrollTop + windowHeight) < 100;

    if (isNearBottom) {
      onLoadMore();
    }
  }, [isLoadingMore, hasMore, onLoadMore]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  return (
    <div 
      className="border border-neutral-800 bg-neutral-900 rounded-lg"
    >
      {leaderboardData.users.map((user, index) => (
        <LeaderboardRow 
          key={`${user.id}-${user.user.id}-${index}`} 
          leaderboardData={user} 
          first={index === 0}
          last={index === leaderboardData.users.length - 1}
        />
      ))}
      {isLoadingMore && (
        <div className="flex items-center justify-center p-4">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent text-neutral-400" />
        </div>
      )}
    </div>
  );
}