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

  return (
    <Drawer open={openHowToEarn} onOpenChange={setOpenHowToEarn}>
      <DrawerTrigger asChild>
        <Button
          size="lg"
          className="bg-neutral-900 hover:bg-neutral-800 border border-neutral-300 cursor-pointer"
        >
          How to Earn
        </Button>
      </DrawerTrigger>
      <DrawerPortal>
        <DrawerContent className="bg-neutral-900">
          <DrawerHeader className="text-left">
            <DrawerTitle className="text-white">How to Earn</DrawerTitle>
          </DrawerHeader>

          <div className="px-4 pb-16">
            <p className="text-neutral-500 mb-5">
              Talent Protocol distributes weekly rewards to builders that own
              verified contracts on Base or contribute to public repositories on
              Github. Follow the steps below to be eligible for Builder Rewards:
            </p>
            
            <ul className="list-none space-y-6 text-sm">
              {EARNING_STEPS.map((step, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="shrink-0 flex items-center justify-center w-5 h-5 bg-neutral-700 rounded-full text-xs font-medium">
                    {index + 1}
                  </div>
                  <a 
                    href={step.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white hover:text-neutral-500"
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
