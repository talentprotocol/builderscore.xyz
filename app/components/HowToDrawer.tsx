"use client";

import { Button } from "@/app/components/ui/button";
import { Check } from "lucide-react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerPortal,
  DrawerTitle,
  DrawerTrigger,
} from "@/app/components/ui/drawer";
import { useUser } from "@/app/context/UserContext";
import { useTheme } from "@/app/context/ThemeContext";
import { useState } from "react";
import ExternalLink from "@/app/components/ExternalLink";
export default function HowToDrawer() {
  const { isLoading: isUserLoading, hasGithubCredential, talentProfile } = useUser();
  const [openHowToEarn, setOpenHowToEarn] = useState(false);
  const { isDarkMode } = useTheme();

  const EARNING_STEPS = [
    {
      text: "Connect GitHub on Talent Protocol",
      url: "https://app.talentprotocol.com/settings/connected_accounts",
      condition: !isUserLoading && hasGithubCredential,
    },
    {
      text: "Get your Human Checkmark",
      url: "https://docs.talentprotocol.com/docs/protocol-concepts/human-checkmark",
      condition: !isUserLoading && talentProfile?.human_checkmark,
    },
    {
      text: "Increase your Builder Score to 100+",
      url: "https://app.talentprotocol.com/profile",
      condition: !isUserLoading && talentProfile?.builder_score?.points && talentProfile?.builder_score?.points >= 100,
    },
  ];

  const allConditionsMet = EARNING_STEPS.every((step) => step.condition);

  return (
    <Drawer open={openHowToEarn} onOpenChange={setOpenHowToEarn}>
      <DrawerTrigger asChild>
        <Button
          size="lg"
          className={`cursor-pointer border
            ${isDarkMode 
              ? "bg-neutral-900 hover:bg-neutral-800 border-neutral-300 text-white" 
              : "bg-white hover:bg-neutral-100 border-neutral-200 text-black"
            }
          `}
        >
          {allConditionsMet ? (
            <div className="flex items-center gap-2">
              <div className={`shrink-0 flex items-center justify-center w-5 h-5 rounded-full text-xs font-medium ${
                isDarkMode
                  ? "bg-green-500 text-white"
                  : "bg-green-100 text-green-500"
              }`}>
                <Check className="w-3 h-3" />
              </div>
              Eligible to Earn
            </div>
          ) : (
            "How to Earn"
          )}
        </Button>
      </DrawerTrigger>

      <DrawerPortal>
        <DrawerContent className={isDarkMode ? "bg-neutral-900" : "bg-white"}>
          <DrawerHeader className="text-left">
            <DrawerTitle className={isDarkMode ? "text-white" : "text-neutral-800"}>How to Earn</DrawerTitle>
          </DrawerHeader>

          <div className="px-4 pb-16">
            <p className={`mb-5 ${isDarkMode ? "text-neutral-500" : "text-neutral-600"}`}>
              Talent Protocol distributes weekly rewards to builders that own
              verified contracts on Base or contribute to public repositories on
              Github. Follow the steps below to be eligible for Builder Rewards:
            </p>

            {allConditionsMet ? (
              <p className="text-green-500 mb-6 text-sm">
                You are eligible for Builder Rewards!
              </p>
            ) : (
              <p className={`mb-6 text-sm ${isDarkMode ? "text-neutral-500" : "text-neutral-600"}`}>
                You are not eligible for Builder Rewards yet.
              </p>
            )}
            
            <ul className="list-none space-y-6 text-sm">
              {EARNING_STEPS.map((step, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className={`shrink-0 flex items-center justify-center w-5 h-5 rounded-full text-xs font-medium ${
                    step.condition
                      ? isDarkMode
                        ? "bg-green-500 text-white"
                        : "bg-green-100 text-green-500"
                      : isDarkMode
                        ? "bg-neutral-700 text-white"
                        : "bg-neutral-200 text-neutral-800"
                  }`}>
                    {step.condition ? (
                      <Check className="w-3 h-3" />
                    ) : (
                      index + 1
                    )}
                  </div>
                  <ExternalLink
                    href={step.url}
                    className={`
                      underline
                      ${isDarkMode
                        ? "text-white hover:text-neutral-500"
                        : "text-neutral-800 hover:text-neutral-600"
                      }
                    `}
                  >
                    {step.text}
                  </ExternalLink>
                </li>
              ))}
            </ul>
          </div>
        </DrawerContent>
      </DrawerPortal>
    </Drawer>
  );
}
