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
import { ALL_TIME_GRANT, SPONSORS } from "@/app/lib/constants";
import {
  INDIVIDUAL_REWARD_AMOUNT_DISPLAY_TOKEN_DECIMALS,
  formatDate,
  formatNumber,
} from "@/app/lib/utils";
import { ScrollArea } from "@radix-ui/react-scroll-area";

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

  const getScannerUrl = (txHash: string) => {
    const sponsorSlug = selectedSponsor?.slug;
    switch (sponsorSlug) {
      case "base":
        return `https://basescan.org/tx/${txHash}`;
      case "celo":
        return `https://celoscan.io/tx/${txHash}`;
      default:
        return `https://basescan.org/tx/${txHash}`;
    }
  };

  const getFilteredEarnings = () => {
    if (!leaderboardEarnings) return [];

    const allEarnings = leaderboardEarnings.pages
      .flatMap((page) => page.users)
      .filter((earning) => earning.distributed_at !== null)
      .filter(
        (earning) => new Date(earning.distributed_at!) > new Date("2025-03-01"),
      );
    const sponsorSlug = selectedSponsor?.slug;

    return allEarnings.filter((earning) => {
      const rewardAmount = parseFloat(earning.reward_amount || "0");

      switch (sponsorSlug) {
        case "base":
          return rewardAmount < 1; // Show only earnings below 0 for base
        case "celo":
          return rewardAmount >= 1; // Show only earnings above 0 for celo
        default:
          return false; // Show no earnings for other sponsors
      }
    });
  };

  const filteredEarnings = getFilteredEarnings();

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
                  {filteredEarnings.length > 0 ? (
                    <>
                      {filteredEarnings.map((earning, index) => (
                        <ListItem
                          href={
                            earning.reward_transaction_hash
                              ? getScannerUrl(earning.reward_transaction_hash)
                              : undefined
                          }
                          key={earning.id}
                          left={
                            <div className="flex flex-col">
                              <p className="text-sm font-medium text-neutral-800 dark:text-white">
                                {earning.distributed_at
                                  ? formatDate(earning.distributed_at, {
                                      month: "short",
                                      day: "numeric",
                                      year: "numeric",
                                    })
                                  : "Pending"}
                              </p>
                              <p className="text-sm text-neutral-800 dark:text-white">
                                Rank #{earning.leaderboard_position || "N/A"}
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
                                  {earning.reward_transaction_hash.slice(0, 6)}
                                  ...
                                  {earning.reward_transaction_hash.slice(-4)}
                                </p>
                              )}
                            </div>
                          }
                          className="w-full py-2"
                          first={index === 0}
                          last={index === filteredEarnings.length - 1}
                        />
                      ))}

                      {/* Load more button or infinite scroll trigger */}
                      {hasNextPage && (
                        <div className="flex justify-center py-4">
                          <button
                            onClick={() => fetchNextPage()}
                            disabled={isFetchingNextPage}
                            className="secondary-text-style text-sm hover:text-neutral-800 disabled:opacity-50 dark:hover:text-white"
                          >
                            {isFetchingNextPage ? (
                              <div className="flex items-center gap-2">
                                <Spinner />
                                Loading more...
                              </div>
                            ) : (
                              "Load more"
                            )}
                          </button>
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
                        <Spinner />
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
