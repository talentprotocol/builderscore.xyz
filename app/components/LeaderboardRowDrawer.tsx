"use client";

import Image from "next/image";
import { LeaderboardEntry } from "@/app/types/leaderboards";
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerPortal,
} from "@/app/components/ui/drawer";
import { Button } from "@/app/components/ui/button";
import { formatNumber, INDIVIDUAL_REWARD_AMOUNT_DISPLAY_TOKEN_DECIMALS } from "../lib/utils";
import { DialogTitle } from "@radix-ui/react-dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { useTheme } from "@/app/context/ThemeContext";
import { useSponsor } from "@/app/context/SponsorContext";
import ExternalLink from "./ExternalLink";

export default function LeaderboardRowDrawer({ selectedBuilder, weekly, context, onClose }: {
  selectedBuilder: LeaderboardEntry | null;
  weekly?: boolean;
  context?: string;
  onClose: () => void;
}) {
  const { isDarkMode } = useTheme();
  const { sponsorToken, selectedSponsorSlug } = useSponsor();

  return (
    <Drawer open={!!selectedBuilder} onOpenChange={onClose}>
      <DrawerPortal>
        <VisuallyHidden asChild>
          <DialogTitle>
            {selectedBuilder?.profile.name || "Builder"}
          </DialogTitle>
        </VisuallyHidden>
        <DrawerContent className={isDarkMode ? "bg-neutral-900" : "bg-white"}>
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
                  className="rounded-full object-cover h-[80px] w-[80px] mb-3"
                />
                <p
                  className={`${
                    isDarkMode ? "text-white" : "text-neutral-800"
                  } text-lg mb-3 text-center`}
                >
                  <span className="font-semibold">
                    {selectedBuilder.profile.name || "Builder"}
                  </span>

                  <br />

                  <span
                    className={`${
                      isDarkMode ? "text-neutral-500" : "text-neutral-600"
                    } text-sm`}
                  >
                    {context}
                  </span>
                </p>

                <div
                  className={`rounded-lg border w-full ${
                    isDarkMode
                      ? "bg-neutral-900 border-neutral-800"
                      : "bg-white border-neutral-300"
                  }`}
                >
                  <div className="flex justify-around p-4">
                    <div className="flex flex-col items-center justify-between">
                      <p
                        className={`${
                          isDarkMode ? "text-neutral-500" : "text-neutral-600"
                        } text-xs`}
                      >
                        Builder Score
                      </p>
                      <p className="text-2xl font-mono font-semibold">
                        {'builder_score' in selectedBuilder.profile
                          ? selectedBuilder.profile.builder_score?.points
                          : "-"}
                      </p>
                    </div>

                    <div className="flex flex-col items-center justify-between">
                      <p
                        className={`${
                          isDarkMode ? "text-neutral-500" : "text-neutral-600"
                        } text-xs`}
                      >
                        Rewards Earned
                      </p>
                      <p className="text-2xl font-mono">
                        <span className="font-semibold">
                          {formatNumber(
                            parseFloat(selectedBuilder.reward_amount || "0"),
                            INDIVIDUAL_REWARD_AMOUNT_DISPLAY_TOKEN_DECIMALS[
                              sponsorToken
                            ]
                          )}
                        </span>
                        <span
                          className={`${
                            isDarkMode ? "text-neutral-500" : "text-neutral-600"
                          } text-xs ml-2`}
                        >
                          {sponsorToken}
                        </span>
                      </p>
                    </div>

                    {context && (
                      <div className="flex flex-col items-center justify-between">
                        <p
                          className={`${
                            isDarkMode ? "text-neutral-500" : "text-neutral-600"
                          } text-sm`}
                        >
                          {weekly && weekly ? "Weekly" : "All Time"} Rank
                        </p>
                        <p className="text-lg font-mono font-semibold">
                          <span
                            className={`mr-2 ${
                              selectedBuilder.ranking_change === null
                                ? isDarkMode
                                  ? "text-neutral-500"
                                  : "text-neutral-600"
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
                                  ? `↓ ${selectedBuilder.ranking_change}`
                                  : `↑ ${selectedBuilder.ranking_change}`
                                : "0"
                              : "0"}
                          </span>

                          <span className={`font-mono mr-2`}>
                            #{selectedBuilder.leaderboard_position}
                          </span>
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {selectedBuilder.summary !== null
                  ? selectedBuilder.summary && (
                      <div
                        className={`rounded-lg border w-full p-4 mt-3 ${
                          isDarkMode
                            ? "bg-neutral-900 border-neutral-800"
                            : "bg-white border-neutral-300"
                        }`}
                      >
                        <div className="flex flex-col">
                          <p
                            className={`${
                              isDarkMode
                                ? "text-neutral-500"
                                : "text-neutral-600"
                            } text-sm mb-1`}
                          >
                            Summary
                          </p>
                          <div className="flex flex-col max-h-32 overflow-auto scrollbar-hide">
                            <p className={isDarkMode ? "" : "text-neutral-800"}>
                              {selectedBuilder.summary}
                            </p>
                          </div>
                        </div>
                      </div>
                    )
                  : selectedSponsorSlug === "base" &&
                    selectedBuilder.reward_amount &&
                    parseFloat(selectedBuilder.reward_amount) > 0 && (
                      <div
                        className={`rounded-lg border w-full p-4 mt-3 ${
                          isDarkMode
                            ? "bg-neutral-900 border-neutral-800"
                            : "bg-white border-neutral-300"
                        }`}
                      >
                        <div className="flex flex-col">
                          <p
                            className={`${
                              isDarkMode
                                ? "text-neutral-500"
                                : "text-neutral-600"
                            } text-sm mb-1`}
                          >
                            Summary
                          </p>
                          <div className="flex flex-col max-h-32 overflow-auto scrollbar-hide">
                            <p className={isDarkMode ? "" : "text-neutral-800"}>
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
                <ExternalLink
                  href={`https://app.talentprotocol.com/builderscore/${selectedBuilder.profile.id}`}
                >
                  <Button
                    size="lg"
                    className={`w-full cursor-pointer border mb-3 ${
                      isDarkMode
                        ? "bg-neutral-900 hover:bg-neutral-800 border-neutral-300 text-white"
                        : "bg-white hover:bg-neutral-100 border-neutral-300 text-neutral-800"
                    }`}
                  >
                    View Talent Profile
                  </Button>
                </ExternalLink>
              </DrawerFooter>
            </>
          )}
        </DrawerContent>
      </DrawerPortal>
    </Drawer>
  );
}
