"use client";

import ActionCard from "@/app/components/ActionCard";
import MiniAppExternalLink from "@/app/components/MiniAppExternalLink";
import ListItem from "@/app/components/rewards/ListItem";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerPortal,
  DrawerTitle,
} from "@/app/components/ui/drawer";
import { useSponsor } from "@/app/context/SponsorContext";
import { useUserLeaderboards } from "@/app/hooks/useRewards";
import { ALL_TIME_GRANT, SPONSORS } from "@/app/lib/constants";
import {
  INDIVIDUAL_REWARD_AMOUNT_DISPLAY_TOKEN_DECIMALS,
  formatDate,
  formatNumber,
} from "@/app/lib/utils";
import { LinkIcon } from "lucide-react";

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
  const { selectedSponsor } = useSponsor();

  const transactionHistory = [
    {
      date: "2025-01-01",
      amount: 0.02,
      rank: 8,
      address: "0x1234567890123456789012345678901234567890",
    },
    {
      date: "2025-01-02",
      amount: 0.1,
      rank: 7,
      address: "0x1234567890123456789012345678901234567890",
    },
    {
      date: "2025-01-03",
      amount: 0.1,
      rank: 6,
      address: "0x1234567890123456789012345678901234567890",
    },
  ];

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerPortal>
        <DrawerContent className="bg-white dark:bg-neutral-900">
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
                {transactionHistory.map((transaction, index) => (
                  <ListItem
                    key={transaction.date}
                    left={
                      <div className="flex flex-col">
                        <p className="text-sm font-semibold text-neutral-800 dark:text-white">
                          {formatDate(transaction.date, {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </p>
                        <p className="text-sm text-neutral-800 dark:text-white">
                          Rank #{transaction.rank}
                        </p>
                      </div>
                    }
                    right={
                      <MiniAppExternalLink
                        href={`https://basescan.org/tx/${transaction.address}`}
                      >
                        <div className="flex flex-col items-end">
                          <p className="flex items-center text-sm font-semibold text-neutral-800 dark:text-white">
                            {formatNumber(
                              transaction.amount,
                              INDIVIDUAL_REWARD_AMOUNT_DISPLAY_TOKEN_DECIMALS[
                                SPONSORS[
                                  selectedSponsor?.slug as keyof typeof SPONSORS
                                ].ticker
                              ],
                            )}{" "}
                            {
                              SPONSORS[
                                selectedSponsor?.slug as keyof typeof SPONSORS
                              ].ticker
                            }
                            <LinkIcon className="mt-[1px] ml-1 size-3 opacity-50" />
                          </p>
                          <p className="text-sm text-neutral-800 dark:text-white">
                            {transaction.address.slice(0, 6)}...
                            {transaction.address.slice(-4)}
                          </p>
                        </div>
                      </MiniAppExternalLink>
                    }
                    first={index === 0}
                    last={index === transactionHistory.length - 1}
                  />
                ))}
              </div>
            </div>
          </div>
        </DrawerContent>
      </DrawerPortal>
    </Drawer>
  );
}
