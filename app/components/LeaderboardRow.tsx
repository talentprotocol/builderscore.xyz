import Image from "next/image";
import { LeaderboardEntry } from "@/app/types/leaderboards";
import { formatNumber } from "@/app/lib/utils";
import Link from "next/link";

export default function LeaderboardRow(
  {
    leaderboardData,
    isHighlighted = false,
    first = false,
    last = false,
    className = "",
  }: {
    leaderboardData: LeaderboardEntry;
    isHighlighted?: boolean;
    first?: boolean;
    last?: boolean;
    className?: string;
  }) {
    return (
      <Link
        href={`${process.env.NEXT_PUBLIC_TALENT_PROTOCOL_WEBSITE_URL}/profile/${leaderboardData.user.passport.passport_id}`}
        target="_blank"
        rel="noopener noreferrer"
        className={`flex items-center justify-between py-2 px-3 pr-5 bg-neutral-900
          ${isHighlighted && "border border-primary rounded-lg"}
          ${first && "rounded-t-lg"}
          ${last && "rounded-b-lg"}
          ${!first && "border-t border-neutral-800"}
          ${className}`}
      >
        <div className="flex items-center gap-4">
          <Image
            src={leaderboardData.user.profile_picture_url}
            alt={leaderboardData.user.passport.passport_profile.display_name}
            width={isHighlighted ? 48 : 36}
            height={isHighlighted ? 48 : 36}
            className={`rounded-full object-cover h-[36px] w-[36px] ${isHighlighted && "border border-primary h-[48px] w-[48px]"}`}
          />
          <div>
            <p className="text-white">
              {leaderboardData.user.passport.passport_profile.display_name}{" "}
              <span className="text-neutral-400">
                {leaderboardData.user.passport.score}

                {process.env.NODE_ENV === "development" && (
                  <span className="ml-5 text-green-500 text-xs">
                    ID: {leaderboardData.id}
                  </span>
                )}
              </span>
            </p>
            <p className="text-neutral-400">
              {formatNumber(parseFloat(leaderboardData.reward_amount))}
            </p>
          </div>
        </div>
        <p className="text-white">#{leaderboardData.leaderboard_position}</p>
      </Link>
    );
}