import { LeaderboardResponse } from "@/app/types/leaderboards";
import LeaderboardRow from "./LeaderboardRow";
import { useCallback, useEffect, useRef } from "react";

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
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleScroll = useCallback(() => {
    if (!scrollRef.current || isLoadingMore || !hasMore) return;

    const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
    const isNearBottom = scrollHeight - scrollTop - clientHeight < 50;

    if (isNearBottom) {
      onLoadMore();
    }
  }, [isLoadingMore, hasMore, onLoadMore]);

  useEffect(() => {
    const currentRef = scrollRef.current;
    if (currentRef) {
      currentRef.addEventListener("scroll", handleScroll);
      return () => currentRef.removeEventListener("scroll", handleScroll);
    }
  }, [handleScroll]);

  return (
    <div 
      ref={scrollRef}
      className="flex-auto overflow-y-auto h-0 border border-neutral-800 bg-neutral-900 rounded-lg [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
    >
      {leaderboardData.users.map((user, index) => (
        <LeaderboardRow 
          key={`${user.id}-${user.user.id}-${index}`} 
          leaderboardData={user} 
          first={index === 0} 
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