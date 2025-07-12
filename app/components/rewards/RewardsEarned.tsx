"use client";

import ActionCard from "@/app/components/ActionCard";
import Spinner from "@/app/components/Spinner";
import ListItem from "@/app/components/rewards/ListItem";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerPortal,
  DrawerTitle,
} from "@/app/components/ui/drawer";
import { useSponsor } from "@/app/context/SponsorContext";
import {
  useLeaderboardsEarnings,
  useUserLeaderboards,
} from "@/app/hooks/useRewards";
import {
  ALL_TIME_GRANT,
  SPONSORS,
  SPONSOR_SCANNER_BASE_URL,
} from "@/app/lib/constants";
import {
  INDIVIDUAL_REWARD_AMOUNT_DISPLAY_TOKEN_DECIMALS,
  formatDate,
  formatNumber,
} from "@/app/lib/utils";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { useCallback, useEffect } from "react";

// TODO: - Improve API to return data for the selected sponsor;
//       - Fix total rewards earned to not include ongoing grants.
export default function RewardsEarned({
  open,
  setOpen,
  profileId,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  profileId: string;
}) {
  const { data: rewardsData } = useUserLeaderboards(ALL_TIME_GRANT, profileId);
  const { selectedSponsor, sponsorTokenTicker } = useSponsor();

  const {
    data: leaderboardEarnings,
    error: leaderboardEarningsError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useLeaderboardsEarnings(profileId);

  console.log(leaderboardEarnings);

  // Flatten all pages into a single array of users
  const allEarnings =
    leaderboardEarnings?.pages.flatMap((page) => page.users) || [];

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
    if (open) {
      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    }
  }, [handleScroll, open]);

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerPortal>
        <DrawerContent className="bg-white dark:bg-neutral-900">
          <ScrollArea className="scrollbar-hide max-w-full overflow-y-scroll">
            <DrawerHeader className="text-left">
              <DrawerTitle className="text-neutral-800 dark:text-white">
                Transaction History
              </DrawerTitle>
            </DrawerHeader>

            <div className="flex flex-col gap-4 p-4 pt-0">
              <ActionCard
                titleMono
                title={`${formatNumber(
                  parseFloat(rewardsData?.reward_amount || "0"),
                  INDIVIDUAL_REWARD_AMOUNT_DISPLAY_TOKEN_DECIMALS[
                    SPONSORS[selectedSponsor?.slug as keyof typeof SPONSORS]
                      .ticker
                  ],
                )} ${SPONSORS[selectedSponsor?.slug as keyof typeof SPONSORS].ticker}`}
                description="Total Rewards Earned"
              />

              <div className="flex flex-col gap-2">
                <p className="secondary-text-style text-sm">
                  Transaction History
                </p>

                <div className="card-style flex flex-col">
                  {allEarnings.length > 0 ? (
                    <>
                      {allEarnings.map((earning, index) => (
                        <ListItem
                          href={
                            earning.reward_transaction_hash
                              ? SPONSOR_SCANNER_BASE_URL[
                                  selectedSponsor?.slug as keyof typeof SPONSOR_SCANNER_BASE_URL
                                ] + earning.reward_transaction_hash
                              : undefined
                          }
                          key={earning.id}
                          left={
                            <div className="flex flex-col">
                              <div className="flex items-center gap-2">
                                <p className="text-sm font-medium text-neutral-800 dark:text-white">
                                  {earning.distributed_at
                                    ? formatDate(earning.distributed_at, {
                                        month: "short",
                                        day: "numeric",
                                        year: "numeric",
                                      })
                                    : "Pending"}
                                </p>
                                <p className="secondary-text-style text-xs">
                                  Rank #{earning.leaderboard_position || "N/A"}
                                </p>
                              </div>

                              <p className="secondary-text-style text-sm">
                                Sent to: {earning.recipient_wallet?.slice(0, 6)}
                                ...
                                {earning.recipient_wallet?.slice(-4)}
                              </p>
                            </div>
                          }
                          right={
                            <div className="flex flex-col items-end">
                              <p className="flex items-center text-sm font-medium text-neutral-800 dark:text-white">
                                {formatNumber(
                                  parseFloat(earning.reward_amount || "0"),
                                  INDIVIDUAL_REWARD_AMOUNT_DISPLAY_TOKEN_DECIMALS[
                                    sponsorTokenTicker as keyof typeof INDIVIDUAL_REWARD_AMOUNT_DISPLAY_TOKEN_DECIMALS
                                  ],
                                )}{" "}
                                {sponsorTokenTicker}
                              </p>
                              {earning.reward_transaction_hash && (
                                <p className="secondary-text-style text-sm">
                                  Tx:{" "}
                                  {earning.reward_transaction_hash.slice(0, 6)}
                                  ...
                                  {earning.reward_transaction_hash.slice(-4)}
                                </p>
                              )}
                            </div>
                          }
                          className="w-full py-2"
                          first={index === 0}
                          last={index === allEarnings.length - 1}
                        />
                      ))}

                      {/* Show loading spinner when fetching more */}
                      {isFetchingNextPage && (
                        <div className="flex items-center justify-center p-4">
                          <Spinner />
                        </div>
                      )}
                    </>
                  ) : leaderboardEarnings ? (
                    <div className="flex h-32 items-center justify-center">
                      <p className="secondary-text-style text-sm">
                        No transaction history available
                      </p>
                    </div>
                  ) : (
                    <div className="flex h-32 items-center justify-center">
                      <div className="flex items-center gap-2">
                        <Spinner className="flex h-16 w-full items-center justify-center" />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {leaderboardEarningsError && (
                <div className="mt-4 flex items-center justify-center">
                  <p className="secondary-text-style text-sm">
                    {leaderboardEarningsError.message}
                  </p>
                </div>
              )}
            </div>
          </ScrollArea>
        </DrawerContent>
      </DrawerPortal>
    </Drawer>
  );
}
