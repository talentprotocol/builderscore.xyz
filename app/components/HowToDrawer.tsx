"use client";

import { Button } from "@/app/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerPortal,
  DrawerTitle,
  DrawerTrigger,
} from "@/app/components/ui/drawer";
import { useTheme } from "@/app/context/ThemeContext";
import { useState } from "react";

const EARNING_STEPS = [
  {
    text: "Connect GitHub on Talent Protocol",
    url: "https://app.talentprotocol.com/settings/connected_accounts",
  },
  {
    text: "Get your Human Checkmark",
    url: "https://docs.talentprotocol.com/docs/protocol-concepts/human-checkmark",
  },
  {
    text: "Increase your Builder Score to 40+",
    url: "https://app.talentprotocol.com/profile",
  },
];

export default function HowToDrawer() {
  const [openHowToEarn, setOpenHowToEarn] = useState(false);
  const { isDarkMode } = useTheme();

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
          How to Earn
        </Button>
      </DrawerTrigger>

      <DrawerPortal>
        <DrawerContent className={isDarkMode ? "bg-neutral-900" : "bg-white"}>
          <DrawerHeader className="text-left">
            <DrawerTitle className={isDarkMode ? "text-white" : "text-neutral-800"}>How to Earn</DrawerTitle>
          </DrawerHeader>

          <div className="px-4 pb-16">
            <p className={isDarkMode ? "text-neutral-500" : "text-neutral-600 mb-5"}>
              Talent Protocol distributes weekly rewards to builders that own
              verified contracts on Base or contribute to public repositories on
              Github. Follow the steps below to be eligible for Builder Rewards:
            </p>
            
            <ul className="list-none space-y-6 text-sm">
              {EARNING_STEPS.map((step, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className={`shrink-0 flex items-center justify-center w-5 h-5 rounded-full text-xs font-medium ${
                    isDarkMode ? "bg-neutral-700 text-white" : "bg-neutral-200 text-neutral-800"
                  }`}>
                    {index + 1}
                  </div>
                  <a 
                    href={step.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`
                      ${isDarkMode
                        ? "text-white hover:text-neutral-500"
                        : "text-neutral-800 hover:text-neutral-600"
                      }
                    `}
                  >
                    {step.text}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </DrawerContent>
      </DrawerPortal>
    </Drawer>
  );
}
