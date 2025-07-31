"use client";

import MiniAppExternalLink from "@/app/components/MiniAppExternalLink";
import DrawerContent from "@/app/components/rewards/DrawerContent";
import { Button } from "@/app/components/ui/button";
import {
  Drawer,
  DrawerFooter,
  DrawerHeader,
  DrawerPortal,
  DrawerTitle,
  DrawerTrigger,
} from "@/app/components/ui/drawer";
import { useSponsor } from "@/app/context/SponsorContext";
import { useUser } from "@/app/context/UserContext";
import { useHowToEarn } from "@/app/hooks/useHowToEarn";
import {
  SPONSOR_FARCASTER_MINI_APP_URLS,
  SPONSOR_TERMS,
} from "@/app/lib/constants";
import { Check, X } from "lucide-react";
import { useState } from "react";

export default function HowToDrawer({
  open: externalOpen,
  onOpenChange: externalOnOpenChange,
  trigger = true,
}: {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: boolean;
}) {
  const [internalOpen, setInternalOpen] = useState(false);
  const { selectedSponsor } = useSponsor();
  const { frameContext } = useUser();

  // Use external control if provided, otherwise use internal state
  const openHowToEarn = externalOpen !== undefined ? externalOpen : internalOpen;
  const setOpenHowToEarn = externalOnOpenChange || setInternalOpen;

  const sponsorConfig = useHowToEarn(selectedSponsor!);

  const allConditionsMet = sponsorConfig?.steps
    .filter((step) => step.required)
    .every((step) => step.condition);

  return (
    <Drawer open={openHowToEarn} onOpenChange={setOpenHowToEarn}>
      {trigger && frameContext && (
        <DrawerTrigger asChild>
          <Button
            size="lg"
            className="button-style h-6 w-1/2 cursor-pointer text-xs sm:w-36"
          >
            {allConditionsMet ? (
              <div className="flex items-center gap-1">
                <Check className="h-3 w-3 text-green-500" />
                <span className="hidden sm:block">Eligible to Earn</span>
                <span className="block sm:hidden">Eligible</span>
              </div>
            ) : (
              "Start Earning"
            )}
          </Button>
        </DrawerTrigger>
      )}

      <DrawerPortal>
        <DrawerContent className="bg-white dark:bg-neutral-900">
          <DrawerHeader className="text-left">
            <DrawerTitle className="text-neutral-800 dark:text-white">
              Start Earning
            </DrawerTitle>
          </DrawerHeader>

          <div className="px-4 pb-10">
            <p className="mb-5 text-neutral-600 dark:text-neutral-500">
              {sponsorConfig?.description}
            </p>

            <p className="mb-6 text-sm text-neutral-600 dark:text-neutral-500">
              {frameContext
                ? "How to be eligible:"
                : "To qualify for the Builder Rewards program, you need:"}
            </p>

            <ul className="list-none space-y-6 text-sm">
              {sponsorConfig?.steps.map((step, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div
                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs font-medium ${
                      step.condition
                        ? "bg-green-100 text-green-500 dark:bg-green-500 dark:text-white"
                        : "bg-neutral-200 text-neutral-800 dark:bg-neutral-700 dark:text-white"
                    }`}
                  >
                    {step.condition ? (
                      <Check className="h-3 w-3" />
                    ) : (
                      <X className="h-3 w-3" />
                    )}
                  </div>
                  <MiniAppExternalLink
                    href={step.url}
                    className="text-neutral-800 hover:text-neutral-600 dark:text-white dark:hover:text-neutral-500 underline"
                  >
                    {step.text}
                  </MiniAppExternalLink>
                </li>
              ))}
            </ul>

            <p className="mb-1 mt-6 text-sm text-neutral-600 dark:text-neutral-500">
            To make sure you’ve met the eligibility requirements and to track your progress, log in through Farcaster or Base App. The leaderboard updates every 24 hours.
            </p>

          </div>

          {!frameContext && (
            <DrawerFooter className="pt-0">
              {(selectedSponsor?.slug === "base" || selectedSponsor?.slug === "base-summer") ? (
                <div className="flex gap-3 w-full">
                  <MiniAppExternalLink
                    href="https://farcaster.xyz/miniapps/003OFAiGOJCy/base-builder-rewards"
                    className="w-full"
                  >
                    <Button
                      size="lg"
                      className="mb-3 w-full cursor-pointer border border-neutral-300 bg-white text-neutral-800 hover:bg-neutral-100 dark:border-neutral-500 dark:bg-neutral-900 dark:text-white dark:hover:bg-neutral-800"
                    >
                      Open in Farcaster
                    </Button>
                  </MiniAppExternalLink>
                  
                  <MiniAppExternalLink
                    href="https://wallet.coinbase.com/post/0x6fb0a77986581448cf2d31b25ad4304f6659b36a"
                    className="w-full"
                  >
                    <Button
                      size="lg"
                      className="mb-3 w-full cursor-pointer border border-neutral-300 bg-white text-neutral-800 hover:bg-neutral-100 dark:border-neutral-500 dark:bg-neutral-900 dark:text-white dark:hover:bg-neutral-800"
                    >
                      Open in Base App
                    </Button>
                  </MiniAppExternalLink>
                </div>
              ) : (
                <MiniAppExternalLink
                  href={
                    SPONSOR_FARCASTER_MINI_APP_URLS[
                      selectedSponsor?.slug as keyof typeof SPONSOR_FARCASTER_MINI_APP_URLS
                    ]
                  }
                  className="w-full"
                >
                  <Button
                    size="lg"
                    className="mb-3 w-full cursor-pointer border border-neutral-300 bg-white text-neutral-800 hover:bg-neutral-100 dark:border-neutral-500 dark:bg-neutral-900 dark:text-white dark:hover:bg-neutral-800"
                  >
                    Open Mini App
                  </Button>
                </MiniAppExternalLink>
              )}
              
              <p className="secondary-text-style mt-3 text-center text-sm">
                Subject to{" "}
                <MiniAppExternalLink
                  href={
                    selectedSponsor?.slug
                      ? SPONSOR_TERMS[
                          selectedSponsor?.slug as
                            | keyof typeof SPONSOR_TERMS
                            | "default"
                        ]
                      : SPONSOR_TERMS["default"]
                  }
                >
                  Terms and Conditions
                </MiniAppExternalLink>
                .
              </p>
            </DrawerFooter>
          )}
        </DrawerContent>
      </DrawerPortal>
    </Drawer>
  );
}
