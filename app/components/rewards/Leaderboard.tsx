import Spinner from "@/app/components/Spinner";
import LeaderboardRow from "@/app/components/rewards/LeaderboardRow";
import {
  LeaderboardEntry,
  LeaderboardResponse,
} from "@/app/types/rewards/leaderboards";
import { useCallback, useEffect } from "react";

export default function Leaderboard({
  hallOfFameData,
  leaderboardData,
  onLoadMore,
  hasMore,
  isLoadingMore,
  onBuilderSelect,
  isAllTime,
}: {
  hallOfFameData?: LeaderboardEntry[];
  leaderboardData: LeaderboardResponse;
  onLoadMore: () => void;
  hasMore: boolean;
  isLoadingMore: boolean;
  onBuilderSelect?: (builder: LeaderboardEntry) => void;
  isAllTime?: boolean;
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

  console.log(hallOfFameData);

  return (
    <div className="card-style">
      {hallOfFameData &&
        !isAllTime &&
        hallOfFameData.map((user, index) => (
          <LeaderboardRow
            key={`${user.id}-${user.profile.id}-${index}`}
            leaderboardData={user}
            first={index === 0}
            last={index === hallOfFameData.length - 1}
            onBuilderSelect={onBuilderSelect}
            isAllTime={isAllTime}
            isHofAllTime={true}
          />
        ))}
      {leaderboardData.users.map((user, index) => (
        <LeaderboardRow
          key={`${user.id}-${user.profile.id}-${index}`}
          leaderboardData={user}
          first={
            (!hallOfFameData || hallOfFameData?.length === 0 || isAllTime) &&
            index === 0
          }
          last={index === leaderboardData.users.length - 1}
          onBuilderSelect={onBuilderSelect}
          isAllTime={isAllTime}
        />
      ))}
      {isLoadingMore && (
        <div className="flex items-center justify-center p-4">
          <Spinner />
        </div>
      )}
    </div>
  );
}
