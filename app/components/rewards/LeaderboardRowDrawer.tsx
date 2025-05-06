"use client";

import MiniAppExternalLink from "@/app/components/MiniAppExternalLink";
import { Button } from "@/app/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerPortal,
} from "@/app/components/ui/drawer";
import { useSponsor } from "@/app/context/SponsorContext";
import {
  INDIVIDUAL_REWARD_AMOUNT_DISPLAY_TOKEN_DECIMALS,
  formatNumber,
} from "@/app/lib/utils";
import { LeaderboardEntry } from "@/app/types/rewards/leaderboards";
import { DialogTitle } from "@radix-ui/react-dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import Image from "next/image";

export default function LeaderboardRowDrawer({
  selectedBuilder,
  weekly,
  context,
  onClose,
}: {
  selectedBuilder: LeaderboardEntry | null;
  weekly?: boolean;
  context?: string;
  onClose: () => void;
}) {
  const { sponsorTokenTicker, selectedSponsor } = useSponsor();

  return (
    <Drawer open={!!selectedBuilder} onOpenChange={onClose}>
      <DrawerPortal>
        <VisuallyHidden asChild>
          <DialogTitle>
            {selectedBuilder?.profile.name || "Builder"}
          </DialogTitle>
        </VisuallyHidden>
        <DrawerContent className="bg-white dark:bg-neutral-900">
          {selectedBuilder && selectedBuilder.profile && (
            <>
              <div className="flex flex-col items-center justify-center p-4">
                <Image
                  src={
                    selectedBuilder.profile.image_url?.startsWith("http")
                      ? selectedBuilder.profile.image_url
                      : ""
                  }
                  alt={selectedBuilder.profile.name || "Builder"}
                  width={80}
                  height={80}
                  className="mb-3 h-[80px] w-[80px] rounded-full object-cover"
                />
                <p className="mb-3 text-center text-lg text-neutral-800 dark:text-white">
                  <span className="font-semibold">
                    {selectedBuilder.profile.name || "Builder"}
                  </span>

                  <br />

                  <span className="text-sm text-neutral-600 dark:text-neutral-500">
                    {context}
                  </span>
                </p>

                <div className="w-full rounded-lg border border-neutral-300 bg-white dark:border-neutral-800 dark:bg-neutral-900">
                  <div className="flex justify-around p-4">
                    <div className="flex flex-col items-center justify-between">
                      <p className="text-xs text-neutral-600 dark:text-neutral-500">
                        Builder Score
                      </p>
                      <p className="font-mono text-2xl font-semibold">
                        {"builder_score" in selectedBuilder.profile
                          ? selectedBuilder.profile.builder_score?.points
                          : "-"}
                      </p>
                    </div>

                    <div className="flex flex-col items-center justify-between">
                      <p className="text-xs text-neutral-600 dark:text-neutral-500">
                        Rewards Earned
                      </p>
                      <p className="font-mono text-2xl font-semibold">
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
                            <span className="ml-2 text-xs font-normal text-neutral-600 dark:text-neutral-500">
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
                        <p className="text-sm text-neutral-600 dark:text-neutral-500">
                          {weekly && weekly ? "Weekly" : "All Time"} Rank
                        </p>
                        <p className="font-mono text-lg font-semibold">
                          <span className={`mr-2 font-mono`}>
                            #
                            {selectedBuilder.leaderboard_position
                              ? selectedBuilder.leaderboard_position
                              : "-"}
                          </span>

                          <span
                            className={`ml-2 ${
                              selectedBuilder.ranking_change === null
                                ? "text-neutral-600 dark:text-neutral-500"
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
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {selectedBuilder.summary !== null
                  ? selectedBuilder.summary && (
                      <div className="mt-3 w-full rounded-lg border border-neutral-300 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
                        <div className="flex flex-col">
                          <p className="mb-1 text-sm text-neutral-600 dark:text-neutral-500">
                            Summary
                          </p>
                          <div className="scrollbar-hide flex max-h-32 flex-col overflow-auto">
                            <p className="text-neutral-800 dark:text-white">
                              {selectedBuilder.summary}
                            </p>
                          </div>
                        </div>
                      </div>
                    )
                  : selectedSponsor?.slug === "base" &&
                    selectedBuilder.reward_amount &&
                    parseFloat(selectedBuilder.reward_amount) > 0 && (
                      <div className="mt-3 w-full rounded-lg border border-neutral-300 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
                        <div className="flex flex-col">
                          <p className="mb-1 text-sm text-neutral-600 dark:text-neutral-500">
                            Summary
                          </p>
                          <div className="scrollbar-hide flex max-h-32 flex-col overflow-auto">
                            <p className="text-neutral-800 dark:text-white">
                              {selectedBuilder.profile.name} earned Rewards for
                              transactions on previously deployed verified Smart
                              Contracts.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
              </div>

              <DrawerFooter className="pt-0">
                <MiniAppExternalLink
                  href={`https://app.talentprotocol.com/builderscore/${selectedBuilder.profile.id}`}
                >
                  <Button
                    size="lg"
                    className="mb-3 w-full cursor-pointer border border-neutral-300 bg-white text-neutral-800 hover:bg-neutral-100 dark:border-neutral-500 dark:bg-neutral-900 dark:text-white dark:hover:bg-neutral-800"
                  >
                    View Talent Profile
                  </Button>
                </MiniAppExternalLink>
              </DrawerFooter>
            </>
          )}
        </DrawerContent>
      </DrawerPortal>
    </Drawer>
  );
}
