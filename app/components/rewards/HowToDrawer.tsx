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

export default function HowToDrawer() {
  const [openHowToEarn, setOpenHowToEarn] = useState(false);
  const { selectedSponsor } = useSponsor();
  const { frameContext } = useUser();

  const sponsorConfig = useHowToEarn(selectedSponsor!);

  const allConditionsMet = sponsorConfig?.steps
    .filter((step) => step.required)
    .every((step) => step.condition);

  return (
    <Drawer open={openHowToEarn} onOpenChange={setOpenHowToEarn}>
      <DrawerTrigger asChild>
        <Button
          size="lg"
          className="button-style h-6 w-1/2 cursor-pointer pl-2 text-xs sm:w-36"
        >
          {allConditionsMet ? (
            <div className="flex items-center gap-1">
              <Check className="h-3 w-3 text-green-500" />
              <span className="hidden sm:block">Eligible to Earn</span>
              <span className="block sm:hidden">Eligible</span>
            </div>
          ) : (
            "How to Earn"
          )}
        </Button>
      </DrawerTrigger>

      <DrawerPortal>
        <DrawerContent className="bg-white dark:bg-neutral-900">
          <DrawerHeader className="text-left">
            <DrawerTitle className="text-neutral-800 dark:text-white">
              How to Earn
            </DrawerTitle>
          </DrawerHeader>

          <div className="px-4 pb-10">
            <p className="mb-5 text-neutral-600 dark:text-neutral-500">
              {sponsorConfig?.description}
            </p>

            <p className="mb-6 text-sm text-neutral-600 dark:text-neutral-500">
              {frameContext
                ? "How to be eligible:"
                : "Open this app on Farcaster to check your eligibility."}
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
                    className="text-neutral-800 hover:text-neutral-600 dark:text-white dark:hover:text-neutral-500"
                  >
                    {step.text}
                  </MiniAppExternalLink>
                </li>
              ))}
            </ul>

            <p className="secondary-text-style mt-6 text-sm">
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
          </div>

          {!frameContext && (
            <DrawerFooter className="pt-0">
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
            </DrawerFooter>
          )}
        </DrawerContent>
      </DrawerPortal>
    </Drawer>
  );
}
