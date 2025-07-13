"use client";

import Spinner from "@/app/components/Spinner";
import SearchProfileItem from "@/app/components/rewards/SearchProfileItem";
import SearchProfileItemDrawer from "@/app/components/rewards/SearchProfileItemDrawer";
import { Input } from "@/app/components/ui/input";
import { useInfiniteSearchProfiles } from "@/app/hooks/useRewards";
import { TalentProfileSearchApi } from "@/app/types/talent";
import { SearchIcon } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

export default function SearchProfiles() {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [selectedBuilder, setSelectedBuilder] =
    useState<TalentProfileSearchApi | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const {
    data: searchResults,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteSearchProfiles(debouncedQuery);

  const handleScroll = useCallback(() => {
    if (isFetchingNextPage || !hasNextPage) return;

    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const isNearBottom = documentHeight - (scrollTop + windowHeight) < 100;

    if (isNearBottom) {
      fetchNextPage();
    }
  }, [isFetchingNextPage, hasNextPage, fetchNextPage]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const allProfiles =
    searchResults?.pages?.flatMap((page) => page.profiles) || [];

  return (
    <div className="mt-3 flex flex-col gap-3">
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <SearchIcon className="h-4 w-4 text-neutral-400" />
        </div>
        <Input
          type="text"
          placeholder="Search for Builders"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border-style bg-white pl-10"
        />
      </div>

      <div className="space-y-3">
        {error && (
          <div className="py-8 text-center">
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              Error searching Builders.
            </p>
          </div>
        )}

        {!isLoading && !error && allProfiles.length === 0 && (
          <div className="py-8 text-center">
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              No Builders found.
            </p>
          </div>
        )}

        {allProfiles.length > 0 && (
          <div className="card-style flex flex-col">
            {allProfiles.map((profile, index) => (
              <SearchProfileItem
                key={profile.id}
                profile={profile}
                first={index === 0}
                last={index === allProfiles.length - 1}
                onClick={() => setSelectedBuilder(profile)}
              />
            ))}
          </div>
        )}

        {(isFetchingNextPage || isLoading) && (
          <div className="flex items-center justify-center p-4">
            <Spinner />
          </div>
        )}
      </div>

      {selectedBuilder && (
        <SearchProfileItemDrawer
          selectedBuilder={selectedBuilder}
          onClose={() => setSelectedBuilder(null)}
        />
      )}
    </div>
  );
}
