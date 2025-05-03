"use client";

import MiniAppExternalLink from "@/app/components/MiniAppExternalLink";
import { Button } from "@/app/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerPortal,
  DrawerTitle,
  DrawerTrigger,
} from "@/app/components/ui/drawer";
import { useUser } from "@/app/context/UserContext";
import { Check } from "lucide-react";
import { useState } from "react";

export default function HowToDrawer() {
  const {
    isLoading: isUserLoading,
    hasBasenameCredential,
    talentProfile,
    frameContext,
    basename,
    builderScore,
  } = useUser();
  const [openHowToEarn, setOpenHowToEarn] = useState(false);

  const EARNING_STEPS = [
    {
      text: `Own a Basename ${basename ? `(${basename})` : ""}`,
      url: "https://www.base.org/names",
      condition: !isUserLoading && hasBasenameCredential,
    },
    {
      text: "Get your Human Checkmark",
      url: "https://docs.talentprotocol.com/docs/protocol-concepts/human-checkmark",
      condition: !isUserLoading && talentProfile?.human_checkmark,
    },
    {
      text: "Increase your Builder Score to 40+",
      url: "https://app.talentprotocol.com/profile",
      condition:
        !isUserLoading && builderScore?.points && builderScore?.points >= 40,
    },
  ];

  const allConditionsMet = EARNING_STEPS.every((step) => step.condition);

  return (
    <Drawer open={openHowToEarn} onOpenChange={setOpenHowToEarn}>
      <DrawerTrigger asChild>
        <Button
          size="lg"
          className="cursor-pointer border border-neutral-300 bg-white text-black hover:bg-neutral-100 dark:border-neutral-500 dark:bg-neutral-900 dark:text-white dark:hover:bg-neutral-800"
        >
          {allConditionsMet ? (
            <div className="flex items-center gap-2">
              <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green-100 text-xs font-medium text-green-500 dark:bg-green-500 dark:text-white">
                <Check className="h-3 w-3" />
              </div>
              Eligible to Earn
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

          <div className="px-4 pb-16">
            <p className="mb-5 text-neutral-600 dark:text-neutral-500">
              Talent Protocol distributes weekly rewards to builders that own
              verified contracts on Base and contribute to public crypto
              repositories on GitHub. Follow the steps below to be eligible:
            </p>
            {allConditionsMet ? (
              <p className="mb-6 text-sm text-green-500">
                You are eligible for Builder Rewards!
              </p>
            ) : (
              frameContext && (
                <p className="mb-6 text-sm text-neutral-600 dark:text-neutral-500">
                  You are not eligible for Builder Rewards yet.
                </p>
              )
            )}

            <ul className="list-none space-y-6 text-sm">
              {EARNING_STEPS.map((step, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div
                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs font-medium ${
                      step.condition
                        ? "bg-green-100 text-green-500 dark:bg-green-500 dark:text-white"
                        : "bg-neutral-200 text-neutral-800 dark:bg-neutral-700 dark:text-white"
                    }`}
                  >
                    {step.condition ? <Check className="h-3 w-3" /> : index + 1}
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

            <p className="mt-6 text-sm text-neutral-600 dark:text-neutral-500">
              Subject to{" "}
              <MiniAppExternalLink href="https://docs.talentprotocol.com/docs/legal/builder-rewards-terms-conditions">
                Terms and Conditions
              </MiniAppExternalLink>
              .
            </p>
          </div>
        </DrawerContent>
      </DrawerPortal>
    </Drawer>
  );
}
