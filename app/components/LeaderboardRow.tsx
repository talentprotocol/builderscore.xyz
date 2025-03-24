import Image from "next/image";
import { LeaderboardEntry } from "@/app/types/leaderboards";
import { formatNumber } from "@/app/lib/utils";

export default function LeaderboardRow({
  leaderboardData,
  isHighlighted = false,
  first = false,
  last = false,
  className = "",
  onBuilderSelect,
}: {
  leaderboardData: LeaderboardEntry;
  isHighlighted?: boolean;
  first?: boolean;
  last?: boolean;
  className?: string;
  onBuilderSelect?: (builder: LeaderboardEntry) => void;
}) {
  return (
    <div
      onClick={() => onBuilderSelect?.(leaderboardData)}
      className={`flex items-center justify-between py-2 px-3 pr-5 bg-neutral-900 cursor-pointer
        ${isHighlighted && "border border-primary rounded-lg"}
        ${first && "rounded-t-lg"}
        ${last && "rounded-b-lg"}
        ${!first && "border-t border-neutral-800"}
        ${className}`}
    >
      <div className="flex items-center gap-4">
        <p className="text-neutral-500 text-xs min-w-6 font-mono">
          #{leaderboardData.leaderboard_position}
        </p>

        <span className={`min-w-8 text-xs ${leaderboardData.ranking_change === null ? 'text-neutral-500' : leaderboardData.ranking_change < 0 ? 'text-red-500' : 'text-green-500'}`}>
          {leaderboardData.ranking_change !== null ? (
            leaderboardData.ranking_change < 0 ? `↓ ${leaderboardData.ranking_change}` : `↑ ${leaderboardData.ranking_change}`
          ) : (
            '-'
          )}
        </span>

        <div className="flex items-center gap-4">
          <Image
            src={leaderboardData.user.profile_picture_url}
            alt={
              leaderboardData.user.passport.passport_profile.display_name ||
              "Talent Builder"
            }
            width={isHighlighted ? 48 : 36}
            height={isHighlighted ? 48 : 36}
            className={`rounded-full object-cover h-[36px] w-[36px] ${
              isHighlighted && "border border-primary h-[48px] w-[48px]"
            }`}
          />
          <div>
            <p className="text-white">
              {leaderboardData.user.passport.passport_profile.display_name}
              
              {process.env.NODE_ENV === "development" && (
                <span className="ml-5 text-green-500 text-xs">
                  ID: {leaderboardData.id}
                </span>
              )}
            </p>
          </div>
        </div>
      </div>
      <p className="text-white">
        <span className="font-mono">
          {formatNumber(parseFloat(leaderboardData.reward_amount))}
        </span>
        <span className="text-neutral-500 ml-2 text-xs">$TALENT</span>
      </p>
    </div>
  );
}