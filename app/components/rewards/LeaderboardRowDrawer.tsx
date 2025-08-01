"use client";

import Spinner from "@/app/components/Spinner";
import DrawerContent from "@/app/components/rewards/DrawerContent";
import { Button } from "@/app/components/ui/button";
import { Drawer, DrawerFooter, DrawerPortal } from "@/app/components/ui/drawer";
import { useSponsor } from "@/app/context/SponsorContext";
import {
  useTalentAccounts,
  useTalentBuilderScore,
} from "@/app/hooks/useTalent";
import { SPONSOR_HOF_MAX_REWARDS } from "@/app/lib/constants";
import {
  INDIVIDUAL_REWARD_AMOUNT_DISPLAY_TOKEN_DECIMALS,
  formatNumber,
} from "@/app/lib/utils";
import { LeaderboardEntry } from "@/app/types/rewards/leaderboards";
import { DialogTitle } from "@radix-ui/react-dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { CrownIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

/* eslint-disable @next/next/no-img-element */

export default function LeaderboardRowDrawer({
  selectedBuilder,
  weekly,
  context,
  onClose,
  isAllTime,
}: {
  selectedBuilder: LeaderboardEntry | null;
  weekly?: boolean;
  context?: string;
  onClose: () => void;
  isAllTime?: boolean;
}) {
  const { data: builderScore } = useTalentBuilderScore(
    selectedBuilder?.profile.id || "",
  );
  const { data: accounts } = useTalentAccounts(
    selectedBuilder?.profile.id || "",
  );

  const { sponsorTokenTicker, selectedSponsor } = useSponsor();

  const router = useRouter();

  const prefix = selectedSponsor ? `/${selectedSponsor.slug}` : "";

  const [isNavigating, setIsNavigating] = useState(false);

  const farcasterAccount = accounts?.accounts?.find(
    (account) => account.source === "farcaster",
  );

  const profileUrlId =
    farcasterAccount?.username || selectedBuilder?.profile.id;

  const handleViewProfile = (e: React.MouseEvent) => {
    e.preventDefault();
    if (selectedBuilder?.profile.id) {
      setIsNavigating(true);
      const targetUrl = `${prefix}/${profileUrlId}`;
      router.push(targetUrl);
    }
  };

  useEffect(() => {
    return () => {
      setIsNavigating(false);
    };
  }, []);

  const isHof =
    selectedBuilder?.reward_amount &&
    parseFloat(selectedBuilder.reward_amount) >=
      SPONSOR_HOF_MAX_REWARDS[
        selectedSponsor?.slug as keyof typeof SPONSOR_HOF_MAX_REWARDS
      ];

  const isHofToUse = isHof || selectedBuilder?.hall_of_fame;

  // Heuristic detection: New builders likely have null ranking_change 
  // (no previous position to compare to) and earned rewards
  const isNewBuilder = 
    !isAllTime && // Only show in weekly/current views, not all-time
    selectedBuilder?.ranking_change === null && 
    selectedBuilder?.reward_amount && 
    parseFloat(selectedBuilder.reward_amount) > 0 &&
    !isHofToUse; // Don't show for HOF builders

  return (
    <Drawer open={!!selectedBuilder} onOpenChange={onClose}>
      <DrawerPortal>
        <VisuallyHidden asChild>
          <DialogTitle>
            {selectedBuilder?.profile.display_name || "Builder"}
          </DialogTitle>
        </VisuallyHidden>
        <DrawerContent className="bg-white dark:bg-neutral-900">
          {selectedBuilder && selectedBuilder.profile && (
            <>
              <div className="flex min-h-0 flex-1 flex-col items-center justify-start p-4 pb-2">
                <img
                  src={
                    selectedBuilder.profile.image_url?.startsWith("http")
                      ? selectedBuilder.profile.image_url
                      : ""
                  }
                  alt={selectedBuilder.profile.display_name || "Builder"}
                  width={80}
                  height={80}
                  className={`mb-3 h-[80px] w-[80px] rounded-full object-cover ${isHofToUse && "border-4 border-yellow-500"}`}
                />

                <p className="mb-3 text-center text-lg text-neutral-800 dark:text-white">
                  <span className="font-medium">
                    {selectedBuilder.profile.display_name || "Builder"}
                  </span>

                  <br />

                  <span className="secondary-text-style text-sm">
                    {context}
                  </span>
                </p>

                {isHofToUse && (
                  <div className="card-style mb-2 w-full">
                    <div className="flex justify-around p-4">
                      <div className="flex flex-col items-center justify-between">
                        <p className="mb-1 flex items-center text-sm">
                          <CrownIcon className="mr-2 size-4 text-yellow-500" />{" "}
                          {selectedSponsor?.name} Hall of Fame
                        </p>

                        <p className="secondary-text-style max-w-xl text-center text-xs">
                          {selectedSponsor?.name}&apos;s{" "}
                          {
                            SPONSOR_HOF_MAX_REWARDS[
                              selectedSponsor?.slug as keyof typeof SPONSOR_HOF_MAX_REWARDS
                            ]
                          }{" "}
                          {sponsorTokenTicker} rewards cap ensures fair
                          distribution of rewards across the entire builder
                          community. Hall of Fame builders continue to be
                          recognized on the leaderboard for their outstanding
                          contributions.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {isNewBuilder && (
                  <div className="card-style mb-2 w-full">
                    <div className="flex justify-around p-4">
                      <div className="flex flex-col items-center justify-between">
                        <p className="mb-1 flex items-center text-sm">
                          <span className="mr-2 text-lg font-semibold text-blue-500">New</span>
                          Builder
                        </p>

                        <p className="secondary-text-style max-w-xl text-center text-xs">
                          We give a temporary booster to builders who haven&apos;t received any Builder Rewards yet.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="card-style w-full">
                  <div className="flex justify-around p-4">
                    <div className="flex flex-col items-center justify-between">
                      <p className="secondary-text-style text-xs">
                        Builder Score
                      </p>
                      <p className="font-mono text-2xl font-medium">
                        {builderScore?.score?.points || "-"}
                      </p>
                    </div>

                    <div className="flex flex-col items-center justify-between">
                      <p className="secondary-text-style text-xs">
                        Rewards Earned
                      </p>
                      <p className="font-mono text-2xl font-medium">
                        {selectedBuilder.reward_amount ? (
                          <>
                            <span>
                              {formatNumber(
                                parseFloat(selectedBuilder.reward_amount),
                                INDIVIDUAL_REWARD_AMOUNT_DISPLAY_TOKEN_DECIMALS[
                                  sponsorTokenTicker
                                ],
                              )}
                            </span>
                            <span className="secondary-text-style ml-2 text-xs font-normal">
                              {sponsorTokenTicker}
                            </span>
                          </>
                        ) : (
                          "-"
                        )}
                      </p>
                    </div>

                    {context && (
                      <div className="flex flex-col items-center justify-between">
                        <p className="secondary-text-style text-xs">
                          {weekly && weekly ? "Weekly" : "All Time"} Rank
                        </p>
                        <p className="font-mono text-lg font-medium">
                          {selectedBuilder.hall_of_fame ? (
                            "-"
                          ) : (
                            <>
                              <span className={`mr-2 font-mono`}>
                                #
                                {selectedBuilder.leaderboard_position
                                  ? selectedBuilder.leaderboard_position
                                  : "-"}
                              </span>

                              <span
                                className={`ml-2 ${
                                  selectedBuilder.ranking_change === null
                                    ? "secondary-text-style"
                                    : selectedBuilder.ranking_change !== 0
                                      ? selectedBuilder.ranking_change < 0
                                        ? "text-red-500"
                                        : "text-green-500"
                                      : "text-neutral-500"
                                }`}
                              >
                                {selectedBuilder.ranking_change !== null
                                  ? selectedBuilder.ranking_change !== 0
                                    ? selectedBuilder.ranking_change < 0
                                      ? `↓ ${Math.abs(selectedBuilder.ranking_change)}`
                                      : `↑ ${Math.abs(selectedBuilder.ranking_change)}`
                                    : "-"
                                  : "-"}
                              </span>
                            </>
                          )}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {!isHofToUse &&
                  !isAllTime &&
                  (selectedBuilder.summary !== null &&
                  selectedBuilder.summary ? (
                    <div className="mt-2 flex min-h-0 w-full flex-1 flex-col rounded-lg border border-neutral-300 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
                      <div className="flex min-h-0 flex-1 flex-col">
                        <p className="secondary-text-style mb-1 text-sm">
                          Summary
                        </p>
                        <div className="scrollbar-hide flex min-h-0 flex-1 flex-col overflow-auto">
                          <p className="text-sm text-neutral-800 dark:text-white">
                            {selectedBuilder.summary}
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : selectedBuilder.reward_amount &&
                    parseFloat(selectedBuilder.reward_amount) > 0 ? (
                    <div className="mt-2 flex min-h-0 w-full flex-1 flex-col rounded-lg border border-neutral-300 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
                      <div className="flex min-h-0 flex-1 flex-col">
                        <p className="secondary-text-style mb-1 text-sm">
                          Summary
                        </p>
                        <div className="scrollbar-hide flex min-h-0 flex-1 flex-col overflow-auto">
                          <p className="text-sm text-neutral-800 dark:text-white">
                            {selectedBuilder.profile.display_name} earned
                            Rewards for transactions on previously deployed
                            verified Smart Contracts.
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : null)}
              </div>

              <DrawerFooter className="pt-0">
                <Button
                  size="lg"
                  className="mb-3 w-full cursor-pointer border border-neutral-300 bg-white text-neutral-800 hover:bg-neutral-100 dark:border-neutral-500 dark:bg-neutral-900 dark:text-white dark:hover:bg-neutral-800"
                  onClick={handleViewProfile}
                  disabled={isNavigating}
                >
                  View Profile {isNavigating && <Spinner />}
                </Button>
              </DrawerFooter>
            </>
          )}
        </DrawerContent>
      </DrawerPortal>
    </Drawer>
  );
}
