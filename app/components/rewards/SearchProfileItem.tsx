"use client";

import { isEmptyOrInvisible } from "@/app/lib/utils";
import { TalentSearchProfile } from "@/app/types/talent";
import Image from "next/image";

interface SearchProfileItemProps {
  profile: TalentSearchProfile;
  className?: string;
  onClick?: () => void;
  first?: boolean;
  last?: boolean;
}

export default function SearchProfileItem({
  profile,
  className,
  onClick,
  first,
  last,
}: SearchProfileItemProps) {
  return (
    <div
      onClick={onClick}
      className={`flex cursor-pointer items-center justify-between bg-white px-3 py-2 dark:bg-neutral-900 ${first && "rounded-t-lg"} ${last && "rounded-b-lg"} ${!first && "border-t border-neutral-300 dark:border-neutral-800"} ${className}`}
    >
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-4">
          {profile.image_url && profile.image_url.startsWith("https") ? (
            <Image
              src={profile.image_url}
              alt={profile.display_name || "Talent Builder"}
              width={36}
              height={36}
              className="h-[36px] w-[36px] rounded-full object-cover"
            />
          ) : (
            <div className="flex h-[36px] w-[36px] items-center justify-center rounded-full bg-neutral-200 dark:bg-neutral-800">
              <p className="text-sm text-neutral-800 dark:text-white">
                {profile.display_name?.charAt(0).toUpperCase()}
              </p>
            </div>
          )}
          <div>
            <p className="max-w-64 truncate text-sm text-neutral-800 dark:text-white">
              {isEmptyOrInvisible(profile.display_name || "")
                ? profile.id.slice(0, 6) + "..." + profile.id.slice(-4)
                : profile.display_name}

              {process.env.NODE_ENV === "development" && (
                <span className="ml-5 text-xs text-green-500">
                  ID: {profile.id}
                </span>
              )}
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-end bg-white pl-2 text-right">
        <p className="font-mono text-sm text-neutral-800 dark:text-white">
          <span className="font-mono">{profile.builder_score?.points}</span>
        </p>
        <p className="secondary-text-style text-xs text-neutral-800 dark:text-white">
          <span className="secondary-text-style text-xs">Builder Score</span>
        </p>
      </div>
    </div>
  );
}
